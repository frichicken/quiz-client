import Button from 'components/common/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';
import useAuthentication from './useAuthentication';

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
            <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                <legend>Log in</legend>
                <label className="flex flex-col gap-2">
                    Email:
                    <input
                        className="border border-solid border-black outline-none px-4 py-2"
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
                        <input
                            className="flex-1 border border-solid border-black outline-none px-4 py-2"
                            placeholder="Let me know, i will give an ice cream"
                            type={isPasswordVisible ? 'text' : 'password'}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            name="password"
                            value={account.password}
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
            </fieldset>
        </form>
    );
}

export default Login;
