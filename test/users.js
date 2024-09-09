const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming this is your Express app
const { expect } = chai;

chai.use(chaiHttp);

  // Test for creating a single user
  describe('POST /users - Single User Creation', () => {
    it('should create a single user with valid data', (done) => {
      const user = {
        firstName: 'arun',
        lastName: 'kumar'
      };
      
      chai.request(app)
        .post('/users/users')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.firstName).to.equal('Mr. ARUN');
          expect(res.body.data.lastName).to.equal('kumar ,Indian');
          done();
        });
    });

    it('should fail validation if firstName contains numbers', (done) => {
      const user = {
        firstName: 'narayan123',
        lastName: 'kumar'
      };
      
      chai.request(app)
        .post('/users/users')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400); // Assuming 400 status code for validation error
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0].msg).to.equal('Only alphabets are allowed');
          done();
        });
    });
  });

// Test for updating a user
  describe('PATCH /users/:id - Update User', () => {
  
    // Test for updating user with valid data
    it('should update a user with valid data', (done) => {
      const updatedUser = {
        firstName: 'janee',  // This should be transformed to 'Mr. JANE'
        lastName: 'smith',  // This should be transformed to 'smith ,Indian'
      };
  
      chai.request(app)
        .patch('/users/users/1') // Assuming user with id 1 exists
        .send(updatedUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.equal(1);  // Sequelize `update()` returns the number of updated rows
          done();
        });
    });
  
    // Test for invalid firstName with numbers
    it('should fail validation if firstName contains numbers', (done) => {
      const updatedUser = {
        firstName: 'prem123',  // Invalid as per model validation
        lastName: 'smith',
      };
  
      chai.request(app)
        .patch('/users/users/1')
        .send(updatedUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0].msg).to.equal('Only alphabets are allowed');
          done();
        });
    });
  
    // Test for updating with a too short firstName
    it('should fail validation if firstName is too short', (done) => {
      const updatedUser = {
        firstName: 'p',  // Length less than the minimum (2)
        lastName: 'smith',
      };
  
      chai.request(app)
        .patch('/users/users/1')
        .send(updatedUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0].msg).to.contain('Validation len on firstName');
          done();
        });
    });
  });