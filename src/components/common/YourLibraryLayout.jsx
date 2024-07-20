import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';
import Button from './Button';
import clsx from 'clsx';

const YourLibraryLayout = () => {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);

    const handleCreateQuiz = () => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                title: '',
                description: ''
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                navigate(`/accounts/${accountId}/quizzes/${data.id}/edit`);
            })
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    };

    return (
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2 flex-shrink-0">
                    Your Library
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <NavLink className="underline cursor-pointer" to={`/accounts/${accountId}/quizzes`}>
                    {({ isActive }) => (
                        <Button className={clsx(isActive ? 'bg-black text-white' : '')}>
                            Quizzes
                        </Button>
                    )}
                </NavLink>
                <NavLink
                    className="underline cursor-pointer"
                    to={`/accounts/${accountId}/collections`}
                >
                    {({ isActive }) => (
                        <Button className={clsx(isActive ? 'bg-black text-white' : '')}>
                            Collections
                        </Button>
                    )}
                </NavLink>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default YourLibraryLayout;
