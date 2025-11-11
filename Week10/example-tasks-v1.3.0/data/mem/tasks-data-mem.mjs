// Memory Tasks data

import { errors } from "../../commons/internal-errors.mjs";

// Tasks data store:
const TASKS = [];

function Task(title, description, userId){
  Task.counter = Task.counter === undefined ? 
                 TASKS.length + 1 : Task.counter + 1;
  this.id = Task.counter;
  this.title = title;
  this.description = description;
  this.userId = userId;
}

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
      console.log(newTask)
      const task = new Task(newTask.title, newTask.description, userId);
      console.log(task)
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
