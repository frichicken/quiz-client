import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'utils';
import { FetchStatuses } from 'utils/constants';

const CollectionDetails = () => {
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
                    navigate(`/accounts/${accountId}/collections`);
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleRemoveQuiz = (event, quizId) => {
        event.stopPropagation();

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
                    collection.quizzes = collection.quizzes.filter(it => it.id != quizId);

                    setCollection({ ...collection });
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleInputCollectionDebounce = debounce(event => {
        const { value, name } = event.target;

        const newCollection = {
            ...collection,
            [name]: value
        };

        setCollection(newCollection);
        handleUpdateCollection(newCollection);
    }, 800);

    const handleUpdateCollection = collection => {
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: collection.id,
                title: collection.title,
                description: collection.description
            })
        })
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
    };

    if (fetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex-1 flex justify-center items-center p-2">Spining...</div>;

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <input
                        className="border border-solid border-black outline-none px-4 py-2"
                        defaultValue={collection.title}
                        name="title"
                        onChange={handleInputCollectionDebounce}
                    />
                    <textarea
                        className="border border-solid border-black outline-none px-4 py-2 text-sm"
                        defaultValue={collection.description}
                        rows={1}
                        name="description"
                        onChange={handleInputCollectionDebounce}
                    />
                </div>
                <Button onClick={handleDeleteCollection}>Remove</Button>
            </div>
            {collection.quizzes.map(quiz => {
                const { title, description, id, totalQuestions, createdAt } = quiz;

                return (
                    <div
                        key={id}
                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                        onClick={() => {
                            navigate(`/accounts/${accountId}/quizzes/${id}`);
                        }}
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
                        <div>
                            <Button onClick={event => handleRemoveQuiz(event, id)}>Remove</Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CollectionDetails;
