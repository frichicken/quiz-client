export const getRandomString = () => Math.random().toString(36).substring(2, 7);

export const getRandomDate = (start = new Date(2001, 0, 1), end = new Date()) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const debounce = (callback, timeout = 300) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, timeout);
    };
};