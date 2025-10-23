// import * as tasksData from "./tasks-data-mem.mjs";

// WARNING:
// - Services and data are together: needs to be separated in two modules.
// - Needs internal error code implementation.

// FUNCTIONS (SERVICES + DATA):

const TASKS = [];
let currentId = TASKS.length;

function nextId(){
  return(currentId++);
}

// Input: id
// Output: an object containing a task or an empty object {}.
export function getTask(id){
    console.log("Getting task of id:", id);
    let task = TASKS.find(task => task.id == id);
    return (task);
}

// Input: a query or an empty object {}.
// Output: an object with an array of tasks.
export function getAllTasks(query){
  const queryLen = Object.keys(query).length;

  if (queryLen == 0){ // There is no query string
    return {tasks: TASKS};
  }
  console.log("Query string:", query);
  if (queryLen == 1 && "search" in query){
    const querySearch = query["search"];
    const searchTasks = TASKS.filter(task => (task.title.includes(querySearch) || 
      task.description.includes(querySearch)));
    return({tasks: searchTasks});
  }
  else {
    return null;
  }
}

export function addTask(newTask){
  console.log("Adding task with content:", newTask);
  if (! ("title" in newTask) || ! ("description" in newTask)){
    return null;
  }
  // Create a new task
  const task = {
    id: nextId(),
    title: newTask.title,
    description: newTask.description
  }
  TASKS.push(task);
  return task;
}

export function deleteTask(id){
  console.log("Deleting task of id:", id);
  let taskIndex = TASKS.findIndex(task => task.id == id);
  if (taskIndex != -1){
    let task = TASKS[taskIndex];
    TASKS.splice(taskIndex, 1);
    return (task);
  }
  else{
    return null;
  }
}

export function updateTask(id, newTask){
  console.log("Updating task of id:", id);
  let taskIndex = TASKS.findIndex(task => task.id == id);
  if (taskIndex != -1){
    if (! ("title" in newTask) || ! ("description" in newTask)){
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
