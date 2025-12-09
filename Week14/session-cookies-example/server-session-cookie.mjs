/*
 * WARNING: This code is merely a simple demonstration of using session 
 * cookies and does not follow all security and deployment guidelines.
 * Instead, use appropriate modules, such as Passport with Express-session.
 */
'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto'; // To generate unique session IDs

const PORT = 3000;

// Users database example in memory:
const USERS = [
	new User('asilva', '1234', 'b0506867-77c3-4142-9437-1f627deebd67'),
	new User('isel', 'ipw', 'f1d1cdbc-97f0-41c4-b206-051250684b19')
];

// User constructor funciton
function User(username, password, token){
	User.counter = User.counter ? User.counter + 1 : 1;
	this.id = User.counter;
	this.name = username;
	this.password = password;
	this.token = token ? token : crypto.randomUUID();
}

// Active Sessions Storage (simulates an in-memory session store)
// Key: sessionId
// Value: { userId: #, expires: Date }
const activeSessions = {}; 

// Cookie Constants:
const SESSION_COOKIE_NAME = 'sessionId';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Express application
const app = express();

// Body Parser to read form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser()); 

app.use(attachSessionUser);

// Home route: displays authentication status
app.get('/', showHome);

// Route to send the Register form (GET)
app.get('/register', sendRegisterForm);
// Register Route (POST) and login automatically
app.post('/register', registerAndLogin);

// Route to send the Login form (GET)
app.get('/login', sendLoginForm);
// Login Route (POST)
app.post('/login', login);

// Logout Route (POST)
app.post('/logout', logout);

// Protected resource (requires authentication)
app.get('/dashboard', authenticate, showDashboard);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Current users (for testing only):`, USERS);
});


// --- Auxiliary Functions --- //

function isValidCredentials(user, username, password) {

    console.log(user, username, password);
    // Check credentials (In a real application: compare with hashed password)
    return (user && 
        user.name === username && 
        user.password === password
    );
}

// --- Auxiliary Functions: Session handling --- //

function attachUser(req, user) {

    // Attach the user information to the request for later use
    if (user) {
        req.user = {
            username: user.name,
            token: user.token
        }
    }
    console.log("Attaching user:", req.user);
}

function isAuthenticated(req) {

    // Get the Session ID from the cookie
    const sessionId = req.cookies[SESSION_COOKIE_NAME];
    console.log("(isAuthenticated) sessionId:", sessionId);

    // Check if the session is active
    if (sessionId && sessionId in activeSessions) {
        const sessionData = activeSessions[sessionId];
        console.log("Active session:", sessionData);
        
        // Check for expiration
        if (sessionData.expires > Date.now()) {

            // Get user information in the database (in memory)
            //const user = USERS.find(user => sessionData.userId === user.id);
            //console.log(user);

            // Attach the user information to the request for later use
            //attachUser(req, user);

            // User authenticated and session is valid
            return true;
        } else {
            // If expired, clear the session from storage
            delete activeSessions[sessionId];
        }
    }
    return false;    
}

function createSession(user){

    // Create a random session id and a expiry time for the cookie
    const sessionId = randomUUID();
    const expiryTime = Date.now() + SESSION_MAX_AGE;

    // Add the session to the activeSessions data
    activeSessions[sessionId] = { userId: user.id, expires: expiryTime };

    return sessionId;

}

function destroySession(sessionId){

    if (sessionId in activeSessions)
        delete activeSessions[sessionId];

}

// --- Middleware functions --- //

// Authentication middleware (for protected routes)
function authenticate(req, res, next) {

    if (isAuthenticated(req)) {
        next();
        return ;
    }
    
    // If not authenticated or invalid, clear the cookie (if it exists)
    res.clearCookie(SESSION_COOKIE_NAME);
    
    // Not authenticated
    res.status(401).send('Unauthorized access. Please log in. (<a href="/">Home</a>)');
}

// Attach the user info session to the Request object
function attachSessionUser(req, res, next) {

    // Get the Session ID from the cookie
    const sessionId = req.cookies[SESSION_COOKIE_NAME];
    console.log("(isAuthenticated) sessionId:", sessionId);

    if (sessionId in activeSessions){

        const sessionData = activeSessions[sessionId];
    
        // Get user information in the database (in memory)
        const user = USERS.find(user => sessionData.userId === user.id);

        // Attach user to req for late use
        attachUser(req, user);

    }

    next();
}

// --- HTTP Operations --- //

function showHome(req, res) {

    console.log("req.user:", req.user);

    // Verify if user is authenticated only for show
    // a personalized home.
    if (isAuthenticated(req)) {

        res.send(loggedInHome(req.user));
    } else {

        res.send(noLoggedInHome);
    }
}

function showDashboard(req, res) {

    console.log("req.user:", req.user);
    // req.user was attached in the login phase
    res.send(dashboardHome(req.user));
}

function sendLoginForm(req, res) {

    // If user is already authenticated, go home
    if (isAuthenticated(req)) {

        // TODO: for HBS view, use render function instead of send
        return res.send(loggedInHome(req.user));
    }

    // TODO: for HBS view, use render function instead of send
    res.send(loginForm);
}

function login(req, res) {

    // Get the form body
    const { username, password } = req.body;

    // Search the user in the user database (in memory)
    const user = USERS.find(u => u.name === username);

    // Check credentials
    if (isValidCredentials(user, username, password)) {
        
        // Success: Create a new session
        const sessionId = createSession(user);

        // Set the Session Cookie to the browser
        res.cookie(SESSION_COOKIE_NAME, sessionId, {maxAge: SESSION_MAX_AGE});
        
        // The response has now a session cookie that will be sent to the Browser
        res.redirect('/dashboard');

    } else {
        // TODO: implement HBS view (error)
        res.status(401).send('Invalid credentials. (<a href="/login">Try again</a>)');
    }
}

function logout(req, res) {

    // Get the cookie session
    const sessionId = req.cookies[SESSION_COOKIE_NAME];

    // Destroy a session
    destroySession(sessionId);

    // Clear req.user in express
    req.user = {};
    
    // Clear the cookie in the browser
    res.clearCookie(SESSION_COOKIE_NAME);
    
    res.redirect('/');
}

function sendRegisterForm(req, res) {
    
    // TODO: for HBS view, use render function instead of send
    res.send(registerForm);

}

function registerAndLogin(req, res) {

    // Get username and password from the body form
    const { username, password } = req.body;

    if (!username || !password) {
        // TODO: implement HBS view (error)
        return res.status(400).send('Username and password are required.');
    }

    // Check if username already exists
    if (USERS.some(u => u.username === username)) {
        // TODO: implement HBS view (error)
        return res.status(400).send('User already exists.');
    }

    // Create a new user
    // In a real application: the password must be hashed for security reasons
    const newUser = new User(username, password);
    USERS.push(newUser);

    // Create the session immediately after registration
    const sessionId = createSession(newUser);

    // Set the Session Cookie to the browser
    res.cookie(SESSION_COOKIE_NAME, sessionId, {maxAge: SESSION_MAX_AGE});

    // The response has now a session cookie that will be sent to the Browser
    res.redirect('/');
}

// --- HTML views --- //
// TODO: implement HBS view
// These views are used for simple demonstration.

const noLoggedInHome = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Cookie Session Demo</title>
		</head>
		<body>
			<header>
				<h2>Cookie Session Demo</h2>
			<header>
            <nav>
                <il>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/login">Log in</a></li>
                    <li><a href="/register">Register</a></li>
                </il>
            </nav>
			<hr>
			<session>
                You are not logged in!
			</session>
			<hr>
			<footer>
				<p>Hello IPW@ISEL</p>
			</footer>
		</body>
	</html>
`;

