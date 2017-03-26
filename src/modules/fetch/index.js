
const API_ENDPOINT = 'https://us-central1-readr-60929.cloudfunctions.net/fetchContents';

const fetchArticle = url => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        if (response.status !== 'OK') {
            return reject(response.message);
        }
        return resolve({
            id: response.id,
            title: response.title,
            intro: response.intro,
            content: response.content,
            color: response.color,
        });
    };
    xhr.onerror = reject;
    xhr.send(`url=${encodeURIComponent(url)}`);
});

export default fetchArticle;
