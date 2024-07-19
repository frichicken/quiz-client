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

    if (quizFetchStatus == FetchStatuses.Loading)
        return (
            <div className="w-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <div className="w-full h-full flex flex-col gap-4 border border-solid border-black p-4 overflow-y-auto">
            <div
                onClick={event => {
                    event.preventDefault();
                    history.back();
                }}
                className="text-blue-300 underline cursor-pointer"
            >
                Back?
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-2">
                        {quiz.title}
                        <div className="px-2 py-1 border border-solid border-black text-sm w-fit">
                            {quiz.status == QuizStatuses.Draft ? 'Draft' : 'Published'}
                        </div>
                    </p>
                    <p className="text-sm">{quiz.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to={`/accounts/${accountId}/quizzes/${quizId}/play`}>
                        <Button>Play</Button>
                    </Link>
                    <Link to={`/accounts/${accountId}/quizzes/${quizId}/edit`}>
                        <Button>Edit</Button>
                    </Link>
                    <Button onClick={handleDeleteQuiz}>
                        {deleteQuizFetchStatus == FetchStatuses.Loading ? 'Spining...' : 'Delete'}
                    </Button>
                </div>
            </div>
            <Button
                className="w-fit"
                onClick={() => {
                    setAreCorrectAnswersShowed(areCorrectAnswersShowed ? false : true);
                }}
            >
                Show correct answers
            </Button>
            {quiz.questions.map((question, index) => {
                const { text, answers, id } = question;

                return (
                    <div key={id} className="flex flex-col gap-2">
                        <p>{index + 1}/</p>
                        <p>{text}</p>
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
