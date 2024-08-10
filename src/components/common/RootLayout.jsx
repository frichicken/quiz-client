import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './Dropdown';
import Input from './Input';

function RootLayout() {
    const account = JSON.parse(localStorage.getItem('account'));
    const navigate = useNavigate();

    const handleCreateQuiz = () => {
        fetch(`http://localhost:5184/api/accounts/${account.id}/quizzes`, {
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
                navigate(`/accounts/${account.id}/quizzes/${data.id}/edit`);
            })
            .catch(error => console.error(error));
    };

    const handleCreateCollection = () => {
        fetch(`http://localhost:5184/api/accounts/${account.id}/collections`, {
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
                navigate(`/accounts/${account.id}/collections/${data.id}`);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="flex justify-between gap-6 h-[67px] px-4 flex-shrink-0 self-start top-0 sticky w-full bg-white z-10">
                <div className="flex items-center gap-5">
                    <Link className="hover:underline cursor-pointer">Home</Link>
                    <Dropdown>
                        <DropdownTrigger className="border-none hover:underline">
                            Your library
                        </DropdownTrigger>
                        <DropdownContent className="top-full">
                            <DropdownItem
                                onSelect={() => {
                                    navigate(`/accounts/${account.id}/quizzes`);
                                }}
                            >
                                Quiz
                            </DropdownItem>
                            <DropdownItem
                                onSelect={() => {
                                    navigate(`/accounts/${account.id}/collections`);
                                }}
                            >
                                Collection
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                </div>
                <div className="flex items-center flex-1 mx-auto">
                    <Input
                        className="border-neutral-600 w-full"
                        name="keyword"
                        placeholder="Search anything..."
                    />
                </div>
                <div className="flex items-center gap-5">
                    <Dropdown position="bottom-center">
                        <DropdownTrigger className="border-none hover:underline">
                            Create
                        </DropdownTrigger>
                        <DropdownContent className="top-full">
                            <DropdownItem onSelect={handleCreateQuiz}>Quiz</DropdownItem>
                            <DropdownItem onSelect={handleCreateCollection}>
                                Collection
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                    <Link to="/settings" className="hover:underline cursor-pointer">
                        Settings
                    </Link>
                    <Link to="/terms-and-policies" className="hover:underline cursor-pointer">
                        Terms and policies
                    </Link>
                    <Link
                        to="/log-in"
                        onClick={() => localStorage.setItem('account', JSON.stringify(null))}
                        className="hover:underline cursor-pointer"
                    >
                        Log out
                    </Link>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default RootLayout;
