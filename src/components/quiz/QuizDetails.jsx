import clsx from 'clsx';
import Button from 'components/common/Button';
import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownTrigger
} from 'components/common/Dropdown';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses, QuestionTabs, QuizStatuses, url } from 'utils/constants';
import AddToCollectionModal from './AddToCollectionModal';

const QuizDetails = () => {
    const { accountId, quizId, createdBy } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null,
        questions: []
    });
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [areCorrectAnswersShowed, setAreCorrectAnswersShowed] = useState(false);
    const [tab, setTab] = useState(QuestionTabs.All);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);

        fetch(`http://localhost:5184/api/accounts/${createdBy}/quizzes/${quizId}/qa/${accountId}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                setQuiz(data);
            })
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId, quizId]);

    const handleRemove = () => {
        fetch(`${url}/api/accounts/${accountId}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return navigate(`/accounts/${accountId}/quizzes`);
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleSave = () => {
        fetch(`${url}/api/accounts/${accountId}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: quizId,
                title: quiz.title,
                description: quiz.description,
                status: quiz.status,
                isSaved: quiz.isSaved ? false : true
            })
        })
            .then(response => {
                if (response.ok) {
                    quiz.isSaved = quiz.isSaved ? false : true;
                    setQuiz({ ...quiz });
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleStar = id => {
        const { questions = [] } = quiz;
        const question = questions.find(it => it.id == id);
        question.isStarred = question.isStarred ? false : true;

        fetch(`${url}/api/quizzes/${quizId}/questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id,
                text: question.text,
                isStarred: question.isStarred
            })
        })
            .then(response => {
                if (response.ok) {
                    const newQuestions = questions.map(it => (it.id == id ? question : it));

                    setQuiz({ ...quiz, questions: newQuestions });
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleSelectTab = value => setTab(value);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);

    if (fetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex-1 flex justify-center items-center p-4">Spining...</div>;

    const starredQuestions = quiz.questions.filter(it => it.isStarred);

    const filteredQuestions = tab == QuestionTabs.All ? quiz.questions : starredQuestions;

    return (
        <>
            <div className="w-full h-full flex flex-col gap-4 p-4 overflow-y-auto max-w-6xl mx-auto">
                <div className="flex flex-col items-center gap-2 justify-between">
                    <div className="flex justify-between w-full gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <p className="flex items-center gap-2">
                                {quiz.title}
                                <div className="px-2 py-1 border border-solid border-black text-sm w-fit">
                                    {quiz.status == QuizStatuses.Draft ? 'Draft' : 'Published'}
                                </div>
                            </p>
                            <p className="text-sm line-clamp-2">{quiz.description}</p>
                        </div>
                        <Dropdown className="h-fit" position="bottom-right">
                            <DropdownTrigger>
                                <Button>Menu</Button>
                            </DropdownTrigger>
                            <DropdownContent className="top-full">
                                <DropdownItem to={`/accounts/${accountId}/quizzes/${quizId}/edit`}>
                                    Edit
                                </DropdownItem>
                                <DropdownItem onSelect={handleRemove}>Remove</DropdownItem>
                                <DropdownItem onSelect={handleSave}>
                                    {quiz.isSaved ? 'Remove from saved' : 'Add to saved'}
                                </DropdownItem>
                                <DropdownItem onSelect={handleOpenModal}>
                                    Add to collection
                                </DropdownItem>
                            </DropdownContent>
                        </Dropdown>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <Link
                            className="flex-1"
                            to={`/accounts/${accountId}/quizzes/${quizId}/test`}
                        >
                            <Button className="w-full">Test</Button>
                        </Link>
                        <Link
                            className="flex-1"
                            to={`/accounts/${accountId}/quizzes/${quizId}/learn`}
                        >
                            <Button className="w-full">Learn</Button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p>Questions in this quiz ({quiz.questions.length})</p>
                    <div className="flex items-center gap-2">
                        <Button
                            className={clsx(tab == QuestionTabs.All ? 'bg-black text-white' : '')}
                            onClick={() => handleSelectTab(QuestionTabs.All)}
                        >
                            All
                        </Button>
                        <Button
                            className={clsx(
                                tab == QuestionTabs.Starred ? 'bg-black text-white' : ''
                            )}
                            onClick={() => handleSelectTab(QuestionTabs.Starred)}
                        >
                            Starred ({starredQuestions.length})
                        </Button>
                    </div>
                </div>
                <Button
                    className="w-fit"
                    onClick={() => {
                        setAreCorrectAnswersShowed(areCorrectAnswersShowed ? false : true);
                    }}
                >
                    {areCorrectAnswersShowed ? 'Hide correct answers' : 'Show correct answers'}
                </Button>
                {filteredQuestions.map((question, index) => {
                    const { text, answers, id, isStarred } = question;

                    return (
                        <div key={id} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-2">
                                    {index + 1}/<p>{text}</p>
                                </p>
                                <Button onClick={() => handleStar(id)}>
                                    {isStarred ? 'Unstar' : 'Star'}
                                </Button>
                            </div>
                            <div className="flex flex-col items-center gap-4 flex-wrap">
                                {answers.map(answer => {
                                    const { text, id, isCorrect } = answer;

                                    return (
                                        <Button
                                            key={id}
                                            className={clsx(
                                                'w-full text-left',
                                                areCorrectAnswersShowed && isCorrect
                                                    ? 'bg-green-200'
                                                    : ''
                                            )}
                                        >
                                            {text}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {isModalOpen && <AddToCollectionModal onClose={handleCloseModal} />}
        </>
    );
};

export default QuizDetails;
