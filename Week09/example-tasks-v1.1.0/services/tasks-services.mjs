import * as usersServices from './users-services.mjs';
import * as tasksData from '../data/mock-tasks-data-mem.mjs';
import { errors } from '../commons/internal-errors.mjs';

// Input: a query (object) (or an empty object {}) and a user token (String).
// Output: an array of tasks or an internal error object.
export function getAllTasks(query, userToken){
  const userId = usersServices.getUserId(userToken);
  if (! userId) {
    return errors.USER_NOT_FOUND();
  }

  const tasks = tasksData.getAllTasks(userId);

  const queryLen = Object.keys(query).length;
  if (queryLen == 0){ // There is no query string
    return tasks;
  }
  if (queryLen == 1 && "search" in query){
    const querySearch = query["search"];
    const searchedTasks = tasksData.searchTasks(tasks, querySearch);
    return(searchedTasks);
  }
  else {
    return errors.INVALID_QUERY();
  }
}

// Input: a new task object.
// Output: a task or a internal error object.
export function addTask(newTask, userToken){
  const userId = usersServices.getUserId(userToken);
  if (! userId) {
    return errors.USER_NOT_FOUND();
  }
  if (! tasksData.isValidTask(newTask)){
    return errors.INVALID_TASK();
  }
  return tasksData.addTask(newTask, userId);
}

// Input: an idTask (Number) and a userToken (String).
// Output: a task or a internal error object.
export function getTask(idTask, userToken){
  if (! Number(idTask) || idTask < 0) {
    return errors.INVALID_PARAMETER(idTask);
  }
  const userId = usersServices.getUserId(userToken);
  if (! userId) {
    return errors.USER_NOT_FOUND();
  }
  //console.log(`Getting task ${idTask} from user ${userId}`);
  const task = tasksData.getTask(idTask, userId);
  if (! task) {
    return errors.TASK_NOT_FOUND(idTask);
  }
  return (task);
}

// Input: an idTask (Number) and a userToken (String).
// Output: the delete task or a internal error object.
export function deleteTask(idTask, userToken){
  const task = getTask(idTask, userToken);
  return(tasksData.deleteTask(idTask, task.userId));
}

// Input: an idTask (Number), a new task object and a userToken (String).
// Output: the updated task or a internal error object.
export function updateTask(idTask, newTask, userToken){
  
  if (! tasksData.isValidTask(newTask))
    return errors.INVALID_TASK(idTask);

  const task = getTask(idTask, userToken);
  return(tasksData.updateTask(idTask, newTask, task.userId));
}
