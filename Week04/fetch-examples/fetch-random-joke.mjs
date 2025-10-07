const URL_RANDOM_JOKE = "https://official-joke-api.appspot.com/random_joke";

console.log("BEGIN");

fetch(URL_RANDOM_JOKE) // Promise<Response>
    .then(resp => resp.json())  // Promise<Object>
    .then(obj => {console.log(obj.setup); return obj.punchline;}) // Promise<String>
    .then(text => setTimeout(() => {console.log(text);}, 3000)) // Promise<undefined>
    .catch(err => {console.log("Error")});

console.log("END");