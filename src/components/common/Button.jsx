import clsx from 'clsx';

const Button = ({ children, className, onClick, type, disabled, ...others }) => {
    return (
        <button
            className={clsx(
                'hover:!bg-black hover:!text-white transition-colors px-4 py-2 border border-solid border-black flex-shrink-0',
                className
            )}
            {...others}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
