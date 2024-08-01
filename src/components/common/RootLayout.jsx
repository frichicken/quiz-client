import { Link, Outlet, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';

function RootLayout() {
    const account = JSON.parse(localStorage.getItem('account'));
    const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
    const [isYourLibraryDropdownOpen, setIsYourLibraryDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleCreateDropdown = () => setIsCreateDropdownOpen(isCreateDropdownOpen ? false : true);
    const toggleYourLibraryDropdown = () =>
        setIsYourLibraryDropdownOpen(isYourLibraryDropdownOpen ? false : true);

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
            .catch(error => console.error(error))
            .finally(() => toggleCreateDropdown());
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
            .catch(error => console.error(error))
            .finally(() => toggleCreateDropdown());
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="flex justify-between gap-6 h-[67px] px-4 flex-shrink-0 self-start top-0 sticky w-full bg-white z-10">
                <div className="flex items-center gap-5">
                    <Link className="hover:underline cursor-pointer">Home</Link>
                    <div className="relative h-full flex items-center z-20">
                        <p
                            className="hover:underline cursor-pointer"
                            onClick={toggleYourLibraryDropdown}
                        >
                            Your library
                        </p>
                        {isYourLibraryDropdownOpen && (
                            <div className="absolute top-[calc(100%)] left-1/2 -translate-x-1/2 bg-white min-w-40 shadow-sm py-2 border border-solid border-neutral-600 flex flex-col">
                                <Button
                                    className="w-full border-none text-left"
                                    onClick={() => {
                                        navigate(`/accounts/${account.id}/quizzes`);
                                        toggleYourLibraryDropdown();
                                    }}
                                >
                                    Quiz
                                </Button>
                                <Button
                                    className="w-full border-none text-left"
                                    onClick={() => {
                                        navigate(`/accounts/${account.id}/collections`);
                                        toggleYourLibraryDropdown();
                                    }}
                                >
                                    Collection
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center flex-1 mx-auto">
                    <input
                        className="border border-solid border-neutral-600 outline-none px-4 py-2 w-full"
                        name="keyword"
                        placeholder="Search anything..."
                    />
                </div>
                <div className="flex items-center gap-5">
                    <div className="relative h-full flex items-center">
                        <p
                            className="hover:underline cursor-pointer"
                            onClick={toggleCreateDropdown}
                        >
                            Create
                        </p>
                        {isCreateDropdownOpen && (
                            <div className="absolute top-[calc(100%)] left-1/2 -translate-x-1/2 bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
                                <Button
                                    className="w-full border-none text-left"
                                    onClick={handleCreateQuiz}
                                >
                                    Quiz
                                </Button>
                                <Button
                                    className="w-full border-none text-left"
                                    onClick={handleCreateCollection}
                                >
                                    Collection
                                </Button>
                            </div>
                        )}
                    </div>
                    <Link
                        to="/settings"
                        className="hover:underline cursor-pointer"
                    >
                        Settings
                    </Link>
                    <Link
                        to="/terms-and-policies"
                        className="hover:underline cursor-pointer"
                    >
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
