import * as tasksServices from "../../services/mock-tasks-services.mjs";
import { errorToHttp  } from "./errors-to-http-responses.mjs";
import { INTERNAL_ERROR_CODES } from "../../commons/internal-errors.mjs";

// FUNCTIONS (WEB API):

export const getAllTasks = processRequest(internal_getAllTasks);
export const getTask = processRequest(internal_getTask);
export const addTask = processRequest(internal_addTask);
export const updateTask = processRequest(internal_updateTask);
export const deleteTask = processRequest(internal_deleteTask);

function processRequest(operation){
  return function (req, res){
    const token = getToken(req);
    // Handling missing token
    if (! token){
      const error = errorToHttp({
        internalError: INTERNAL_ERROR_CODES.MISSING_TOKEN,
        description: "Missing Token"
      });
      res.status(error.status);
      res.json(error.body);
      return ;
    }
    req.userToken = token;
    const internalError = operation(req, res);
    // Handling services errors
    if (internalError){
      const error = errorToHttp(internalError);
      res.status(error.status);
      res.json(error.body);
    }
  };
}

function internal_getAllTasks(req, res){
  const output = tasksServices.getAllTasks(req.query, req.userToken);
  if (output.internalError) return output;

  // Success case
  const tasks = output;
  res.json(tasks);
}

function internal_getTask(req, res){
  const output = tasksServices.getTask(req.params.taskId, req.userToken);
  if (output.internalError) return output;

  // Success case
  const task = output;
  res.json(task);
}

function internal_addTask(req, res){
  const output = tasksServices.addTask(req.body, req.userToken);
  if (output.internalError) return output;

  // Success case
  const task = output;
  res.status(201);
  res.json({
    status: `Task ${task.id} was added!`,
    task: task
  });
}

function internal_deleteTask(req, res){
  const taskId = req.params.taskId;
  let output = tasksServices.deleteTask(taskId, req.userToken);

  // Success case
  if (output.internalError) return output;
  const deleteTask = output;
  res.json({
    status: `Task ${deleteTask.id} was delete!`,
  });
}

function internal_updateTask(req, res){
  const taskId = req.params.taskId;
  let output = tasksServices.updateTask(taskId, req.body, req.userToken);
  if (output.internalError) return output;

  // Success case
  const updatedTask = output;
  res.json({
    status: `Task ${updatedTask.id} was updated!`,
    task: updatedTask
  });
}

// Auxiliary module function
function getToken(req) {
  const authToken = req.get("Authorization");
  if (authToken){
    console.log(authToken);
    const tokenParts = authToken.split(" ");
    if(tokenParts && tokenParts[0] == "Bearer") {
        return tokenParts[1];
    }
  }
}

