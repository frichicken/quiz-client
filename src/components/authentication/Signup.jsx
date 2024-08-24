import Button from 'components/common/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';
import useAuthentication from './useAuthentication';
import Input from 'components/common/Input';

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
            <div className="flex flex-col gap-5 p-4">
                <p className="text-2xl font-medium">Sign up</p>
                <div className='flex flex-col gap-4'>
                    <label className="flex flex-col gap-2">
                        Email:
                        <Input
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
                            <Input
                                name="password"
                                placeholder="It's our secret"
                                type={isPasswordVisible ? 'text' : 'password'}
                                onChange={handleChange}
                                value={account.password}
                                onFocus={handleFocus}
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
                    <label className="flex flex-col gap-2">
                        Confirm password:
                        <div className="flex items-center gap-2">
                            <Input
                                name="confirmPassword"
                                placeholder="Are you sure they are matched"
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                onChange={handleChange}
                                value={account.confirmPassword}
                                onFocus={handleFocus}
                                className="flex-1"
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
                </div>
            </div>
        </form>
    );
};

export default Signup;
