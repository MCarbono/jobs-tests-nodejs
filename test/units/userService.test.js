const { describe, test, before, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');

const { expect } = require('chai');
const chai = require('chai')
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const UserService = require('../../src/services/userService');

const {
    BadRequestError,
    UnauthenticatedError
} = require('../../src/errors')

const mocks = {
    createUserSuccess: require('../mocks/user/createUserSuccessPayload.json'),
    createUserErrorName: require('../mocks/user/createUserErrorNamePayload.json'),
    createUserErrorEmail: require('../mocks/user/createUserErrorEmailPayload.json'),
    createUserErrorPassword: require('../mocks/user/createUserErrorPasswordPayload.json'),
    loginUserSuccessPayload: require('../mocks/user/loginUserSuccessPayload.json'),
    loginUserErrorEmailPayload: require('../mocks/user/loginUserErrorEmailPayload.json'),
    loginUserErrorPasswordPayload: require('../mocks/user/loginUserErrorPasswordPayload.json'),
    loginUserInvalidCredentials: require('../mocks/user/loginUserInvalidCredentials.json'),
}

const database = {
    createUserSuccess: require('../mocks/user/createUserSuccess.json'),
    loginUserSuccess: require('../mocks/user/loginUserSuccess.json')
}

const login = {
    loginUserParametersSuccess: require('../mocks/user/login/loginUserParametersSuccess.json'),
    loginUserDatabase: require('../mocks/user/login/loginUserDatabase.json')
}

describe('User service Suite tests', () => {
    let userService;
    let sandbox;
    
    before(() => {
        userService = new UserService();
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('Register user', () => {
        test('Should be able to register a user', async () => {
            const user = mocks.createUserSuccess;
            const userRepositoryCreated = database.createUserSuccess;
            
            sandbox.stub(
                userService.repository,
                userService.repository.create.name
            ).returns(userRepositoryCreated)

            const registerSpy = sandbox.spy(userService, userService.register.name)
                
            const result = await userService.register(user)
            const { token } = result
            
            expect(registerSpy.calledOnce).to.be.ok
            expect(registerSpy.calledWithExactly(user)).to.be.ok
            expect(result).to.have.property('token')
            expect(result).to.be.deep.equal( { user: userRepositoryCreated, token } )
        })

        test('Should not be able to register a user without a name', async () => {
            const user = mocks.createUserErrorName;

            expect(userService.register(user)).to.be.rejectedWith(BadRequestError, 'Please provide name, email and password')
        })

        test('Should not be able to register a user without a email', async () => {
            const user = mocks.createUserErrorEmail;

            expect(userService.register(user)).to.be.rejectedWith(BadRequestError, 'Please provide name, email and password')
        })

        test('Should not be able to register a user without a password', async () => {
            const user = mocks.createUserErrorPassword;

            expect(userService.register(user)).to.be.rejectedWith(BadRequestError, 'Please provide name, email and password')
        })
    })

    describe("Login user", () => {
        test('Should be able to login', async () => {
            const parametersUserMock = login.loginUserParametersSuccess
            const databaseUser = login.loginUserDatabase

            sandbox.stub(
                userService.repository,
                userService.repository.getUserByEmail.name
            ).resolves(databaseUser)

            const loginSpy = sandbox.spy(userService, userService.login.name)
                
            const result = await userService.login(parametersUserMock)
            const { token } = result
            
            expect(loginSpy.calledOnce).to.be.ok
            expect(loginSpy.calledWithExactly(parametersUserMock)).to.be.ok
            expect(result).to.have.property('token')
            expect(result).to.be.deep.equal( { user: {name: databaseUser.name } , token } )
        })

        test('Should not be able to login without an email', async () => {
            const loginErrorPayload = mocks.loginUserErrorEmailPayload;

            expect(userService.login(loginErrorPayload)).to.be.rejectedWith(BadRequestError, 'Please provide email and password')
        })

        test('Should not be able to login without an password', async () => {
            const loginErrorPayload = mocks.loginUserErrorPasswordPayload;

            expect(userService.login(loginErrorPayload)).to.be.rejectedWith(BadRequestError, 'Please provide email and password')
        })

        test('Should not be able to login with a non-existent user', async () => {
            const invalidUser = mocks.loginUserInvalidCredentials

            sandbox.stub(
                userService.repository,
                userService.repository.getUserByEmail.name
            ).returns(false)

            expect(userService.login(invalidUser)).to.be.rejectedWith(UnauthenticatedError, 'Invalid Credentials')
        })

        test('Should not be able to login with an invalid password', async () => {
            const userInvalidPassword = database.loginUserSuccess
            const invalidPassword = mocks.loginUserInvalidCredentials

            sandbox.stub(
                userService.repository,
                userService.repository.getUserByEmail.name
            ).returns(userInvalidPassword)

            expect(userService.login(invalidPassword)).to.be.rejectedWith(UnauthenticatedError, 'Invalid Credentials')
        })
    })
})

