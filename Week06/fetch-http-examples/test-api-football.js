// To use environmental variables through process.env, 
// run the program in terminal specifying an env-file:
//
// node --env-file=.env test-api-football.js
//
// '.env' is a text file containing the key token, such as:
//
// KEY=XXXXXXXXXXXXXXXXXXXXXXX
//
// KEY is the env variable name.
// The dot prefix of '.env' indicates that the file is
// hidden and should be included in .gitignore file.

let requestOptions = {
  //method: 'GET',
  headers : {"X-Auth-Token": process.env.KEY},
};

// Number => Promise<obj>
function getObjAPI(){
  //return fetch(`http://api.football-data.org/v4/teams?limit=50&offset=50`, requestOptions)
  return fetch(`http://api.football-data.org/v4/teams`, requestOptions)
  .then(response => response.json())
  .catch(error => console.log('error', error));
}

// Get the 50th first teams from the API Football
getObjAPI().then(console.log);