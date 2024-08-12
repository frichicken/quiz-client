import Button from 'components/common/Button';
import Input from 'components/common/Input';
import { toast } from 'components/common/toaster';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { debounce } from 'utils';
import { FetchStatuses } from 'utils/constants';

function Collections() {
    const [collections, setCollections] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

    useEffect(() => {
        const url = new URL(`http://localhost:5184/api/accounts/${accountId}/collections`);
        url.search = searchParams;

        setCollections([]);
        setFetchStatus(FetchStatuses.Loading);
        fetch(url.toString())
            .then(response => {
                if (response.ok) return response.json();
                else return Promise.reject(response);
            })
            .then(data => setCollections(data))
            .catch(() => toast('Something went wrong'))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId, searchParams]);

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

    const handleKeywordChange = debounce(event => {
        setSearchParams({
            keyword: event.target.value
        });

        setKeyword(event.target.value);
    }, 300);

    let content = (
        <div className="w-full flex-1 flex flex-col gap-2 p-2 overflow-y-auto">
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
    );

    if (fetchStatus == FetchStatuses.Loading)
        content = (
            <div className="w-full flex-1 flex justify-center items-center p-2">Spining...</div>
        );

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-end">
                <Input
                    className="min-w-[28rem]"
                    name="keyword"
                    placeholder="Search for collections"
                    onChange={handleKeywordChange}
                    defaultValue={keyword}
                />
            </div>
            {content}
        </div>
    );
}

export default Collections;
