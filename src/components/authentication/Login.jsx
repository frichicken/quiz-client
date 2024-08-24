import Button from 'components/common/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';
import useAuthentication from './useAuthentication';
import Input from 'components/common/Input';

function Login() {
    const {
        handleLogIn,
        handleChange,
        handleFocus,
        togglePasswordVisibility,
        isPasswordVisible,
        errors,
        fetchStatus,
        account
    } = useAuthentication();

    useEffect(() => {
        document.title = 'Log in';
    }, []);

    return (
        <form onSubmit={handleLogIn}>
            <div className="flex flex-col gap-5 p-4">
                <p className="text-2xl font-medium">Log in</p>
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        Email:
                        <Input
                            name="email"
                            placeholder="Type your email"
                            onChange={handleChange}
                            onFocus={handleFocus}
                            value={account.email}
                        />
                        <p className="text-sm text-red-400">{errors.email}</p>
                    </label>
                    <label className="flex flex-col gap-2">
                        Password:
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Let me know, i will give an ice cream"
                                type={isPasswordVisible ? 'text' : 'password'}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                name="password"
                                value={account.password}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                className="min-w-36"
                                onClick={togglePasswordVisibility}
                            >
                                {isPasswordVisible ? 'Hide password' : 'Show password'}
                            </Button>
                        </div>
                        <p className="text-sm text-red-400">{errors.password}</p>
                    </label>
                    {/* <div className="flex justify-between">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a className="underline cursor-pointer">You forgot?</a>
                    </div> */}
                    <Button className="w-full bg-black text-white" type="submit">
                        {fetchStatus == FetchStatuses.Loading ? '...' : 'Log in'}
                    </Button>
                    <p className="flex items-center justify-center gap-1">
                        Create an account?
                        <Link to="/sign-up" className="underline cursor-pointer text-center">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </form>
    );
}

export default Login;
