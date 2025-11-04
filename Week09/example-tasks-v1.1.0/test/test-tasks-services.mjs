import * as tasksServices from "../services/tasks-services.mjs";
import { errors } from "../commons/internal-errors.mjs";
import assert from 'assert';

// Run: npm test test/test-tasks-services.mjs

// Here, we are considering a mock test with data in memory created hard-coded.
// TODO: use dependency injection to specify the data input explicitly (next lessons).

describe("Testing Tasks Management API services with mock tasks data", () => {
    // Arrange
    // User 2 token
    const userToken = "f1d1cdbc-97f0-41c4-b206-051250684b19";
    const userId = 2;

    describe("Getting all tasks", () => {
        it("Getting all tasks from user 2 should return 5 tasks", () => {
            // Act
            const tasks = tasksServices.getAllTasks({}, userToken);
            // Assert
            assert.equal(tasks.length, 5);
        });
    });

    describe("Getting all tasks searching by string '3'", () => {
        // Arrange
        const taskId = "3";

        it("This should return an array with only one task", () => {
            // Act
            const tasks = tasksServices.getAllTasks({search: taskId}, userToken);
            const task1 = tasksServices.getTask(taskId, userToken);
            // Assert
            assert.equal(tasks.length, 1);
            assert.deepStrictEqual(tasks[0], task1);
        });
    });

    describe("Getting all tasks with invalid query", () => {
        it("Getting all tasks with invalid query should return an internal error", () => {
            // Act
            const output = tasksServices.getAllTasks({filter: "abc"}, userToken);
            // Assert
            assert.deepStrictEqual(output, errors.INVALID_QUERY());
        });
    });

    describe("Getting all tasks with invalid token", () => {
        it("Getting all tasks with invalid token should return an object with empty array", () => {
            // Act
            const output = tasksServices.getAllTasks({}, undefined);
            // Assert
            assert.deepStrictEqual(output, []);
        });
    });

    describe("Getting a specific task", () => {
        it("Getting task 1 from user 2 should return a task", () => {
            // Arrange
            const expectedTask = {
                id: 1,
                title: `Task ${1}`,
                description: `Task ${1} description`,
                userId: 2
            }
            // Act
            const task = tasksServices.getTask(1, userToken);
            // Assert
            assert.deepStrictEqual(task, expectedTask)
        });
        it("Getting task 2 from user 2 should return internal error", () => {
            // Arrange
            const idTask = "2";
            // Act
            const task = tasksServices.getTask(idTask, userToken);
            // Assert
            assert.deepStrictEqual(task, errors.TASK_NOT_FOUND(idTask));
        });
    });

    describe("Adding a task", () => {
        // Arrange
        const newTask = {
            title: `A new Task`,
            description: `This is the description fo the new task.` 
        }

        it("Adding a task for user 2", () => {
            // Arrange
            const expectedTask = Object.assign({}, newTask, {id: 10, userId: userId});
            // Act
            const addedTask = tasksServices.addTask(newTask, userToken);
            const taskGet = tasksServices.getTask(addedTask.id, userToken);
            // Assert
            assert.deepStrictEqual(addedTask, expectedTask, "addTask should return a task of id 10");
            assert.deepStrictEqual(taskGet, addedTask, "getTask should return the added task");
        });
    });

    describe("Deleting a task", () => {
        // Arrange
        const deleteIdTask = 7;

        it(`Deleting task ${deleteIdTask} for user 2`, () => {
            // Arrange
            // Act
            const deleteTask = tasksServices.deleteTask(deleteIdTask, userToken);
            const getTask = tasksServices.getTask(deleteIdTask, userToken);
            // Assert
            assert.deepStrictEqual(deleteTask.id, deleteIdTask, `Delete id task should be ${deleteIdTask}`);
            assert.deepStrictEqual(getTask, errors.TASK_NOT_FOUND(deleteTask.id), `After delete, getting task ${deleteIdTask} should return internal error`);
        });
    });

    describe("Updating a task", () => {
        // Arrange
        const updatedIdTask = 1;
        const newTask = {
            title: `An updated task`,
            description: `This is the description fo the updated task.` 
        }

        it(`Updating task ${updatedIdTask} for user 2`, () => {
            // Arrange
            const expectedTask = Object.assign({}, newTask, {id: updatedIdTask, userId: userId});
            // Act
            const updatedTask = tasksServices.updateTask(updatedIdTask, newTask, userToken);
            // Assert
            assert.deepStrictEqual(updatedTask, expectedTask);
        });
    });

    // TODO: test all success cases and all error cases
});