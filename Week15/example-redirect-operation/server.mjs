import express from 'express';

const PORT = process.env.PORT || 7200;

const app = express();

// a middleware to log method and path
app.use((req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    next();
});

// simple redirect to echo with a query tracking the HTTP method
app.all('/redirect', (req, res) => {
    res.status(201);
    // With re-trigger operation (e.g., a redirect of a PUT results in PUT /echo)
    res.redirect(`/echo?retrigger=Passing%20by%20${req.method}%20redirect...`);
    // Without re-trigger operation (e.g., a redirect of a PUT results in GET /echo)
    //res.redirect(303, `/echo?retrigger=Passing%20by%20${req.method}%20redirect...`);
});

// echo endpoint for testing re-trigger delete for the redirect
app.all('/echo', (req, res) => {
    res.json({
        message: `This is a ${req.method} re-trigger in the /echo endpoint`,
        query: req.query
    });
});

// any other operation should return 'Not Found'
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});