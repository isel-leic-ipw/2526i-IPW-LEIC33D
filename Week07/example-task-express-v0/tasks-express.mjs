import express from 'express';

// WARNING:
// This is a very simple version of Tasks Web Application.
// - Tasks are in memory;
// - Without Web API documentation;
// - There is no module organization;
// - Without users and authentication;
// - Without asynchronous operations.

const PORT = 8000;  // Port number for the tests
const app = express(); // Express function returns an app

const TASKS = [];
let currentId = TASKS.length;

app.use(express.json());

// get task by id
app.get("/tasks/:id", getTask);

// list tasks
app.get("/tasks", getAllTasks);

// add task
app.post("/tasks", addTask);

// delete task by id
app.delete("/tasks/:id", deleteTask);

// update task by id
app.put("/tasks/:id", updateTask);

// App listening...
app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);


// FUNCTIONS:

function getTask(req, res){
    console.log("Getting task of id:", req.params.id);
    let task = TASKS.find(task => task.id == req.params.id);
    if (task)
      res.send(task);
    else
      // Not found id
      res.status(404).end();
}

function getAllTasks(req, res){
  console.log("Getting all tasks.");
  console.log("Query string:", req.query);
  res.set("Content-Type", "application/json");
  if ("search" in req.query){
    let searchTasks = TASKS.filter(task => (task.title.includes(req.query["search"]) || 
      task.description.includes(req.query["search"])))
    res.json({tasks: searchTasks})
  }
  else
    res.send(JSON.stringify({tasks: TASKS}));
    //res.json(tasks);
}

function addTask(req, res){
  console.log("Adding task with body:");
  console.log(req.body);
  if (! ("title" in req.body) || ! ("description" in req.body)){
    // A bad request
    res.status(400).end();
    return ;
  }
  let task = {
    id: currentId,
    title: req.body.title,
    description: req.body.description
  }
  TASKS.push(task);
  currentId++;
  res.status(201);
  res.json({
    message: `Task id ${task.id} was added!`,
    code: 201
  }).end();
}

function deleteTask(req, res){
  console.log("Deleting task of id:", req.params.id);
  let taskIndex = TASKS.findIndex(task => task.id == req.params.id);
  if (taskIndex != -1){
    let task = TASKS[taskIndex];
    // Usage: array.splice(startIndex, deleteCount)
    TASKS.splice(taskIndex, 1);
    res.json(task).end();
  }
  else{
    // Not found id
    res.status(404).end();
  }
}

function updateTask(req, res){
  console.log("Updating task of id:", req.params.id);
  let taskIndex = TASKS.findIndex(task => task.id == req.params.id);
  if (taskIndex != -1){
    if (! ("title" in req.body) || ! ("description" in req.body)){
      // A bad request
      res.status(400).end();
      return ;
    }
    TASKS[taskIndex].title = req.body.title;
    TASKS[taskIndex].description = req.body.description;
    res.json(TASKS[taskIndex]).end();
  }
  else{
    // Not found id
    res.status(404).end();
  }
}

// Test: use the Rest Client in VScode to make the requests of resquest.http file.
