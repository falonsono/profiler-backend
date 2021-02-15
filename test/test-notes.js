const chai = require('chai');
const logger = require('mocha-logger');
const expect = chai.expect;
const { step } = require('mocha-steps');
let server = require('../server');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('Notes API test', function () {
	let note;

	step('/GET should GET all the notes', async function (done) {
		try {
			chai.request(server)
				.get('/api/notes')
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					res.body.should.be.a('array');
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/POST insert note with invalid parameters should return error', async function (done) {
		try {
			
			chai.request(server)
				.post('/api/notes')
				.end((err, res) => {
					res.should.have.status(400);
					logger.error(JSON.stringify(res.text));
					expect(res.text).to.be.a('string');
					let responseText = JSON.parse(res.text)
					expect(responseText.message).to.equal('Invalid parameters!');
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/POST should insert note', async function (done) {
		try {
			let payload = {
				description: 'Test note',
				username: 'testuser'
			}
			chai.request(server)
				.post('/api/notes', payload)
				.send(payload)
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					let response = JSON.parse(res.text);
					response.id.should.be.a('number');
					response.username.should.be.a('string');
					response.description.should.be.a('string');

					note = response;
					
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/GET with parameter should return Note from last insertion test', async function (done) {
		try {
			chai.request(server)
				.get(`/api/notes/${note.id}`)
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					let response = JSON.parse(res.text);
					response.id.should.be.equal(note.id);
					response.username.should.be.equal(note.username);
					response.description.should.be.equal(note.description);
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/PUT should update record', async function (done) {
		try {

			let payload = {
				description: 'Test note UPDATED',
				username: 'testuser-updated'
			}

			chai.request(server)
				.put(`/api/notes/${note.id}`)
				.send(payload)
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					let response = JSON.parse(res.text);
					expect(response.message).to.equal('Note was updated successfully.');
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/DELETE should delete inserted note', async function (done) {
		try {
			chai.request(server)
				.delete(`/api/notes/${note.id}`)
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					let response = JSON.parse(res.text);
					expect(response.message).to.equal('Note was deleted successfully!');
					done();
			});

		} catch (e) {
			done(e);
		}
	});

	step('/DELETE inexistent note should return error', async function (done) {
		try {
			chai.request(server)
				.delete(`/api/notes/${note.id}`)
				.end((err, res) => {
					res.should.have.status(200);
					logger.log(JSON.stringify(res.text));
					let response = JSON.parse(res.text);
					expect(response.message).to.equal(`Cannot delete Note with id=${note.id}. Maybe Note was not found!`);
					done();
			});

		} catch (e) {
			done(e);
		}
	});

});