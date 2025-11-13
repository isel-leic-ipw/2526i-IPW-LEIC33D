import express from 'express';
import fs from 'node:fs/promises';

const PORT = 7200;
const app = express();

app.get('/:filename', readFile); // readFile returns a Promise

app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`),
  );

// Functions:

function readFile (req, res, next) {
    const filename = req.params.filename;
    const filePromise = fs.readFile(filename);
    return filePromise.then(data => res.send(data))
    .catch(err => next(err));
}

// Error handler function as middleware can catch Promise rejections.
function errorHandler(err, req, res, next){
    console.log(err);
    res.status(404);
    res.json(err);
}