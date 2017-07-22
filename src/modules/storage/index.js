import { createInstance } from 'localforage';

const NAME = 'readr-store';

const VERSION = 1.0;

const instance = createInstance({
    name: NAME,
    version: VERSION,
});

export const set = (key, payload) => instance.setItem(key, payload);

// Add ID for the sake of backwards compatibility
export const get = key =>
    instance.getItem(key).then(item => ({
        ...item,
        ...{ id: key },
    }));

export const getKeys = () => instance.keys();

export const getAll = () =>
    instance.keys().then(keys =>
        Promise.all(
            keys.map(key =>
                instance.getItem(key).then(article =>
                    Object.assign({}, article, {
                        id: key,
                    })
                )
            )
        )
    );

export const remove = key => instance.removeItem(key);
