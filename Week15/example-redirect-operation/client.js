const options = {
    method: 'DELETE'
}

console.log(`This is a ${options.method} request to /redirect...`);

fetch('http://localhost:7200/redirect', options)
    .then(resp => {
        console.log("Ok?", resp.ok);
        console.log("Status:", resp.status);
        return resp.json()
    })
    .then(console.log)
    .catch(console.error)