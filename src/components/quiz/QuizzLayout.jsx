import { Link, Outlet } from 'react-router-dom';
import Button from '../common/Button';

const QuizzLayout = () => {
    return (
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2">
                    QUIZZES LADIES and GENTLEMEN
                </h1>
                <div className="flex items-center gap-4">
                    <Link to="/quizzes/create">
                        <Button>Just hit a button Morty, give me a beat</Button>
                    </Link>
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

export default QuizzLayout;
