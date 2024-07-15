import Button from 'components/common/Button';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

function Login() {
    const [account, setAccount] = useState({
        email: '',
        password: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const navigate = useNavigate();

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

    // Validate and log in
    const handleSubmit = event => {
        event.preventDefault();

        const errors = {};
        const { email, password } = account;
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

        const isValid = Object.values(errors).length == 0;

        if (isValid) {
            // Call log in endpoint
            setFetchStatus(FetchStatuses.Loading);
            fetch('http://localhost:5184/log-in', {
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
                    localStorage.setItem('account', JSON.stringify(data));
                    navigate(`/accounts/${data.id}/quizzes`);
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
                <Button className="bg-indigo-300">Abracadabra</Button>
                <form onSubmit={handleSubmit}>
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Log in</legend>
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="email"
                                placeholder="Type type your email"
                                onChange={handleChange}
                                onFocus={handleFocus}
                            />
                            <p className="text-sm">{errors.email}</p>
                        </label>
                        <label className="flex flex-col gap-2">
                            Password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                placeholder="Let me know, i will give an ice cream"
                                type={isPasswordVisible ? 'text' : 'password'}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                name="password"
                            />
                            <p className="text-sm">{errors.password}</p>
                            <Button className="bg-red-200" onClick={togglePasswordVisibility}>
                                Abracadabra
                            </Button>
                        </label>
                        <div className="flex justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" />
                                Remember who you are
                            </label>
                            <a className="text-blue-300 underline cursor-pointer">You forgot?</a>
                        </div>
                        <Button className="bg-orange-200 w-full" type="submit">
                            {fetchStatus == FetchStatuses.Loading ? 'Loading...' : 'Buzz'}
                        </Button>
                        <Link
                            to="/sign-up"
                            className="text-blue-300 underline cursor-pointer w-full text-center"
                        >
                            Give me a sign
                        </Link>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Login;