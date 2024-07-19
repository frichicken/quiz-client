import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

const AddQuizModal = ({ onClose, onSelect, selectedQuizIds }) => {
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [quizzes, setQuizzes] = useState([]);
    const { accountId } = useParams();

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes`)
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    if (fetchStatus == FetchStatuses.Loading)
        return (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] w-full h-screen flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 p-4 w-full max-w-md max-h-96 border border-solid border-black bg-indigo-50">
                    Spining...
                </div>
            </div>
        );

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] w-full h-screen flex justify-center items-center p-4">
            <div className="flex flex-col items-center gap-4 p-4 w-full max-w-4xl h-3/4 border border-solid border-black bg-indigo-50">
                <div className="flex justify-end w-full">
                    <Button onClick={onClose}>Close</Button>
                </div>
                <input
                    className="border border-solid border-black outline-none px-4 py-2 w-full"
                    name="keyword"
                    placeholder="Your grandma is going to check your search history"
                />
                <div className="flex flex-col gap-2 w-full overflow-auto">
                    {quizzes.map(quiz => {
                        const { title, description, id, createdAt, totalQuestions } = quiz;

                        return (
                            <div
                                key={id}
                                className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between bg-rose-50 gap-4"
                            >
                                <div>
                                    <p>{title}</p>
                                    <p className="text-sm line-clamp-2">{description}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="px-2 py-1 border border-solid border-black text-sm">
                                            {totalQuestions} Terms
                                        </div>
                                        <div className="px-2 py-1 border border-solid border-black text-sm">
                                            {new Date(createdAt).toDateString()}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className={clsx(
                                        'bg-green-100 flex-shrink-0',
                                        selectedQuizIds.includes(id) ? 'bg-slate-300' : ''
                                    )}
                                    onClick={() => !selectedQuizIds.includes(id) && onSelect(quiz)}
                                >
                                    Choose this
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const CollectionSettings = () => {
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const { collectionId, accountId } = useParams();
    const [collection, setCollection] = useState({
        title: '',
        description: '',
        quizzes: []
    });
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const navigate = useNavigate();

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(
            `http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}/details`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                setCollection(data);
            })
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId, collectionId]);

    const handleInputCollection = event => {
        const { name, value } = event.target;
        setCollection({
            ...collection,
            [name]: value
        });
    };

    const handleSaveCollection = () => {
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: collectionId,
                title: collection.title,
                description: collection.description
            })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleDeleteCollection = () => {
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return navigate(`/accounts/${accountId}/collections`);
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleSelectQuiz = quiz => {
        fetch(
            `http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}/add-quiz/${quiz.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then(response => {
                if (response.ok) {
                    setCollection({
                        ...collection,
                        quizzes: [...collection.quizzes, quiz]
                    });
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleDeleteQuiz = quizId => {
        fetch(
            `http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}/delete-quiz/${quizId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then(response => {
                if (response.ok) {
                    setCollection({
                        ...collection,
                        quizzes: collection.quizzes.filter(it => it.id != quizId)
                    });
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    if (fetchStatus == FetchStatuses.Loading)
        return (
            <div className="w-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <>
            <div className="flex-1 border border-solid border-black p-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2>Do whatever you want to this collection</h2>
                    <div className="flex items-center gap-2">
                        <Button className="bg-amber-300" onClick={handleSaveCollection}>
                            Heck yes
                        </Button>
                        <Button
                            className="bg-indigo-300"
                            onClick={event => {
                                event.preventDefault();
                                history.back();
                            }}
                        >
                            Back
                        </Button>
                        <Button className="bg-red-100" onClick={handleDeleteCollection}>
                            Let&apos;s say goodbye
                        </Button>
                    </div>
                </div>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Infomation</legend>
                        <label className="flex flex-col gap-2">
                            Title:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this collection, please"
                                value={collection.title}
                                onChange={handleInputCollection}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Description:
                            <textarea
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Give it some descriptive words"
                                value={collection.description}
                                onChange={handleInputCollection}
                            />
                        </label>
                    </fieldset>
                </form>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Quizzes</legend>
                        <div className="flex flex-col gap-4">
                            {collection.quizzes.map(quizz => {
                                const { title, description, id, totalQuestions, createdAt } = quizz;

                                return (
                                    <div
                                        key={id}
                                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                    >
                                        <div>
                                            <p>{title}</p>
                                            <p className="text-sm">{description}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                                    {totalQuestions} Terms
                                                </div>
                                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                                    {new Date(createdAt).toDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    handleDeleteQuiz(id);
                                                }}
                                            >
                                                Please forgive me
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                            <Button
                                className="bg-orange-300"
                                onClick={() => setIsQuizModalOpen(true)}
                            >
                                Can i have another one, please? please, one more
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
            {isQuizModalOpen && (
                <AddQuizModal
                    onClose={() => setIsQuizModalOpen(false)}
                    onSelect={handleSelectQuiz}
                    selectedQuizIds={collection.quizzes.map(it => it.id)}
                />
            )}
        </>
    );
};

export default CollectionSettings;
