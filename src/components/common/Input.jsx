import clsx from "clsx";

function Input({ onChange, value, onFocus, type, placeholder, name, className }) {
    return (
        <input
            className={clsx("border bsorder-solid border-black outline-none px-4 py-2", className)}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            value={value}
            type={type}
        />
    );
}

export default Input;