const dashboardHome = user => `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Cookie Session Demo</title>
		</head>
		<body>
			<header>
				<h2>Secret Dashboard</h2>
			</header>
            <nav>
                <il>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/login">Log in</a></li>
                    <li><a href="/register">Register</a></li>
                </il>
            </nav>
			<hr>
			<section>
				<p>Hello, ${user ? user.username : 'Authenticated User'}! You are logged in and can view this page.</p>
				<form action="/logout" method="POST">
					<input type="submit" value="Logout">
				</form>
			</session>
			<hr>
			</footer>
				<p>Hello ${user ? user.username : 'Authenticated User'}</p>
			</footer>
		</body>
	</html>
`;

const loggedInHome = user => `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Cookie Session Demo</title>
		</head>
		<body>
			<header>
				<h2>Welcome, ${user ? user.username : 'Authenticated User'}!</h2>
			</header>
            <nav>
                <il>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/login">Log in</a></li>
                    <li><a href="/register">Register</a></li>
                </il>
            </nav>
			<hr>
            <section>
                <p>You are authenticated via Session Cookie ID.</p>
                <p><a href="/dashboard">Go to Dashboard</a></p>
                <form method="POST" action="/logout">
                    <button type="submit">Logout</button>
                </form>
            </section>
			<hr>
			</footer>
				<p>Hello ${user ? user.username : 'Authenticated User'}</p>
			</footer>
		</body>
	</html>
        `

const registerForm = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Cookie Session Demo</title>
		</head>
		<body>
			<header>
				<h2>Register</h2>
			</header>
            <nav>
                <il>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/login">Log in</a></li>
                    <li><a href="/register">Register</a></li>
                </il>
            </nav>
			<hr>
			<section>
			<form action="/register" method="post">
				<p>
					<label for="username">Username</label>
					<input id="username" name="username" type="text" autocomplete="username" required>
				</p>
				<p>
					<label for="new-password">Password</label>
					<input id="new-password" name="password" type="password" autocomplete="new-password" required>
				</p>
				<button type="submit">Sign up</button>
			</form>
			</session>
			<hr>
			</footer>
				<p>Hello IPW@ISEL</p>
			</footer>
		</body>
	</html>
`;

const loginForm = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Cookie Session Demo</title>
		</head>
		<body>
			<header>
				<h2>Log in</h2>
			</header>
            <nav>
                <il>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/login">Log in</a></li>
                    <li><a href="/register">Register</a></li>
                </il>
            </nav>
			<hr>
            <section>
                <form action="/login" method="POST">
                    <p>
					<label for="usernameId">Username:</label>
                    <input type="text" name="username" id="usernameId" required>
                    </p>
                    <p>
					<label for="passwordId">Password: </label>
					<input type="password" name="password" id="passwordId" required>
                    </p>
					<input type="submit" value="Login">
				</form>
			</session>
			<hr>
			</footer>
				<p>Hello IPW@ISEL</p>
			</footer>
		</body>
	</html>
`;