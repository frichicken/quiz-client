import clsx from 'clsx';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import Button from './Button';

const YourLibraryLayout = () => {
    const { accountId } = useParams();
    
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
