const usersEndpoints = require('./endpoints/users');
const projectsEndpoints = require('./endpoints/projects');
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

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})
