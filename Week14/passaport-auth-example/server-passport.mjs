'use strict';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser'; // Only used to see the cookie value

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

// Passport serialize user (used automatically in log in)
passport.serializeUser((userInfo, done) => { 
	console.log("Input  (S) - userInfo:", userInfo);
	console.log("Output (S) - userInfo.id:", userInfo.id);
	done(null, userInfo.id); 
});

// Passport deserialize user (used automatically with the
// middleware passport.session() in each request)
passport.deserializeUser((userId, done) => { 
	console.log("Input  (D) - userId:", userId);
	// Find the user in the database in memory (the array USERS) 
	const user = USERS.find(user => userId === user.id);
	// Do note use all user information.
	// Filter the user data avoiding exposing passwords, for example.
	const userInfo = {
		name: user.name,
		// token: user.token
	}
	console.log("Output (D) - userId:", userId);
	done(null, userInfo); 
});

// Express session handler (from express-session module)
const sessionHandler = session({
	secret: crypto.randomUUID(),
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 24 * 60 * 60 * 1000} // 24h
});

// Express application
const app = express();

// Middlewares:
app.use(express.urlencoded({extended:true})); // Read body into req.body
app.use(sessionHandler);        // Support sessions in req.session
app.use(passport.session());    // Support login sessions in passport
//app.use(passport.authenticate('session')); // the same as above
app.use(cookieParser()); 		// Only used to see the cookie values

// Home route: displays authentication status
app.get('/', showHome);

// Route to send the Register form (GET)
app.get('/register', sendRegisterForm);
// Register Route (POST) and login automatically
app.post('/register', register);

// Route to send the Login form (GET)
app.get('/login', sendLoginForm);
// Login Route (POST)
app.post('/login', login);

// Logout Route (POST)
app.post('/logout', logout);

// Protected resource (requires authentication)
app.get('/dashboard', authenticate, showDashboard);


// App listening...
app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
	console.log(`Current users (for testing only):`, USERS);
});


// --- Middleware functions --- //

// Authentication middleware (for protected routes)
function authenticate(req, res, next) {

	if (req.isAuthenticated()){
		next();
		return ;
	}
	// Not authenticated
	// TODO: implement a error view
    res.status(401);
	res.send('Unauthorized access. Please log in. (<a href="/">Home</a>)');
	//res.redirect('/login');
}

function showHome(req, res){
	// Some logs:
	console.log("Session in home:", req.session);
	console.log("req.cookies in home:", req.cookies);
	console.log("req.user in home:", req.user);

	if (req.isAuthenticated())
		return res.send(loginHome(req.user));
	else
		res.send(noLoginHome);
}

// Show the protected resource.
function showDashboard(req, res) {
	console.log("Session in protected dashboard:", req.session);
	console.log("req.cookies in protected dashboard:", req.cookies);
	console.log("req.user in protected dashboard:", req.user);

    res.send(dashboardHome(req.user));
}

function sendLoginForm(req, res){
	// Some logs:
	console.log("Session in login form:", req.session);
	console.log("Cookies in login form:", req.cookies);

	// If user is already authenticated, go home
	if (req.isAuthenticated())
		return res.redirect('/');
	 
	return res.send(loginForm);
}

function login(req, res, next){
	console.log("Session before log in:", req.session);
	console.log("req.cookies before log in:", req.cookies);
	console.log("req.user before log in:", req.user);

	// Get username and password from the body form
    const { username, password } = req.body;

	const user = USERS.find(user => username === user.name);

	if (isValidUser(user, username, password)) {

		return req.login(user, loginAction);
	} 
	else {
		// TODO: implement a view error (or an error message in the login page)
		return res.status(401).send('<p>Invalid user/password</p> <br> <a href="/"> Go back </a>');
	}

	// Function to validate the credentials
	function isValidUser(user, username, password) {
		return user && user.name === username && user.password === password;
	}

	function loginAction(err) {
		if (err) return next(err);
		return res.redirect('/');
	}
}

function logout (req, res) {
	console.log("Session in log out:", req.session);
	console.log("req.cookies in log out:", req.cookies);
	console.log("req.user in log out:", req.user);
	return req.logout(function (){
		return res.redirect('/');
	});
}

function sendRegisterForm(req, res){
	console.log("Session in register form:", req.session);
	console.log("Cookies in register form:", req.cookies);

	return res.send(registerHome);
}

function register(req, res, next) {

	// Get the body
	const username = req.body.username;
	const password = req.body.password;

	// Find the user by username
	if (USERS.find(user => user.name === username)){
		// TODO: implement a view error (or an error message in the login page) 
		res.status(400);
		return res.send(username + ' already exists!');
	}

	// Create and store the user
	const user = new User(username, password);
	USERS.push(user);

	// Login automatically with the new user
	return req.login(user, loginAction);
}

// TODO: implement a view
const noLoginHome = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Passport Demo</title>
		</head>
		<body>
			<header>
				<h2>Passport Demo</h2>
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

const loginHome = user => `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Passport Demo</title>
		</head>
		<body>
			<header>
				<h2>Welcome, ${user ? user.name : 'Authenticated User'}!</h2>
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
				<p>Hello ${user ? user.name : 'Authenticated User'}</p>
			</footer>
		</body>
	</html>
`;

const registerHome = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Passport Demo</title>
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
			<title>Passport Demo</title>
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
				<p>Hello, ${user ? user.name : 'Authenticated User'}! You are logged in and can view this page.</p>
				<form action="/logout" method="POST">
					<input type="submit" value="Logout">
				</form>
			</session>
			<hr>
			</footer>
				<p>Hello ${user ? user.name : 'Authenticated User'}</p>
			</footer>
		</body>
	</html>
`;