const { expect } = require('chai');
const sinon = require('sinon');
const { User } = require('../src/models');
const authService = require('../src/services/authService');
const ApiError = require('../src/utils/ApiError');

describe('authService', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('creates a new user and returns a token when email is not taken', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      const fakeUser = {
        id: 1,
        toSafeObject: () => ({ id: 1, name: 'Jane', email: 'jane@example.com' }),
      };
      sinon.stub(User, 'create').resolves(fakeUser);

      const result = await authService.registerUser({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'secret123',
      });

      expect(result.user).to.deep.equal({ id: 1, name: 'Jane', email: 'jane@example.com' });
      expect(result.token).to.be.a('string');
    });

    it('throws a 409 ApiError when the email already exists', async () => {
      sinon.stub(User, 'findOne').resolves({ id: 1, email: 'jane@example.com' });

      try {
        await authService.registerUser({
          name: 'Jane',
          email: 'jane@example.com',
          password: 'secret123',
        });
        throw new Error('Expected registerUser to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.statusCode).to.equal(409);
      }
    });
  });

  describe('loginUser', () => {
    it('throws a 401 ApiError when the user does not exist', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await authService.loginUser({ email: 'nobody@example.com', password: 'x' });
        throw new Error('Expected loginUser to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.statusCode).to.equal(401);
      }
    });

    it('throws a 401 ApiError when the password does not match', async () => {
      sinon.stub(User, 'findOne').resolves({
        comparePassword: sinon.stub().resolves(false),
      });

      try {
        await authService.loginUser({ email: 'jane@example.com', password: 'wrong' });
        throw new Error('Expected loginUser to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.statusCode).to.equal(401);
      }
    });

    it('returns user and token on successful login', async () => {
      sinon.stub(User, 'findOne').resolves({
        id: 1,
        comparePassword: sinon.stub().resolves(true),
        toSafeObject: () => ({ id: 1, name: 'Jane', email: 'jane@example.com' }),
      });

      const result = await authService.loginUser({ email: 'jane@example.com', password: 'secret123' });
      expect(result.user.email).to.equal('jane@example.com');
      expect(result.token).to.be.a('string');
    });
  });
});
