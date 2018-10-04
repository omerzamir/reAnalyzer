import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';

import User from './user.model';
import IUser from './user.interface';
import userService from './user.service';
import userController from './user.controller';
import { ValidationError } from 'mongoose';
require('../helpers/spec.helper');
const server = require('../index').app;
const expect = chai.expect;

chai.use(chaiAsPromised)
chai.use(chaiHttp);

const mockUser: IUser = new User({
    uniqueId: 'Omer',
    password: 'testTest',
    name: 'Omer Zamir'
  });
const badMockUser: IUser = new User({
    password: 'testTest',
    name: 'Omer Zamir'
});
const basePath = '/api/user/';

describe('User Service', () => {

    describe('#create', () => {
        it('Should create a user', async () => {
            const user = await userService.create(new User(mockUser));

            expect(user).to.exist;            
            expect(user).to.have.property('id');
            expect(user).to.have.property('name');
        });

        it('Should not create a user', async () => {
            await expect(userService.create(new User(badMockUser))).to.be.rejectedWith(ValidationError);
        });
    });

});

describe('User Controller', () => {

    describe('#create', () => {
        it('Should create a user', async () => {
            const user = await userController.create(new User(mockUser));

            expect(user).to.exist;            
            expect(user).to.have.property('id');
            expect(user).to.have.property('name');
        });

        it('Should not create a user', async () => {
            await expect(userController.create(new User(badMockUser))).to.be.rejectedWith(ValidationError);
        });
    });

});

describe('User Routes', () => {

    describe('/POST '+ basePath, () => {
        it('should create a user', (done) => {
            chai.request(server)
            .post(basePath)
            .send(new User(mockUser))
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.exist;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('uniqueId');
                expect(res.body).to.have.property('password');
                expect(res.body).to.have.property('name');

                done();
            });
        });

        it('should not create a user without uniqueId', (done) => {
            chai.request(server)
            .post(basePath)
            .send(new User(badMockUser))
            .end((err, res) => {

                expect(res).to.have.status(500);
                expect(res.body).to.be.empty;
                expect(res.error).to.exist;
                expect(res.error).to.be.an('error');

                done();
            });
        });
    });

  });