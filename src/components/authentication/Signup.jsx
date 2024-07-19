import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

const Signup = () => {
    const [account, setAccount] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sign up"
    }, [])

    const handleChange = event => {
        const { value, name } = event.target;

        setAccount({
            ...account,
            [name]: value
        });
    };

    const togglePasswordVisibility = event => {
        event.stopPropagation();
        event.preventDefault();
        setIsPasswordVisible(isPasswordVisible ? false : true);
    };

    const toggleConfirmPasswordVisibility = event => {
        event.stopPropagation();
        event.preventDefault();
        setIsConfirmPasswordVisible(isConfirmPasswordVisible ? false : true);
    };

    // Validate and register
    const handleSubmit = event => {
        event.preventDefault();

        const errors = {};
        const { email, password, confirmPassword } = account;
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email.length > 0) {
            if (emailRegex.test(email) == false) {
                errors.email = 'Please enter valid email';
            }
        } else {
            errors.email = 'Please enter your email';
        }

        if (password.length == 0) {
            errors.password = 'Please enter your password';
        }

        if (confirmPassword.length > 0) {
            if (confirmPassword != password) {
                errors.confirmPassword = 'Confirm password does not match';
            }
        } else {
            errors.confirmPassword = 'Please enter confirm password';
        }

        const isValid = Object.values(errors).length == 0;

        if (isValid) {
            // Call register endpoint
            setFetchStatus(FetchStatuses.Loading);
            fetch('http://localhost:5184/sign-up', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        Promise.reject(response);
                    }
                })
                .then(data => {
                    console.log({ data });
                    navigate('/log-in');
                })
                .catch(response => console.log(response))
                .finally(() => setFetchStatus(FetchStatuses.None));
        } else {
            setErrors(errors);
        }
    };

    // Clear error message when focusing
    const handleFocus = event => {
        const { name } = event.target;

        setErrors({
            ...errors,
            [name]: ''
        });
    };

    return (
        <div className="w-full h-screen p-4 flex justify-center items-center">
            <div className="w-full max-w-lg p-4 flex flex-col gap-2 border border-solid border-black">
                {/* Switch mode but its not implemented */}
                <Button>An evening person?</Button>
                <form onSubmit={handleSubmit}>
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Sign up</legend>
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="email"
                                placeholder="We need your email, please"
                                onChange={handleChange}
                                value={account.email}
                                onFocus={handleFocus}
                            />
                            <p className="text-sm">{errors.email}</p>
                        </label>
                        <div className="flex flex-col gap-2">
                            <label className="flex flex-col gap-2">
                                Password:
                                <div className="flex items-center gap-2">
                                    <input
                                        className="flex-1 border border-solid border-black outline-none px-4 py-2"
                                        name="password"
                                        placeholder="It's our secret"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        onChange={handleChange}
                                        value={account.password}
                                        onFocus={handleFocus}
                                    />
                                    <Button className="min-w-36" onClick={togglePasswordVisibility}>
                                        {isPasswordVisible ? 'Hide password' : 'Show password'}
                                    </Button>
                                </div>
                                <p className="text-sm">{errors.password}</p>
                            </label>
                        </div>
                        <label className="flex flex-col gap-2">
                            Confirm password:
                            <div className="flex items-center gap-2">
                                <input
                                    className="flex-1 border border-solid border-black outline-none px-4 py-2"
                                    name="confirmPassword"
                                    placeholder="Are you sure they are matched"
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    onChange={handleChange}
                                    value={account.confirmPassword}
                                    onFocus={handleFocus}
                                />
                                <Button
                                    className="min-w-36"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
                                </Button>
                            </div>
                            <p className="text-sm">{errors.confirmPassword}</p>
                        </label>
                        <Button type="submit">
                            {fetchStatus == FetchStatuses.Loading ? 'Spining...' : "Sign up"}
                        </Button>
                        <Link
                            to="/log-in"
                            className="underline cursor-pointer w-full text-center"
                        >
                            Can&apos;t believe that you already have it?
                        </Link>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Signup;
