// MOCK of tasks data (async)

import { errors } from "../../commons/internal-errors.mjs";

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

export default function init(){

  return {
    getAllTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask,
    isValidTask,
    searchTasks
  };

  function nextId(){
    return(currentId++);
  }

  function getAllTasks(userId) {
    return new Promise((resolve, reject) => {
      const tasksUser = TASKS.filter(task => task.userId == userId);
      resolve(tasksUser);
    });
  }

  // TODO: verify if values exist.
  function isValidTask(task) {
      if (("title" in task) && 
          ("description" in task)){
              return true;
          }
      return false;
  }

  function searchTasks(tasks, querySearch) {
    return new Promise((resolve, reject) => { 
      if (! querySearch) resolve(tasks);
      const searchedTasks = tasks.filter(
        task => (task.title.includes(querySearch) || 
        task.description.includes(querySearch))
      );
      resolve(searchedTasks);
    });
  }

  function addTask(newTask, userId){
    return new Promise((resolve, reject) => {
      let task = {
        id: nextId(),
        title: newTask.title,
        description: newTask.description,
        userId: userId
      }
      TASKS.push(task);
      resolve(task);
    });
  }

  function getTask(idTask, userId){
    return new Promise((resolve, reject) => {
      const task = TASKS.find(
        task => task.id == idTask && task.userId == userId
      );
      resolve(task);
    });
  }

  function deleteTask(idTask, userId){
    return new Promise((resolve, reject) => {
      const taskIndex = TASKS.findIndex(
          task => (task.id == idTask && task.userId == userId)
        );
      if (taskIndex == -1){
        reject(errors.TASK_NOT_FOUND(idTask));
      }
      else {
        const task = TASKS[taskIndex];
        TASKS.splice(taskIndex, 1);
        resolve(task);
      }
    });
  }

  function updateTask(idTask, newTask, userId){
    return new Promise((resolve, reject) => {
      const taskIndex = TASKS.findIndex(
        task => (task.id == idTask && task.userId == userId)
      );
      if (taskIndex == -1){
        reject(errors.TASK_NOT_FOUND(idTask));
      }
      else {
        TASKS[taskIndex].title = newTask.title;
        TASKS[taskIndex].description = newTask.description;
        resolve(TASKS[taskIndex]);
      }
    });
  }

}
