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

export function setCookie(name, value, expires) {
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name + '=') == 0) {
            return cookie.substring((name + '=').length, cookie.length);
        }
    }

    return '';
}
