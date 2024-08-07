import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

function Collections() {
    const [collections, setCollections] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

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
                    setCollections(collections.filter(it => it.id != collectionId));
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleKeywordChange = event => {
        setKeyword(event.target.value);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-end">
                <input
                    className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                    name="keyword"
                    placeholder="Search for collections"
                    onChange={handleKeywordChange}
                />
            </div>
            {fetchStatus == FetchStatuses.Loading ? (
                <div className="w-full flex-1 flex justify-center items-center p-2">...</div>
            ) : (
                <div className="w-full flex-1 flex flex-col gap-2 p-2 overflow-y-auto">
                    {collections
                        .filter(it =>
                            it.title.trim().toLowerCase().includes(keyword.trim().toLowerCase())
                        )
                        .map(collection => {
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
                                                handleDeleteCollection(id);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default Collections;
