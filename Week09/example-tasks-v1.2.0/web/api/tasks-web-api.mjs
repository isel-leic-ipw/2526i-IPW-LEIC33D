//import * as tasksServices from "../../services/tasks-services.mjs";
import { errorToHttp  } from "./errors-to-http-responses.mjs";
import { errors } from "../../commons/internal-errors.mjs";

// FUNCTIONS (WEB API):

export default function init(tasksServices) {

  // Verify the dependencies:
  if(! tasksServices){
    throw errors.INVALID_ARGUMENT('tasksServices');
  }

  return {
    getAllTasks: processRequest(internal_getAllTasks),
    getTask: processRequest(internal_getTask),
    addTask: processRequest(internal_addTask),
    updateTask: processRequest(internal_updateTask),
    deleteTask: processRequest(internal_deleteTask)
  };

  function processRequest(operation){
    return function (req, res){
      const token = getToken(req);
      // Handling missing token
      if (! token){
        const error = errorToHttp(errors.MISSING_TOKEN());
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
    res.json({tasks: tasks});
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
}
