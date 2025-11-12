import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import cors from 'cors';
// Import all modules for Dependency Injection:
import tasksApiInit from './web/api/tasks-web-api.mjs';
import usersApiInit from './web/api/users-web-api.mjs';
import tasksServicesInit from './services/tasks-services.mjs';
import usersServicesInit from './services/users-services.mjs';
//import tasksDataInit from './data/mock/mock-tasks-data-mem.mjs';
import tasksDataInit from './data/mem/tasks-data-mem.mjs';
import usersDataInit from './data/mock/mock-users-data-mem.mjs';
//import usersDataInit from './data/mem/users-data-mem.mjs';

const PORT = 8000;  // Port number for the tests

let tasksAPI;
let usersAPI;

// Dependency Injection:
try {
  const tasksData = tasksDataInit();
  const usersData = usersDataInit();
  const usersServices = usersServicesInit(usersData);
  const tasksServices = tasksServicesInit(tasksData, usersServices);
  tasksAPI = tasksApiInit(tasksServices);
  usersAPI = usersApiInit(usersServices);
}
catch (err) {
  console.error(err);
}

if (tasksAPI && usersAPI) {

  const app = express(); // Express function returns an app

  // Swagger UI for the yaml documentation (OpenAPI):
  const swaggerDocument = yaml.load('./docs/tasks-api.yaml');
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Enable all CORS requests
  app.use(cors());

  // Parser the body to JSON
  app.use(express.json());

  // add user
  app.post("/users", usersAPI.addUser);

  // get task by id
  app.get("/tasks/:taskId", tasksAPI.getTask);

  // list tasks
  app.get("/tasks", tasksAPI.getAllTasks);

  // add task
  app.post("/tasks", tasksAPI.addTask);

  // delete task by id
  app.delete("/tasks/:taskId?", tasksAPI.deleteTask);

  // update task by id
  app.put("/tasks/:taskId?", tasksAPI.updateTask);

  app.use(tasksAPI.errorHandler);

  // App listening...
  app.listen(PORT, () =>
    console.log(`Tasks app listening on port ${PORT}!`),
  );

}
