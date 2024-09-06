import clsx from 'clsx';

function Input({
    defaultValue,
    onChange,
    value,
    onFocus,
    type,
    placeholder,
    name,
    className,
    ...others
}) {
    return (
        <input
            className={clsx('border border-black outline-none px-4 py-2', className)}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            defaultValue={defaultValue}
            value={value}
            type={type}
            {...others}
        />
    );
}

export default Input;
