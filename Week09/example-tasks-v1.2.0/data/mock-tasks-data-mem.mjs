// MOCK of tasks data
// This is a simple implementation: to be refactored.

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
    const tasksUser = TASKS.filter(task => task.userId == userId);
    return tasksUser;
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
      if (! querySearch) return tasks;
      const searchedTasks = tasks.filter(
        task => (task.title.includes(querySearch) || 
        task.description.includes(querySearch))
      );
      return(searchedTasks);
  }

  function addTask(newTask, userId){
    let task = {
      id: nextId(),
      title: newTask.title,
      description: newTask.description,
      userId: userId
    }
    TASKS.push(task);
    return task;
  }

  function getTask(idTask, userId){
    const task = TASKS.find(
      task => task.id == idTask && task.userId == userId
    );
    return (task);
  }

  function deleteTask(idTask, userId){
    const taskIndex = TASKS.findIndex(
        task => (task.id == idTask && task.userId == userId)
      );
    if (taskIndex != -1){
      const task = TASKS[taskIndex];
      TASKS.splice(taskIndex, 1);
      return(task);
    }
  }

  function updateTask(idTask, newTask, userId){
    const taskIndex = TASKS.findIndex(
      task => (task.id == idTask && task.userId == userId)
    );
    if (taskIndex != -1){
      TASKS[taskIndex].title = newTask.title;
      TASKS[taskIndex].description = newTask.description;
      return(TASKS[taskIndex]);
    }
  }

}
