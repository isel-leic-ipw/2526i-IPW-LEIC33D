import * as tasksServices from "./tasks-services.mjs";

// FUNCTIONS (WEB API):

export function getTask(req, res){
  const task = tasksServices.getTask(req.params.id);
  if (task) {
    res.send(task);
  }
  else {
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

export function getAllTasks(req, res){
  const tasks = tasksServices.getAllTasks(req.query);
  if (tasks) {
    res.json(tasks);
  }
  else {
    // An invalid query
    res.status(400);
    res.send({error: "The query is invalid."})
  }
}

export function addTask(req, res){
  //console.log(req.body);
  let task = tasksServices.addTask(req.body);
  if (task){
    res.status(201);
    res.send({message: `Task ${task.id} was added!`});
  }
  else{
    res.status(400);
    res.send({error: "Task content is invalid."});
  }
}

export function deleteTask(req, res){
  let deleteTask = tasksServices.deleteTask(req.params.id);
  if (deleteTask){
    res.json(deleteTask);
  }
  else{
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

export function updateTask(req, res){
  const updatedTask = tasksServices.updateTask(req.params.id, req.body);
  if (updatedTask){
    res.json(updatedTask);
  }
  else{
    res.status(404);
    res.send({error: `Task ${req.params.id} not found`});
  }
}

