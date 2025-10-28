import * as usersServices from './users-services.mjs';

// FUNCTIONS (API Services + Data):
// Warning: 
// - Needs to separate into two modules: tasks-services and tasks-data-mem.
// - Needs internal error code implementation.

// Initial array for tests:
const TASKS = [];

let currentId = TASKS.length;

function nextId(){
  return(currentId++);
}

// Input: id (number) and token (String)
// Output: an Object containing a task or an empty object {}.
export function getTask(id, userToken){
  const userId = usersServices.getUserId(userToken);
  console.log("Getting task id / user id:", id, userId);
  const task = TASKS.find(
    task => task.id == id && task.userId == userId
  );
  return (task);
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
    const searchedTasks = tasksUser.filter(
      task => (task.title.includes(querySearch) || 
      task.description.includes(querySearch)));
    return({tasks: searchedTasks});
  }
  else {
    return null;
  }
}

export function addTask(newTask, userToken){
  const userId = usersServices.getUserId(userToken);
  if (! ("title" in newTask) || ! ("description" in newTask)){
    return null;
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

export function deleteTask(idTask, userToken){
  const userId = usersServices.getUserId(userToken);
  const taskIndex = TASKS.findIndex(
      task => (task.id == idTask && task.userId == userId)
    );
  if (taskIndex != -1){
    const task = TASKS[taskIndex];
    TASKS.splice(taskIndex, 1);
    return(task);
  }
}

export function updateTask(idTask, newTask, userToken){
  const userId = usersServices.getUserId(userToken);
  console.log("Updating task id / user id:", idTask, userId);
  const taskIndex = TASKS.findIndex(
    task => (task.id == idTask && task.userId == userId)
  );
  if (taskIndex != -1){
    if (! ("title" in newTask) || ! ("description" in newTask)){
      // Invalid task data
      return null;
    }
    TASKS[taskIndex].title = newTask.title;
    TASKS[taskIndex].description = newTask.description;
    return(TASKS[taskIndex]);
  }
  else{
    // Not found id
    return null; // TODO: needs to differ from invalid content.
  }
}
