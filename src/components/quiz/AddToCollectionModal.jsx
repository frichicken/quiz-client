import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FetchStatuses, url } from 'utils/constants';

const AddToCollectionModal = ({ onClose = () => {} }) => {
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [collections, setCollections] = useState([]);
    const { accountId, quizId } = useParams();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`${url}/api/accounts/${accountId}/collections`)
            .then(response => response.json())
            .then(data => setCollections(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleSelect = collectionId => {
        fetch(
            `http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}/add-quiz/${quizId}`,
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
                    const collection = collections.find(it => it.id == collectionId);
                    collection.quizIds.push(Number(quizId));

                    setCollections(
                        collections.map(it => (it.id == collectionId ? { ...collection } : it))
                    );
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleRemove = collectionId => {
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
                    const collection = collections.find(it => it.id == collectionId);
                    collection.quizIds = collection.quizIds.filter(it => it != quizId);

                    setCollections(
                        collections.map(it => (it.id == collectionId ? { ...collection } : it))
                    );
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

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
            <div className="flex flex-col items-center gap-4 p-4 w-full max-w-4xl h-3/4 border border-solid border-black bg-white">
                <div className="flex justify-end w-full">
                    <Button onClick={onClose}>Close</Button>
                </div>
                <input
                    className="border border-solid border-black outline-none px-4 py-2 w-full"
                    name="keyword"
                    placeholder="Your grandma is going to check your search history"
                    onChange={event => setKeyword(event.target.value)}
                />
                <div className="flex flex-col gap-2 w-full overflow-auto">
                    {collections
                        .filter(
                            it =>
                                it.title.toLowerCase().includes(keyword.toLowerCase()) ||
                                it.description.toLowerCase().includes(keyword.toLowerCase())
                        )
                        .map(quiz => {
                            const { title, description, id, createdAt, quizIds } = quiz;
                            const isChosen = quizIds.includes(Number(quizId));

                            return (
                                <div
                                    key={id}
                                    className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <p>{title}</p>
                                        <p className="text-sm">{description}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="px-2 py-1 border border-solid border-black text-sm">
                                                {new Date(createdAt).toDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            isChosen ? handleRemove(id) : handleSelect(id)
                                        }
                                    >
                                        {isChosen ? 'Remove' : 'Select'}
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default AddToCollectionModal;
