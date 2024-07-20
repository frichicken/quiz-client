import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses, QuizStatuses } from 'utils/constants';

function Quizzes() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const { accountId } = useParams();

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes`)
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleDeleteQuiz = quizId => {
        const quiz = quizzes.find(it => it.id == quizId);
        quiz.fetchStatus = FetchStatuses.Loading;
        setQuizzes(quizzes.map(it => (it.id == quizId ? quiz : it)));
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    setQuizzes(quizzes.filter(quiz => quiz.id != quizId));
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const drafts = quizzes.filter(it => it.status == QuizStatuses.Draft);
    const publishedQuizzes = quizzes.filter(it => it.status == QuizStatuses.Published);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-end">
                <input
                    className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                    name="keyword"
                    placeholder="Your grandma is going to check your search history"
                />
            </div>
            {fetchStatus == FetchStatuses.Loading ? (
                <div className="w-full flex-1 flex justify-center items-center p-2">
                    ...
                </div>
            ) : (
                <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto">
                    {drafts.length > 0 && (
                        <>
                            <p>In progress</p>
                            <div className="w-full flex flex-col gap-2 p-2">
                                {drafts.map(quiz => {
                                    const {
                                        title,
                                        description,
                                        id,
                                        totalQuestions,
                                        createdAt,
                                        status,
                                        fetchStatus
                                    } = quiz;
                                    return (
                                        <div
                                            key={id}
                                            className="gap-4 text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                            onClick={() => {
                                                navigate(`/accounts/${accountId}/quizzes/${id}`);
                                            }}
                                        >
                                            <div className="flex-1">
                                                <p>{title}</p>
                                                <p className="text-sm line-clamp-2">
                                                    {description}
                                                </p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                                                        {totalQuestions} Questions
                                                    </div>
                                                    <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                                                        {new Date(createdAt).toDateString()}
                                                    </div>
                                                    <div className="px-2 py-1 border border-solid border-black text-sm w-fit flex-shrink-0">
                                                        {status == QuizStatuses.Draft
                                                            ? 'Draft'
                                                            : 'Published'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Button
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        navigate(
                                                            `/accounts/${accountId}/quizzes/${id}/play`
                                                        );
                                                    }}
                                                >
                                                    Play
                                                </Button>
                                                <Button
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        navigate(
                                                            `/accounts/${accountId}/quizzes/${id}/edit`
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        handleDeleteQuiz(id);
                                                    }}
                                                >
                                                    {fetchStatus == FetchStatuses.Loading
                                                        ? 'Spining...'
                                                        : 'Delete'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    <p>Published</p>
                    <div className="w-full flex flex-col gap-2 p-2">
                        {publishedQuizzes.map(quiz => {
                            const {
                                title,
                                description,
                                id,
                                totalQuestions,
                                createdAt,
                                status,
                                fetchStatus
                            } = quiz;
                            return (
                                <div
                                    key={id}
                                    className="gap-4 text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                    onClick={() => {
                                        navigate(`/accounts/${accountId}/quizzes/${id}`);
                                    }}
                                >
                                    <div className="flex-1">
                                        <p>{title}</p>
                                        <p className="text-sm line-clamp-2">{description}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                                                {totalQuestions} Questions
                                            </div>
                                            <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                                                {new Date(createdAt).toDateString()}
                                            </div>
                                            <div className="px-2 py-1 border border-solid border-black text-sm w-fit flex-shrink-0">
                                                {status == QuizStatuses.Draft
                                                    ? 'Draft'
                                                    : 'Published'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            onClick={event => {
                                                event.stopPropagation();
                                                navigate(
                                                    `/accounts/${accountId}/quizzes/${id}/play`
                                                );
                                            }}
                                        >
                                            Play
                                        </Button>
                                        <Button
                                            onClick={event => {
                                                event.stopPropagation();
                                                navigate(
                                                    `/accounts/${accountId}/quizzes/${id}/edit`
                                                );
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={event => {
                                                event.stopPropagation();
                                                handleDeleteQuiz(id);
                                            }}
                                        >
                                            {fetchStatus == FetchStatuses.Loading
                                                ? 'Spining...'
                                                : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Quizzes;
