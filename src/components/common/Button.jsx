import clsx from 'clsx';

const Button = ({ children, className, onClick, type, ...others }) => {
    return (
        <button
            className={clsx('px-4 py-2 border border-solid border-black', className)}
            {...others}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
