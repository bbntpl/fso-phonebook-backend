require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const { 
	getAll,
	getInfo,
	getPersonById,
	createPerson,
	deletePerson,
	updateNumber,
} = require('./services/mongo')

// define a token that returns the body after the request
morgan.token('body', (req, _) => req.body);

const logRequestMessages = morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(tokens.body(req, res)),
	].join(' ');
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

	next(error);
}

app.use(cors());
app.use(express.json());
app.use(logRequestMessages);
app.use(express.static('build'));

// const generateUniqueId = () => {
// 	return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
// };

app.get('/info', (req, res) => {
	getInfo(res);
});

app.get('/api/persons', (req, res) => {
	getAll(res);
});

app.get('/api/persons/:id', (req, res, next) => {
	getPersonById(req, res, next);
});

app.post('/api/persons', (req, res) => {
	const newPerson = req.body;
	createPerson(newPerson, res);
});

app.delete('/api/persons/:id', (req, res, next) => {
	deletePerson(req, res, next);
});

app.put('/api/persons/:id', (req, res, next) => {
	updateNumber(req, res, next);
})

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`starting server on port${PORT}`);
});