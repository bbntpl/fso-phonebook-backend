const Person = require('../models/person')

const getAll = (res) => {
	Person.find({})
		.then(people => {
			res.json(people)
		})
}

const getPersonById = (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
}

const getInfo = (res) => {
	Person.find({})
		.countDocuments((err, totalPeople) => {
			const date = new Date()

			const content = (
				`<div>
				<p>Phonebook has info for ${totalPeople} people</p>
				<p>${date}</p>
				<div>`
			)

			res.send(content)
		})
}

const createPerson = (newPerson, res, next) => {
	const person = new Person(newPerson)

	const saveDocToDb = () => person.save()
		.then((savedPerson) => {
			console.log('Added person', savedPerson)
			res.json(savedPerson)
		})
		.catch(err => next(err))

	Person.find({}).then((people) => {
		const doesNameAlreadyExists = people.some(person => {
			return person.name === newPerson.name
		})

		const areRequirementsMet =
			Object.prototype.hasOwnProperty.call(newPerson, 'name')
			&& Object.prototype.hasOwnProperty.call(newPerson, 'number')

		if (!areRequirementsMet) {
			res.status(400).end('Error: The object must contain the name and number properties')
		} else if (doesNameAlreadyExists) {
			res.status(400).end('Error: name must be unique')
		} else {
			saveDocToDb()
		}
	})
}

const deletePerson = (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			if (result) {
				res.status(204).end()
				console.log('Deleted ', result.name, ' successfully')
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
}

const updateNumber = (req, res, next) => {
	const { body } = req
	const { id } = req.params

	// args: id(1), updatedObject(2),
	// and options.new(3) = true - it returns the updated object
	Person
		.findByIdAndUpdate(id, body, { new: true })
		.then(returnedPerson => {
			res.json(returnedPerson)
		})
		.catch(error => next(error))
}

const methods = {
	getAll,
	getPersonById,
	getInfo,
	createPerson,
	deletePerson,
	updateNumber,
}

module.exports = methods