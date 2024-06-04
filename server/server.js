const usersEndpoints = require('./endpoints/users');
const projectsEndpoints = require('./endpoints/projects');
const project_userEndpoints = require('./endpoints/project_user');
const task_userEndpoints = require('./endpoints/task_user');
const phasesEndpoints = require('./endpoints/phases');
const tasksEndpoints = require('./endpoints/tasks');
const noteEndpoints = require('./endpoints/notes');
const cors = require('cors');

const express = require('express');
const app = express(); //Creamos una app de express
const port = 3000;

app.use(express.json());
app.use(cors()); //En producción hará falta especificar el origen desde el que se podrá conectar al servidor
/**
 * Middleware para hacer un parse sobre la información que llega del cliente en formato JSON
 * Se accederá a la información mediante req.body
 * Por el contrario la respuesta se enviaría mediante req.raw y habría que hacer el parse para acceder a la información
*/
app.use(usersEndpoints);
app.use(projectsEndpoints);
app.use(project_userEndpoints);
app.use(phasesEndpoints);
app.use(tasksEndpoints);
app.use(task_userEndpoints);
app.use(noteEndpoints);

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})


