import { Link, Outlet, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';

function Layout() {
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
                navigate(`/accounts/${account.id}/collections/${data.id}/edit`);
            })
            .catch(error => console.error(error))
            .finally(() => toggleCreateDropdown());
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="flex justify-between border-b border-b-black gap-6 h-[67px] px-4">
                <div className="flex items-center gap-3">
                    <Link className="underline cursor-pointer">
                        <Button>Home</Button>
                    </Link>
                    <div className="relative h-full flex items-center">
                        <Button onClick={toggleYourLibraryDropdown}>Your library</Button>
                        {isYourLibraryDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-[-8px] bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
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
                        className="border border-solid border-black outline-none px-4 py-2 w-full"
                        name="keyword"
                        placeholder="Your grandma is going to check your search history"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative h-full flex items-center">
                        <Button onClick={toggleCreateDropdown}>Create</Button>
                        {isCreateDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-[-8px] bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
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
            </nav>
            <Outlet />
        </div>
    );
}

export default Layout;
