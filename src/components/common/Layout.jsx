import { Link, Outlet } from 'react-router-dom';
import Button from './Button';

function Layout() {
    const account = JSON.parse(localStorage.getItem('account'));

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="p-4 flex justify-between items-center border-b border-b-black">
                <div className="flex items-center gap-4">
                    {/* <div className="w-[32px] h-[32px] border border-solid border-black rounded-full overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" />
                    </div> */}
                    <Link to="/settings" className="underline cursor-pointer">
                        <Button>Settings</Button>
                    </Link>
                    <Link
                        to="/log-in"
                        onClick={() => localStorage.setItem('account', JSON.stringify(null))}
                        className="underline cursor-pointer"
                    >
                       <Button>Log out</Button>
                    </Link>
                    <Link to="/terms-and-policies" className="underline cursor-pointer">
                       <Button>Terms and policies</Button>
                    </Link>
                </div>
                <ul className="flex items-center gap-4 list-none">
                    <li>
                        <Link
                            className="underline cursor-pointer"
                            to={`/accounts/${account.id}/quizzes`}
                        >
                            <Button>Quizzes</Button>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="underline cursor-pointer"
                            to={`/accounts/${account.id}/collections`}
                        >
                            <Button>Collections</Button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default Layout;
