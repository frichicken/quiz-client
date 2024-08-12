import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Button from './Button';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const _context = createContext();

const positions = {
    'top-left': 'top-[-8px] -translate-y-full left-[0]',
    'top-right': 'top-[-8px] -translate-y-full right-[0]',
    'top-center': 'top-[-8px] -translate-y-full left-1/2 -translate-x-1/2',
    'bottom-left': 'top-[calc(100%+8px)] left-[0]',
    'bottom-right': 'top-[calc(100%+8px)] right-[0]',
    'bottom-center': 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2'
};

export function DropdownItem({ children, onSelect, to = null }) {
    const context = useContext(_context);
    const { setIsOpen } = context;

    if (to)
        return (
            <Link to={to}>
                <Button className="w-full border-none text-left">{children}</Button>
            </Link>
        );

    return (
        <Button
            className="w-full border-none text-left"
            onClick={() => {
                onSelect();
                setIsOpen(false);
            }}
        >
            {children}
        </Button>
    );
}

export function DropdownContent({ children, className }) {
    const context = useContext(_context);
    const { isOpen, position } = context;

    return (
        isOpen && (
            <div
                className={clsx(
                    'absolute bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col',
                    positions[position],
                    className
                )}
            >
                {children}
            </div>
        )
    );
}

export function DropdownTrigger({ children, className }) {
    const context = useContext(_context);
    const { isOpen, setIsOpen } = context;

    return (
        <div className={clsx("cursor-pointer", className)} onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}>{children}</div>
    );
}

export function Dropdown({ children, position = 'bottom-left' }) {
    const element = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = event => {
            if (element && element.current && element.current.contains(event.target)) return;
            setIsOpen(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <_context.Provider value={{ isOpen, setIsOpen, position }}>
            <div ref={element} className="relative h-full flex items-center">
                {children}
            </div>
        </_context.Provider>
    );
}
