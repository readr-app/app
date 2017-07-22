import omit from 'ramda/src/omit';

const API_ENDPOINT = __DEV__
    ? '/api/fetchContents'
    : 'https://us-central1-readr-60929.cloudfunctions.net/fetchContents';

const fetchArticle = url =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_ENDPOINT, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.status !== 'OK') {
                    return reject(response.message);
                }
                return resolve({
                    ...omit(['status'], response),
                    created_at: Date.now(),
                    url,
                });
            } catch (err) {
                return reject(err.message);
            }
        };
        xhr.onerror = reject;
        xhr.send(`url=${encodeURIComponent(url)}`);
    });

export default fetchArticle;
