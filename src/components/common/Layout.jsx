import { Link, Outlet } from 'react-router-dom';
import Button from './Button';

function Layout() {
    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="p-4 flex justify-between items-center border-b border-b-black">
                <div className="flex items-center gap-4">
                    <div className="w-[32px] h-[32px] border border-solid border-black rounded-full overflow-hidden">
                        <img className="w-full h-full object-cover" />
                    </div>
                    <Link to="/settings">
                        <Button className="bg-red-300">Settings</Button>
                    </Link>
                    <Link
                        to="/log-in"
                        onClick={() => localStorage.setItem('account', JSON.stringify(null))}
                    >
                        <Button className="bg-slate-300">Log out</Button>
                    </Link>
                    <Button to="/terms-and-policies" className="bg-orange-200">
                        Terms and policies
                    </Button>
                </div>
                <ul className="flex items-center gap-4 list-none">
                    <li>
                        <Link to="/quizzes">
                            <Button className="bg-zinc-300">Home</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/collections">
                            <Button className="bg-lime-200">Collections</Button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default Layout;
