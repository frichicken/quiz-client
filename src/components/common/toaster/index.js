import { getRandomString } from 'utils';

let toasts = [];
let subscriber = () => {};

export const set = callback => (subscriber = callback);
export const remove = () => (subscriber = null);

const emmit = () => {
    subscriber(toasts);
};

export const toast = message => {
    const id = getRandomString();

    toasts = [
        ...toasts,
        {
            id,
            message
        }
    ];

    setTimeout(() => {
        toasts = toasts.filter(toast => toast.id != id);
        emmit();
    }, 1000);

    emmit();
};
