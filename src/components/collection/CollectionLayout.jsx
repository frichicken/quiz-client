import Button from 'components/common/Button';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const CollectionLayout = () => {
    const navigate = useNavigate();
    const { accountId } = useParams();

    const handleCreateCollection = () => {
        fetch(`http://localhost:5184/api/accounts/${accountId}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                title: '',
                description: '',
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                navigate(`/accounts/${accountId}/collections/${data.id}/edit`);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2">
                    COLLECTIONS
                </h1>
                <div className="flex items-center gap-4">
                    <Button onClick={handleCreateCollection}>Just hit a button Morty, give me a beat</Button>
                    <input
                        className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                        name="keyword"
                        placeholder="Your grandma is going to check your search history"
                    />
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default CollectionLayout;
