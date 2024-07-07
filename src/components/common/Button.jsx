import clsx from 'clsx';

const Button = ({ children, className, ...others }) => {
    return (
        <button
            className={clsx('px-4 py-2 border border-solid border-black', className)}
            {...others}
        >
            {children}
        </button>
    );
};

export default Button;
