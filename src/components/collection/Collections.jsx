import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

function Collections() {
    const [collections, setCollections] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const { accountId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections`)
            .then(response => response.json())
            .then(data => setCollections(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleDeleteCollection = collectionId => {
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections/${collectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    setCollections(collections.filter(it => it.id != collectionId))
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    if (fetchStatus == FetchStatuses.Loading)
        return (
            <div className="w-full h-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <div className="w-full h-full flex flex-col gap-2 border border-solid border-black p-2 overflow-y-auto">
            {collections.map(collection => {
                const { title, description, id, createdAt, totalQuizzes } = collection;

                return (
                    <div
                        key={id}
                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                        onClick={() => {
                            navigate(`/accounts/${accountId}/collections/${id}`);
                        }}
                    >
                        <div>
                            <p>{title}</p>
                            <p className="text-sm">{description}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                    {totalQuizzes} Items
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
                                    navigate(`/accounts/${accountId}/collections/${id}/edit`);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={event => {
                                    event.stopPropagation();
                                    handleDeleteCollection(id);
                                }}
                            >
                                Please forgive me
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Collections;
