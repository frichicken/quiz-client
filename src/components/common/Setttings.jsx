import { useState } from 'react';
import Button from './Button';
import clsx from 'clsx';

const Tabs = {
    Information: 1,
    AccountAndPrivacy: 2
};

const Setttings = () => {
    const [currentTab, setCurrentTab] = useState(Tabs.Information);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('account')));
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputUser = event => {
        const { value, name } = event.target;

        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSaveUser = () => {
        fetch(`http://localhost:5184/api/accounts/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    localStorage.setItem('account', JSON.stringify(user));
                    return response;
                }

                return Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleInputPassword = event => {
        const { name, value } = event.target;

        setPassword({
            ...password,
            [name]: value
        });
    };

    const handleChangePassword = () => {
        const errors = {};

        if (password.currentPassword.length == 0) {
            errors.currentPassword = 'Please enter your password';
        } else {
            if (password.currentPassword != user.password)
                errors.currentPassword = 'Please enter valid password';
        }

        if (password.newPassword.length == 0) {
            errors.newPassword = 'Please enter your new password';
        }

        if (password.confirmPassword.length > 0) {
            if (password.confirmPassword != password.newPassword) {
                errors.confirmPassword = 'Confirm password does not match';
            }
        } else {
            errors.confirmPassword = 'Please enter confirm password';
        }

        const isValid = Object.values(errors).length == 0;

        if (isValid) {
            fetch(`http://localhost:5184/api/accounts/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ ...user, password: password.newPassword })
            })
                .then(response => {
                    if (response.ok) {
                        localStorage.setItem(
                            'account',
                            JSON.stringify({ ...user, password: password.newPassword })
                        );
                        return response;
                    }

                    return Promise.reject(response);
                })
                .catch(error => console.error(error));
        } else {
            setErrors(errors);
        }
    };

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2 w-fit">
                SETTINGS
            </h1>
            <div className="flex items-center gap-2">
                <Button
                    className={clsx(currentTab == Tabs.Information ? 'bg-black text-white' : '')}
                    onClick={() => setCurrentTab(Tabs.Information)}
                >
                    Infomation
                </Button>
                <Button
                    className={clsx(
                        currentTab == Tabs.AccountAndPrivacy ? 'bg-black text-white' : ''
                    )}
                    onClick={() => setCurrentTab(Tabs.AccountAndPrivacy)}
                >
                    Account and privacy
                </Button>
            </div>
            <div className="flex-1 border border-solid border-black p-4">
                {currentTab == Tabs.Information && (
                    <form
                        onSubmit={event => event.preventDefault()}
                        className="flex flex-col gap-4 h-full"
                    >
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="email"
                                placeholder="Titled this email, please"
                                value={user.email}
                                onChange={handleInputUser}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Username:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="username"
                                placeholder="Your username, please"
                                value={user.username}
                                onChange={handleInputUser}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            First name:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="firstName"
                                placeholder="Titled this first name, please"
                                value={user.firstName}
                                onChange={handleInputUser}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Last name:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="lastName"
                                placeholder="Titled this last name, please"
                                value={user.lastName}
                                onChange={handleInputUser}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Description:
                            <textarea
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Give it some descriptive words"
                                value={user.description}
                                onChange={handleInputUser}
                            />
                        </label>
                        <Button onClick={handleSaveUser} className="mt-auto w-fit">
                            Save
                        </Button>
                    </form>
                )}
                {currentTab == Tabs.AccountAndPrivacy && (
                    <form
                        onSubmit={event => event.preventDefault()}
                        className="flex flex-col gap-4 h-full"
                    >
                        <label className="flex flex-col gap-2">
                            Current password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="currentPassword"
                                placeholder="Titled this email, please"
                                onChange={handleInputPassword}
                                value={password.currentPassword}
                                type="password"
                            />
                            <p className="text-sm">{errors.currentPassword}</p>
                        </label>
                        <label className="flex flex-col gap-2">
                            New password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="newPassword"
                                placeholder="Your new password, please"
                                value={password.newPassword}
                                onChange={handleInputPassword}
                                type="password"
                            />
                            <p className="text-sm">{errors.newPassword}</p>
                        </label>
                        <label className="flex flex-col gap-2">
                            Confirm password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="confirmPassword"
                                placeholder="Fill this confirm password, please"
                                value={password.confirmPassword}
                                onChange={handleInputPassword}
                                type="password"
                            />
                            <p className="text-sm">{errors.confirmPassword}</p>
                        </label>
                        <div className="flex gap-4 mt-auto">
                            <Button onClick={handleChangePassword}>Change password</Button>
                            <Button>Delete account</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Setttings;
