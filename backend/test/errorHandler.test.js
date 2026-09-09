const { expect } = require('chai');
const sinon = require('sinon');
const { errorHandler } = require('../src/middleware/errorHandler');
const ApiError = require('../src/utils/ApiError');

describe('errorHandler middleware', () => {
  const buildRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };

  it('responds with the ApiError status code and message', () => {
    const err = new ApiError(404, 'Note not found');
    const req = { originalUrl: '/api/notes/99', method: 'GET' };
    const res = buildRes();

    errorHandler(err, req, res, () => {});

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ success: false, message: 'Note not found' })).to.be.true;
  });

  it('defaults to a 500 status for unexpected errors', () => {
    const err = new Error('Something exploded');
    const req = { originalUrl: '/api/notes', method: 'GET' };
    const res = buildRes();

    errorHandler(err, req, res, () => {});

    expect(res.status.calledWith(500)).to.be.true;
  });
});
