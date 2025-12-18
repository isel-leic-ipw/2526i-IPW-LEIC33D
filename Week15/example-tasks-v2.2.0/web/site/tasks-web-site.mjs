import { errors } from "../../commons/internal-errors.mjs";
import { errorToHttp } from '../api/errors-to-http-responses.mjs';

function setHttpError(res, err){
  const responseError = errorToHttp(err);
  res.status(responseError.status);
  return res.render("errors-view", responseError.body);
}

// FUNCTIONS (WEB SITE):

export default function init(tasksServices){

  // Verify the dependencies:
  if(! tasksServices){
    throw errors.INVALID_ARGUMENT('tasksServices');
  }

  return {
    getAllTasks: processRequest(internal_getAllTasks),
    getTask: processRequest(internal_getTask),
    addTask: processRequest(internal_addTask),
    updateTask: processRequest(internal_updateTask),
    deleteTask: processRequest(internal_deleteTask),
    errorHandler
  };

  function processRequest(operation){
    return function (req, res, next){
      console.log("Method/path:", req.method, req.path);
      console.log("cookies:", req.cookies);
      const token = getToken(req);
      console.log(token)
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
    console.log("ErrorHandler:", err);
    if (err instanceof SyntaxError && err.type == "entity.parse.failed") {
      error = errors.INVALID_JSON_PARSER();
    }
    setHttpError(res, error);
  }

  function internal_getAllTasks(req, res){
    const tasksPromise = tasksServices.getAllTasks(req.query, req.userToken);
    return tasksPromise.then(tasks => res.render("tasks-view", {tasks}));
  }

  function internal_getTask(req, res){
    const taskId = req.params.taskId;
    const taskPromise = tasksServices.getTask(taskId, req.userToken);
    return taskPromise.then(task => res.render("task-view", task));
  }

  function internal_addTask(req, res){
    const taskPromise = tasksServices.addTask(req.body, req.userToken);
    return taskPromise.then(task => {
      res.status(201); // To preserve the status code
      return internal_getAllTasks(req, res);
      //res.redirect(303, '/site/tasks');
    });
  }

  function internal_deleteTask(req, res){
    const taskId = req.params.taskId;
    const deleteTaskPromise = tasksServices.deleteTask(taskId, req.userToken);
    return deleteTaskPromise.then(deleteTask => res.redirect(303, '/site/tasks'));
  }

  function internal_updateTask(req, res){
    const taskId = req.params.taskId;
    const newTask = req.body;
    const userToken = req.userToken;
    //console.log(taskId, newTask, userToken);
    const updatedTaskPromise = tasksServices.updateTask(taskId, newTask, userToken);
    return updatedTaskPromise.then(updateTask => res.redirect(303, '/site/tasks'));
  }

  // Auxiliary module function
  function getToken(req) {
    /* TODO: add Web site authentication
     * Verify if the user is authenticated using Passport
     * If so, req object should have the user token */

    // Using hard-coded with mock memory data.
    return "b0506867-77c3-4142-9437-1f627deebd67"; // asilva in mock Memory
    //return "f122742f-8dc4-47dc-81e4-17e0fb810347"; // asilva in Elasticsearch
  }

}

