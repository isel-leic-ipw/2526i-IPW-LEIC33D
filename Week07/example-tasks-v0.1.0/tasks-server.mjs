import express from 'express';
import * as tasksAPI from './tasks-web-api.mjs';
import * as usersAPI from './users-web-api.mjs';

// WARNING:
// This is a simple version of Tasks Web Application.
// - Without Web API documentation;
// - There is no module organization (in process here);
// - Without properly error handling;
// - Tasks are in memory;
// - Without asynchronous operations.

const PORT = 8000;  // Port number for the tests
const app = express(); // Express function returns an app

app.use(express.json());

// get task by id
app.get("/tasks/:id", tasksAPI.getTask);

// list tasks
app.get("/tasks", tasksAPI.getAllTasks);

// add task
app.post("/tasks", tasksAPI.addTask);

// delete task by id
app.delete("/tasks/:id", tasksAPI.deleteTask);

// update task by id
app.put("/tasks/:id", tasksAPI.updateTask);

// add user
app.post("/users", usersAPI.addUser);

// App listening...
app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);

// Testing: use the Rest Client in VScode or Postman to make the following request
