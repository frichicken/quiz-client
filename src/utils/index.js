export const getRandomString = () => Math.random().toString(36).substring(2, 7);

export const getRandomDate = (start = new Date(2001, 0, 1), end = new Date()) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
