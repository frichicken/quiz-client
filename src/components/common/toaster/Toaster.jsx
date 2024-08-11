import React, { useEffect, useState } from 'react';
import { set, remove } from './toaster';

function Toaster() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        set(toasts => setToasts(toasts));

        return () => remove();
    }, []);

    return (
        <div className="absolute flex flex-col gap-4 bottom-4 right-4">
            {toasts.map((toast, index) => {
                return (
                    <div key={index} className="px-4 py-2 border border-solid border-black">
                        {toast.message}
                    </div>
                );
            })}
        </div>
    );
}

export default Toaster;
