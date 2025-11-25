import { errors } from '../commons/internal-errors.mjs';

export default function init(tasksData, usersServices) {

  // Verify the module dependencies:
  if(! usersServices){
    throw errors.INVALID_ARGUMENT('usersServices');
  }
  if(! tasksData){
    throw errors.INVALID_ARGUMENT('tasksData');
  }

  // Interface
  return {
    getAllTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask
  };

  // Input: a query (object) (or an empty object {}) and a user token (String).
  // Output: a Promise of an array of tasks or a rejection with the internal error object.
  function getAllTasks(query, userToken){
    const userIdPromise = usersServices.getUserId(userToken);
    const tasksPromise = userIdPromise.then(userId => {
      if (! userId) return Promise.reject(errors.USER_NOT_FOUND());
      return tasksData.getAllTasks(userId);
    });
    return tasksPromise.then(tasks => {
      const queryLen = Object.keys(query).length;
      if (queryLen == 0) { // There is no query string
        return tasks;
      }
      if (queryLen == 1 && "search" in query) {
        const querySearch = query["search"];
        const searchedTasks = tasksData.searchTasks(tasks, querySearch);
        return(searchedTasks);
      }
      else {
        return Promise.reject(errors.INVALID_QUERY());
      }
    });
  }

  // Input: a new task object.
  // Output: a Promise of a task or a internal error object.
  function addTask(newTask, userToken){
    const userIdPromise = usersServices.getUserId(userToken);
    return userIdPromise.then(userId => {
      if (! userId) return Promise.reject(errors.USER_NOT_FOUND());
      //console.log("newTask", newTask, tasksData.isValidTask(newTask));
      if (! tasksData.isValidTask(newTask)){
        //console.log("Task is not valid")
        return Promise.reject(errors.INVALID_TASK());
      }
      return tasksData.addTask(newTask, userId);
    });
  }

  // Input: an idTask (Number) and a userToken (String).
  // Output: a Promise of a task or a internal error object.
  function getTask(idTask, userToken){
    if (! Number(idTask) || idTask < 0) {
      return Promise.reject(errors.INVALID_PARAMETER(idTask));
    }
    const userIdPromise = usersServices.getUserId(userToken);
    return userIdPromise.then(userId => {
      if (! userId) return Promise.reject(errors.USER_NOT_FOUND());
      const taskPromise = tasksData.getTask(idTask, userId);
      return taskPromise.then(task => {
        //console.log(task);
        if (! task) {
          return Promise.reject(errors.TASK_NOT_FOUND(idTask));
        }
        return (task);
      });
    });
  }

  // Input: an idTask (Number) and a userToken (String).
  // Output: a Promise of the delete task or a internal error object.
  function deleteTask(idTask, userToken){
    const taskPromise = getTask(idTask, userToken);
    return taskPromise.then(task => 
      tasksData.deleteTask(task.id, task.userId)
    );
  }

  // Input: an idTask (Number), a new task object and a userToken (String).
  // Output: a Promise of the updated task or a internal error object.
  function updateTask(idTask, newTask, userToken){
    if (! tasksData.isValidTask(newTask)){
      return Promise.reject(errors.INVALID_TASK(idTask));
    }

    const taskPromise = getTask(idTask, userToken);
    return taskPromise.then(task =>
        tasksData.updateTask(task.id, newTask, task.userId)
    );
  }
}