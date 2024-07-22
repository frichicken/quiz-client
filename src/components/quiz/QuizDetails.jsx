import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses, QuizStatuses } from 'utils/constants';

const QuizDetails = () => {
    const { accountId, quizId } = useParams();
    const [quizFetchStatus, setQuizFetchStatus] = useState(FetchStatuses.None);
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null,
        questions: []
    });
    const [deleteQuizFetchStatus, setDeleteQuizFetchStatus] = useState(FetchStatuses.None);
    const [areCorrectAnswersShowed, setAreCorrectAnswersShowed] = useState(false);
    const navigate = useNavigate();
    const [isMenuDropdownOpen, setIsMenuDropdown] = useState(false);

    useEffect(() => {
        setQuizFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}/details`, {
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
            .finally(() => setQuizFetchStatus(FetchStatuses.None));
    }, [accountId, quizId]);

    const handleDeleteQuiz = () => {
        setDeleteQuizFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}`, {
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
            .catch(error => console.error(error))
            .finally(() => setDeleteQuizFetchStatus(FetchStatuses.None));
    };

    const toggleMenuDropdown = () => setIsMenuDropdown(isMenuDropdownOpen ? false : true);

    if (quizFetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex-1 flex justify-center items-center p-4">Spining...</div>;

    return (
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
                    <div className="relative h-fit">
                        <Button onClick={toggleMenuDropdown}>Menu</Button>
                        {isMenuDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
                                <Link
                                    className="w-full"
                                    to={`/accounts/${accountId}/quizzes/${quizId}/edit`}
                                >
                                    <Button className="w-full border-none text-left">Edit</Button>
                                </Link>
                                <Button
                                    className="w-full border-none text-left"
                                    onClick={handleDeleteQuiz}
                                >
                                    {deleteQuizFetchStatus == FetchStatuses.Loading
                                        ? 'Spining...'
                                        : 'Remove'}
                                </Button>
                                <Button className="w-full border-none text-left">
                                    Add to saved
                                </Button>
                                <Button className="w-full border-none text-left">
                                    Add to collection
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <Link className="flex-1" to={`/accounts/${accountId}/quizzes/${quizId}/play`}>
                        <Button className="w-full">Test</Button>
                    </Link>
                    <Link className="flex-1" to={`/accounts/${accountId}/quizzes/${quizId}/play`}>
                        <Button className="w-full">Learn</Button>
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <p>Questions in this quiz ({quiz.questions.length})</p>
                <div className="flex items-center gap-2">
                    <Button>All</Button>
                    <Button>Starred (2)</Button>
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
            {quiz.questions.map((question, index) => {
                const { text, answers, id } = question;

                return (
                    <div key={id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className='flex items-center gap-2'>
                                {index + 1}/<p>{text}</p>
                            </p>
                            <Button>Star</Button>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            {answers.map(answer => {
                                const { text, id, isCorrect } = answer;

                                return (
                                    <Button
                                        key={id}
                                        className={clsx(
                                            'min-w-40',
                                            areCorrectAnswersShowed && isCorrect
                                                ? 'text-white bg-black'
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
    );
};

export default QuizDetails;
