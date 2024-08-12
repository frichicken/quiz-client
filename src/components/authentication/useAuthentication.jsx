import { toast } from 'components/common/toaster';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FetchStatuses, url } from 'utils/constants';

function useAuthentication() {
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

    // Validate and sign up
    const handleSignUp = event => {
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
            fetch(`${url}/sign-up`, {
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
                    }

                    return Promise.reject(response);
                })
                .then(() => navigate('/log-in'))
                .catch(() => toast('Something went wrong'))
                .finally(() => setFetchStatus(FetchStatuses.None));
        } else {
            setErrors(errors);
        }
    };

    // Validate and log in
    const handleLogIn = event => {
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
            fetch(`${url}/log-in`, {
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
                    }

                    return Promise.reject(response);
                })
                .then(data => {
                    localStorage.setItem('account', JSON.stringify(data));
                    navigate(`/accounts/${data.id}/quizzes`);
                })
                .catch(() => toast('Something went wrong'))
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

    return {
        account,
        errors,
        fetchStatus,
        isConfirmPasswordVisible,
        isPasswordVisible,
        handleFocus,
        handleChange,
        toggleConfirmPasswordVisibility,
        togglePasswordVisibility,
        handleSignUp,
        handleLogIn
    };
}

export default useAuthentication;
