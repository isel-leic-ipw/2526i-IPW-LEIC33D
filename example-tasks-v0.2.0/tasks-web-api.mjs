import * as tasksServices from "./tasks-services.mjs";

// FUNCTIONS (WEB API):

export function getTask(req, res){
  const token = getToken(req); // TODO: Remove code repetition
  if (! token){
    res.status(401);
    res.send({error: "Missing token!"});
    return ;
  }
  const task = tasksServices.getTask(req.params.id, token);
  if (task) {
    res.send(task);
  }
  else {
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

export function getAllTasks(req, res){
  const token = getToken(req);
  if (! token){
    res.status(401);
    res.send({error: "Missing token!"});
    return ;
  }
  console.log("GetAll: Token", token);
  const tasks = tasksServices.getAllTasks(req.query, token);
  if (tasks) {
    res.json(tasks);
  }
  else {
    // TODO: include internal error code to match the HTTP status code.
    // An invalid query
    res.status(400);
    res.send({error: "The query is invalid."})
  }
}

export function addTask(req, res){
  //console.log(req.body);
  const token = getToken(req);
  if (! token){
    res.status(401);
    res.send({error: "Missing token!"});
    return ;
  }
  let task = tasksServices.addTask(req.body, token);
  if (task){
    res.status(201);
    res.send({message: `Task ${task.id} was added!`});
  }
  else{
    // TODO: include internal error code to match the HTTP status code.
    res.status(400);
    res.send({error: "Task content is invalid."});
  }
}

export function deleteTask(req, res){
  const token = getToken(req);
  if (! token){
    res.status(401);
    res.send({error: "Missing token!"});
    return ;
  }
  let deleteTask = tasksServices.deleteTask(req.params.id, token);
  if (deleteTask){
    res.json(deleteTask);
  }
  else{
    // TODO: include internal error code to match the HTTP status code.
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

export function updateTask(req, res){
  const token = getToken(req);
  if (! token){
    res.status(401);
    res.send({error: "Missing token!"});
    return ;
  }
  const updatedTask = tasksServices.updateTask(req.params.id, req.body, token);
  if (updatedTask){
    res.json(updatedTask);
  }
  else{
    // TODO: include internal error code to match the HTTP status code.
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

// Auxiliary module function
function getToken(req) {
  const authHeader = req.get("Authorization");
  if (authHeader){
    const tokenParts = authHeader.split(" ");
    if(tokenParts && tokenParts[0] == "Bearer") {
        return tokenParts[1];
    }
  }
}

