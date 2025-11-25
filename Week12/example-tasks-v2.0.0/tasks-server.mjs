import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import cors from 'cors';
import hbs from 'hbs';
import path from 'path';
import url from 'url';

// Import all modules for Dependency Injection:
import tasksSiteInit from './web/site/tasks-web-site.mjs';
import tasksApiInit from './web/api/tasks-web-api.mjs';
import usersApiInit from './web/api/users-web-api.mjs';
import tasksServicesInit from './services/tasks-services.mjs';
import usersServicesInit from './services/users-services.mjs';
import tasksDataInit from './data/mock/mock-tasks-data-mem.mjs';
//import tasksDataInit from './data/mem/tasks-data-mem.mjs';
import usersDataInit from './data/mock/mock-users-data-mem.mjs';
//import usersDataInit from './data/mem/users-data-mem.mjs';

const PORT = 8000;  // Port number for the tests

const CURRENT_DIR = url.fileURLToPath(new URL('.', import.meta.url));
const PATH_PUBLIC = path.join(CURRENT_DIR, 'web', 'site', 'public');
const PATH_VIEWS = path.join(CURRENT_DIR, 'web', 'site', 'views');
const PATH_PARTIALS = path.join(PATH_VIEWS, 'partials');

let tasksAPI;
let usersAPI;
let tasksSite;

// Dependency Injection:
try {
  const tasksData = tasksDataInit();
  const usersData = usersDataInit();
  const usersServices = usersServicesInit(usersData);
  const tasksServices = tasksServicesInit(tasksData, usersServices);
  tasksAPI = tasksApiInit(tasksServices);
  usersAPI = usersApiInit(usersServices);
  tasksSite = tasksSiteInit(tasksServices);
}
catch (err) {
  console.error(err);
}

if (tasksAPI && usersAPI && tasksSite) {

  const app = express(); // Express function returns an app

  // Swagger UI for the yaml documentation (OpenAPI):
  const swaggerDocument = yaml.load('./docs/tasks-api.yaml');
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Serves static files (local images, CSS, JS, ...)
  app.use(express.static(PATH_PUBLIC));

  // View path
  app.set('views', PATH_VIEWS);

  // View engine
  app.set('view engine', 'hbs');

  // Handlebars partials
  hbs.registerPartials(PATH_PARTIALS);

  // Bootstrap
  // Needs to install bootstrap: npm install bootstrap
  app.use('/', express.static(CURRENT_DIR + '/node_modules/bootstrap/dist/'));

  // Enable all CORS requests
  app.use(cors());

  // Parser the body to URL-encoded (forms in HTML)
  // 'extended: true' means that the value can be of any type.
  app.use(express.urlencoded({extended: true}));

  // Parser the body to JSON
  app.use(express.json());

  // add user
  app.post("/users", usersAPI.addUser);
  // TODO: implement web site to register an user (with passport module).
  // app.post("/site/users", usersSite.addUser); ??
  
  // get task by id
  app.get("/tasks/:taskId", tasksAPI.getTask);
  app.get("/site/tasks/:taskId", tasksSite.getTask);
  
  // list tasks
  app.get("/tasks", tasksAPI.getAllTasks);
  app.get("/site/tasks", tasksSite.getAllTasks);
  
  // add task
  app.post("/tasks", tasksAPI.addTask);
  app.post("/site/tasks", tasksSite.addTask);
  
  // delete task by id
  app.delete("/tasks/:taskId?", tasksAPI.deleteTask);
  app.post("/site/tasks/:taskId?/delete", tasksSite.deleteTask);
  
  // update task by id
  app.put("/tasks/:taskId?", tasksAPI.updateTask);
  app.post("/site/tasks/:taskId?/update", tasksSite.updateTask);
  
  // Handling all errors
  app.use("/site*", tasksSite.errorHandler);
  app.use("/tasks*", tasksAPI.errorHandler);

   // App listening...
  app.listen(PORT, () =>
    console.log(`Tasks app listening on port ${PORT}!`),
  );

}
