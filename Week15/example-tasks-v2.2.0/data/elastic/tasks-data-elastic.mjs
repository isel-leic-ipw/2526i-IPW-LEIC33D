import { errors } from "../../commons/internal-errors.mjs";
import { fetchElastic } from './fetch-elastic.mjs';

// FUNCTIONS (Tasks API with Elasticsearch Database):

function Task(title, description, userId){
  this.title = title;
  this.description = description;
  this.userId = userId;
}

function aTaskFromElastic(elasticTask) {
    //console.log("Elastic:", elasticTask);
    return joinTaskId(elasticTask._source, elasticTask._id);
}

function joinTaskId(task, idTask) {
    return Object.assign({id: idTask}, task);
}

export default function init(){

    return {
        isValidTask,
        searchTasks,
        getAllTasks,
        getTask,
        addTask,
        updateTask,
        deleteTask
    };

    function isValidTask(task) {
        if (("title" in task) && ("description" in task)) {
        const title = task.title.trim(); // remove whitespaces
        const description = task.description.trim();
        if (title.length > 0 && description.length > 0)
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

    // Returns a Promise of a task
    function getTask(taskId, userId) {
        return fetchElastic('GET', '/tasks/_doc/' + taskId)
            .then(elasticTask => {
                //console.log(elasticTask);
                if(elasticTask.found && elasticTask._source.userId == userId)
                    return aTaskFromElastic(elasticTask);
                else 
                    return Promise.reject(errors.TASK_NOT_FOUND(taskId));
            });
    }

    function getAllTasks(userId) {
        const filter = {
            query: {
                match: {
                    userId: userId
                }
            }
        };
        return fetchElastic('POST', '/tasks/_search', filter)
            .then(resp => {
                if (resp.error){
                    console.error("Elastic error:", body.error.reason);
                    return []; // There is no index tasks: returns an empty list.
                }
                return resp.hits.hits;
            })
            .then(tasks => tasks.map(aTaskFromElastic));
    }

    function addTask(newTask, userId) {
        const task = new Task(newTask.title, newTask.description, userId);

        //console.log("Adding a task", task);
        return fetchElastic('POST', '/tasks/_doc' + '?refresh=wait_for', task)
            .then(body => {
                //console.log(body);
                return(joinTaskId(task, body._id));
            });
    }

    function deleteTask(idTask) {
        return fetchElastic('DELETE', '/tasks/_doc/' + idTask + '?refresh=wait_for')
            .then(body => {
                //console.log(body);
                if(body.result != 'not_found')
                    return(joinTaskId({}, body._id));
                else 
                    return Promise.reject(errors.TASK_NOT_FOUND(idTask));
            });
    }

    function updateTask(idTask, newTask, userId) {
        // Need now to complete the task data, because 
        // elastic-put replaces the resource
        const task = new Task(newTask.title, newTask.description, userId);

        return fetchElastic('PUT', '/tasks/_doc/' + idTask + '?refresh=wait_for', task)
            .then(body => {
                return joinTaskId(task, body._id);
            });
    }
}
