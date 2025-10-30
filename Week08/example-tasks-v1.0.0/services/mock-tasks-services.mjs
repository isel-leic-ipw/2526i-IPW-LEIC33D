import * as usersServices from './mock-users-services.mjs';
import { INTERNAL_ERROR_CODES } from '../commons/internal-errors.mjs';

// MOCK of tasks service (service + data)
// Error handling needs to be refactored here.

const NUM_TASKS = 10;

// Initial array for tests:
const TASKS = new Array(NUM_TASKS)
                .fill(0).map((v, idx) => { 
                    return { 
                        id: idx, 
                        title: `Task ${idx}`, 
                        description: `Task ${idx} description`,
                        userId: (idx % 2 + 1) // user 1 or 2
                     }
                });

let currentId = TASKS.length;

function nextId(){
  return(currentId++);
}

// Input: a query (Object) or an empty object {} and a user token (String).
// Output: an object with an array of tasks.
export function getAllTasks(query, userToken){
  const userId = usersServices.getUserId(userToken);
  const queryLen = Object.keys(query).length;

  const tasksUser = TASKS.filter(task => task.userId == userId);

  if (queryLen == 0){ // There is no query string
    return {tasks: tasksUser};
  }
  console.log("Query string:", query);
  if (queryLen == 1 && "search" in query){
    const querySearch = query["search"];
    console.log(tasksUser);
    const searchedTasks = tasksUser.filter(
      task => (task.title.includes(querySearch) || 
      task.description.includes(querySearch))
    );
    return({tasks: searchedTasks});
  }
  else {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_QUERY,
      description: `Query string is invalid.`
    };
  }
}

export function addTask(newTask, userToken){
  const userId = usersServices.getUserId(userToken);
  if (! ("title" in newTask) || ! ("description" in newTask)){
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_BODY,
      description: `Invalid body: missing title and/or description.`
    };
  }
  let task = {
    id: nextId(),
    title: newTask.title,
    description: newTask.description,
    userId: userId
  }
  TASKS.push(task);
  return task;
}

export function getTask(idTask, userToken){
  if (! Number(idTask) || idTask < 0) {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_PARAMETER,
      description: `Invalid parameter: ${idTask} is not a valid value.`
    };
  }
  const userId = usersServices.getUserId(userToken);
  console.log(`Getting task ${idTask} from user ${userId}`);
  const task = TASKS.find(
    task => task.id == idTask && task.userId == userId
  );
  if (! task) {
    return {
      internalError: INTERNAL_ERROR_CODES.TASK_NOT_FOUND,
      description: `Task ${idTask} not found.`
    }; 
  }
  return (task);
}

export function deleteTask(idTask, userToken){
  if (! Number(idTask) || idTask < 0) {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_PARAMETER,
      description: `Invalid parameter: ${idTask} is not a valid value.`
    };
  }
  const userId = usersServices.getUserId(userToken);
  const taskIndex = TASKS.findIndex(
      task => (task.id == idTask && task.userId == userId)
    );
  if (taskIndex == -1){
    return {
      internalError: INTERNAL_ERROR_CODES.TASK_NOT_FOUND,
      description: `Task ${idTask} not found.`
    };
  }
  const task = TASKS[taskIndex];
  TASKS.splice(taskIndex, 1);
  return(task);
}

export function updateTask(idTask, newTask, userToken){
  if (! Number(idTask) || idTask < 0) {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_PARAMETER,
      description: `Invalid parameter: ${idTask} is not a valid value.`
    };
  }
  const userId = usersServices.getUserId(userToken);
  console.log(`Updating task ${idTask} from user ${userId}`);
  const taskIndex = TASKS.findIndex(
    task => (task.id == idTask && task.userId == userId)
  );
  if (taskIndex != -1){
    if (! ("title" in newTask) || ! ("description" in newTask)){
      // Invalid task data
      return {
        internalError: INTERNAL_ERROR_CODES.INVALID_BODY,
        description: `Invalid body: missing title and description.`
      };
    }
    TASKS[taskIndex].title = newTask.title;
    TASKS[taskIndex].description = newTask.description;
    return(TASKS[taskIndex]);
  }
  else{
    // Not found id
    return {
      internalError: INTERNAL_ERROR_CODES.TASK_NOT_FOUND,
      description: `Task ${idTask} not found.`
    };
  }
}
