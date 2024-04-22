const usersEndpoints = require('./endpoints/users');

const express = require('express');
const app = express(); //Creamos una app de express
const port = 3000;

app.use(express.json());
/**
 * Middleware para hacer un parse sobre la información que llega del cliente en formato JSON
 * Se accederá a la información mediante req.body
 * Por el contrario la respuesta se enviaría mediante req.raw y habría que hacer el parse para acceder a la información
*/
app.use(usersEndpoints);

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})
