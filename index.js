const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));

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
	}
];

const generateUniqueId = () => {
	return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

//display the total person from the phonebook and the date
app.get('/info', (req, res) => {
	const str = `<p>Phonebook has info for ${persons.length} people<p> 
	<p>${new Date()}</p>`;
	res.send(str);
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter(person => person.id !== id);

	res.status(204).end();
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(person => person.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.use(express.json());

app.post('/api/persons', (req, res) => {
	const newPerson = req.body;

	//destructured properties of request body
	const { name, number } = newPerson;

	//validates the received body to confirm
	//whether the known conditions are met
	const checkForErrors = () => {
		let error = '';
		if (!name && !number) {
			error = 'name and number are missing'
		} else if (!name || !number) {
			error = `${!name ? 'name' : 'number'} is missing`;
		} else if (persons.find(person => person.name === name)) {
			error = 'name must be unique';
		}
		return error;
	}


	if (!checkForErrors()) {
		newPerson.id = generateUniqueId();
		persons.push(newPerson);
		res.json(newPerson);
	} else {
		//respond with an error and an error message
		//when the conditions aren't met
		res.status(400).json({
			error: checkForErrors()
		});
	}

});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})