const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// define a token that returns the body after the request
morgan.token('body', (req, _) => req.body );

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

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(logRequestMessages);

let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	},
	{
		"id": 5,
		"name": "B.B. Antipolo	",
		"number": "17-161-1231"
	},
];

const generateUniqueId = () => {
	return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};

app.get('/info', (req, res) => {
	const totalPersons = persons.length;
	const date = new Date();
	const content = (
		`<div>
		<p>Phonebook has info for ${totalPersons} people</p>
		<p>${date}</p>
		<div>`
	)

	res.send(content);
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(person => person.id === id);

	// if person is truthy respond with person object as json
	// otherwise, respond with status 404
	if (person) {
		res.json(person);
	} else {
		res.status(404).end('Sorry, I cannot find what you\'re looking for :(');
	}
});

app.post('/api/persons', (req, res) => {
	const person = req.body;
	person.id = generateUniqueId();

	const doesNameAlreadyExists = persons.some(p => p.name === person.name);
	const areRequirementsMet = person.hasOwnProperty('name') && person.hasOwnProperty('number');

	if (!areRequirementsMet) {
		res.status(400).end('Error: The object must contain the name and number properties');
	} else if (doesNameAlreadyExists) {
		res.status(400).end('Error: name must be unique');
	} else {
		persons = persons.concat(person)
		res.json(person);
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(note => note.id !== id)

	res.status(204).end()
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`starting server on port${PORT}`);
});