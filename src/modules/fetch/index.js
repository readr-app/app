
const API_ENDPOINT = __PROD__ ?
    'https://icica0077a.execute-api.eu-west-1.amazonaws.com/prod/fetch-contents' :
    'https://etwykxnypa.execute-api.eu-west-1.amazonaws.com/dev/fetch-contents';

const fetchArticle = url => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT, true);
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
    xhr.send(JSON.stringify({ url }));
});

export default fetchArticle;
