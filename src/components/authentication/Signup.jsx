import Button from 'components/common/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';
import useAuthentication from './useAuthentication';

const Signup = () => {
    const {
        handleSignUp,
        handleChange,
        handleFocus,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        isPasswordVisible,
        isConfirmPasswordVisible,
        account,
        errors,
        fetchStatus
    } = useAuthentication();

    useEffect(() => {
        document.title = 'Sign up';
    }, []);

    return (
        <form onSubmit={handleSignUp}>
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
                    <p className="text-sm text-red-400">{errors.email}</p>
                </label>
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
                            type="button"
                            className="min-w-36"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
                        </Button>
                    </div>
                    <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                </label>
                <Button className="bg-black text-white" type="submit">
                    {fetchStatus == FetchStatuses.Loading ? '...' : 'Sign up'}
                </Button>
                <p className="flex items-center justify-center gap-1">
                    Already have an account?
                    <Link to="/log-in" className="underline cursor-pointer text-center">
                        Log in
                    </Link>
                </p>
            </fieldset>
        </form>
    );
};

export default Signup;
