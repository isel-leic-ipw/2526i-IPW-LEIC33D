//import * as tasksServices from "../services/tasks-services.mjs"; // before DI
import { errors } from "../commons/internal-errors.mjs";
import assert from 'assert';
// Import necessary modules for Mocha tests
import tasksServicesInit from '../services/tasks-services.mjs';
import usersServicesInit from '../services/users-services.mjs';
import tasksDataInit from '../data/mock/mock-tasks-data-mem.mjs';
import usersDataInit from '../data/mock/mock-users-data-mem.mjs';

// Run: npm test test/test-tasks-services.mjs

let tasksServices;

// Dependency Injection (DI):
try {
  const tasksData = tasksDataInit();
  const usersData = usersDataInit();
  const usersServices = usersServicesInit(usersData);
  tasksServices = tasksServicesInit(tasksData, usersServices);
}
catch (err) {
  console.error(err);
}

describe("Testing Tasks Management API services with mock tasks data", () => {
    // Arrange
    // User 2 token
    const userToken = "f1d1cdbc-97f0-41c4-b206-051250684b19";
    const userId = 2;

    describe("Getting all tasks", () => {
        it(`Getting all tasks from user ${userId} should return 5 tasks`, () => {
            // Act
            tasksServices.getAllTasks({}, userToken).then(tasks => {
                // Assert
                assert.equal(tasks.length, 5);
            })
        });
    });

    describe("Getting all tasks searching by string '3'", () => {
        // Arrange
        const taskId = "3";

        it("This should return an array with only one task", () => {
            // Act
            const tasksPromise = tasksServices.getAllTasks({search: taskId}, userToken);
            return tasksPromise.then(tasks => {
                assert.equal(tasks.length, 1);
                const taskPromise = tasksServices.getTask(taskId, userToken);
                return taskPromise.then(task => 
                    assert.deepStrictEqual(tasks[0], task)
                );
            });
        });
    });

    describe("Getting all tasks with invalid query", () => {
        it("Getting all tasks with invalid query should return an internal error", async () => {
            // Act
            try {
                // An error is expected
                await tasksServices.getAllTasks({filter: "abc"}, userToken);
            }
            catch (error){
                // Assert
                assert.deepStrictEqual(error, errors.INVALID_QUERY());
            }
        });
    });

    describe("Getting all tasks with invalid token", () => {
        it("Getting all tasks with invalid token should return a USER_NOT_FOUND error or an object with empty array", async () => {
            // Act
            try {
                const output = await tasksServices.getAllTasks({}, undefined);
                // Assert
                assert.deepStrictEqual(output, []);
            }
            catch (error){
                // Assert
                assert.deepStrictEqual(error, errors.USER_NOT_FOUND());
            }
        });
    });

    describe("Getting a specific task", () => {
        // Case of success
        it("Getting task 1 from user 2 should return a task", async () => {
            // Arrange
            const expectedTask = {
                id: 1,
                title: `Task ${1}`,
                description: `Task ${1} description`,
                userId: 2
            }
            // Act
            const task = await tasksServices.getTask(1, userToken);
            // Assert
            assert.deepStrictEqual(task, expectedTask)
        });

        // Case of error
        it("Getting task 2 from user ${userId} should return internal error", async () => {
            // Arrange
            const idTask = "2";
            // Act
            try {
                // An error is expected
                await tasksServices.getTask(idTask, userToken);
            }
            catch (error){
                // Assert
                assert.deepStrictEqual(error, errors.TASK_NOT_FOUND(idTask));                
            }
        });
    });

    describe("Adding a task", () => {
        // Arrange
        const newTask = {
            title: `A new Task`,
            description: `This is the description fo the new task.` 
        }

        it("Adding a task for user ${userId}", async () => {
            // Arrange
            const expectedTask = Object.assign({}, newTask, {id: 10, userId: userId});
            // Act
            const addedTask = await tasksServices.addTask(newTask, userToken);
            const taskGet = await tasksServices.getTask(addedTask.id, userToken);
            // Assert
            assert.deepStrictEqual(addedTask, expectedTask, "addTask should return a task of id 10");
            assert.deepStrictEqual(taskGet, addedTask, "getTask should return the added task");
        });
    });

    describe("Deleting a task", () => {
        // Arrange
        const deleteIdTask = 7;

        it(`Deleting task ${deleteIdTask} for user ${userId}`, async () => {
            // Arrange
            // Act
            const deleteTask = await tasksServices.deleteTask(deleteIdTask, userToken);
            // Assert
            assert.deepStrictEqual(deleteTask.id, deleteIdTask, `Delete id task should be ${deleteIdTask}`);
        });

        it(`Deleting task ${deleteIdTask} again for user ${userId} should return an internal error`, async () => {
            // Arrange
            // Act
            try {
                await tasksServices.getTask(deleteIdTask, userToken);
            }
            catch (error){
                assert.deepStrictEqual(error, errors.TASK_NOT_FOUND(deleteIdTask), 
                    `After delete, getting task ${deleteIdTask} should return internal error`);
            }
        });
    });

    describe("Updating a task", () => {
        // Arrange
        const updatedIdTask = 1;
        const newTask = {
            title: `An updated task`,
            description: `This is the description fo the updated task.` 
        }

        it(`Updating task ${updatedIdTask} for user ${userId}`, async () => {
            // Arrange
            const expectedTask = Object.assign({}, newTask, {id: updatedIdTask, userId: userId});
            // Act
            const updatedTask = await tasksServices.updateTask(updatedIdTask, newTask, userToken);
            // Assert
            assert.deepStrictEqual(updatedTask, expectedTask);
        });
    });

    // TODO: test all success cases and all error cases
});