function request(url, success) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('load', e => success(e.target.responseText));
    xhr.send();
};

// function request(method, url, data, resolve) {
//     let xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.addEventListener('load', e => {
//         console.log(e.target.responseText);
//       resolve(e.target.responseText);
//     });
//      xhr.addEventListener('error', err => {
//       console.log(err);
//        reject(err);
//     });
//     xhr.send(data);
// }

let colorCombos = [
    {
        bg: '#130321',
        font: '#ebf8df'
    },
    {
        bg: '#b0a9ac',
        font: '#505251'
    }
];

let ERRORS = {};
request('/error-codes', data => {
    ERRORS = JSON.parse(data);
});