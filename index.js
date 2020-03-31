/*
    CommonJS module import syntax, because Node doesn't have simple support for "import express from 'express'" (ES6 import syntax) yet. Note that it's a different story on the front end

    To be able to use ES6 syntax, we need a transpiler like Babel to convert our ES6+-style code to ES5
*/
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

/*
    when deploying our code to Heroku, they will expect our app to listen on a specific port, which we don't know ahead of time. Heroku will instead specify the port in an environment variable, which we must read
    using process.env.PORT and instruct our app to listen on
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT);
