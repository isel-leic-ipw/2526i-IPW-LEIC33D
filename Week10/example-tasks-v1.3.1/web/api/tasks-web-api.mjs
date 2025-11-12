import { errorToHttp  } from "./errors-to-http-responses.mjs";
import { errors } from "../../commons/internal-errors.mjs";

// FUNCTIONS (WEB API):

// Auxiliary module functions:

// Input: the Response Object and the internal error object to be set.
function setHttpError(res, internalError) {
  const error = errorToHttp(internalError);
  res.status(error.status);
  res.json(error.body);
}

// Input: a Request HTTP Object.
// Output: the token (String) or undefined.
function getToken(req) {
  const authToken = req.get("Authorization");
  if (authToken){
    console.log("Token:", authToken);
    const tokenParts = authToken.split(" ");
    if(tokenParts && tokenParts[0] == "Bearer") {
        return tokenParts[1];
    }
  }
}

// Export default to implement the Dependency Injection
export default function init(tasksServices) {

  // Verify the module dependencies:
  if(! tasksServices){
    return Promise.reject(errors.INVALID_ARGUMENT('tasksServices'));
  }

  return {
    getAllTasks: processRequest(internal_getAllTasks),
    getTask: processRequest(internal_getTask),
    addTask: processRequest(internal_addTask),
    updateTask: processRequest(internal_updateTask),
    deleteTask: processRequest(internal_deleteTask),
    errorHandler: errorHandler
  };

  function processRequest(operation){
    return function (req, res, next){
      const token = getToken(req);
      // Handling missing token
      if (! token){
        next(errors.MISSING_TOKEN());
      }
      else {
        req.userToken = token;
        // Call the operation:
        operation(req, res).catch(next);
      }
    };
  }

  function errorHandler(err, req, res, next){
    let error = err;
    if (err instanceof SyntaxError && err.type == "entity.parse.failed") {
      error = errors.INVALID_JSON_PARSER();
    }
    setHttpError(res, error);
  }

  function internal_getAllTasks(req, res){
    const tasksPromise = tasksServices.getAllTasks(req.query, req.userToken);
    return tasksPromise.then(tasks => res.json({tasks: tasks}));
  }

  function internal_getTask(req, res){
    const taskPromise = tasksServices.getTask(req.params.taskId, req.userToken);
    return taskPromise.then(task => res.json(task));
  }

  function internal_addTask(req, res){
    const addedTaskPromise = tasksServices.addTask(req.body, req.userToken);
    return addedTaskPromise.then(task => {
      res.status(201);
      res.json({
        status: `Task ${task.id} was added!`,
        task: task
      });
    });
  }

  function internal_deleteTask(req, res){
    const taskId = req.params.taskId;
    const deleteTaskPromise = tasksServices.deleteTask(taskId, req.userToken);

    return deleteTaskPromise.then(deleteTask =>
      res.json({
        status: `Task ${deleteTask.id} was delete!`,
      })
    );
  }

  function internal_updateTask(req, res){
    const taskId = req.params.taskId;
    const updatedTaskPromise = tasksServices.updateTask(taskId, req.body, req.userToken);
    return updatedTaskPromise.then(updatedTask =>
      res.json({
        status: `Task ${updatedTask.id} was updated!`,
        task: updatedTask
      })
    );
  }

}
