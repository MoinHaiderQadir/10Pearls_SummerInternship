const { expect } = require('chai');
const sinon = require('sinon');
const { Note } = require('../src/models');
const noteService = require('../src/services/noteService');
const ApiError = require('../src/utils/ApiError');

describe('noteService', () => {
  afterEach(() => sinon.restore());

  it('getNotesForUser returns notes ordered by most recently updated', async () => {
    const fakeNotes = [{ id: 1, title: 'Note A' }];
    const findAllStub = sinon.stub(Note, 'findAll').resolves(fakeNotes);

    const result = await noteService.getNotesForUser(1);

    expect(findAllStub.calledOnce).to.be.true;
    expect(result).to.equal(fakeNotes);
  });

  it('getNoteById throws a 404 ApiError when the note is not found', async () => {
    sinon.stub(Note, 'findOne').resolves(null);

    try {
      await noteService.getNoteById(99, 1);
      throw new Error('Expected getNoteById to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.statusCode).to.equal(404);
    }
  });

  it('createNote calls Note.create with the correct payload', async () => {
    const createStub = sinon.stub(Note, 'create').resolves({ id: 1, title: 'New Note' });

    await noteService.createNote({ title: 'New Note', content: 'body', userId: 5 });

    expect(createStub.calledOnceWith({ title: 'New Note', content: 'body', userId: 5 })).to.be.true;
  });

  it('updateNote updates and saves an existing note', async () => {
    const fakeNote = { title: 'Old', content: 'Old content', save: sinon.stub().resolves() };
    sinon.stub(Note, 'findOne').resolves(fakeNote);

    const result = await noteService.updateNote(1, 5, { title: 'Updated', content: 'New content' });

    expect(fakeNote.save.calledOnce).to.be.true;
    expect(result.title).to.equal('Updated');
    expect(result.content).to.equal('New content');
  });

  it('deleteNote destroys the note and returns it', async () => {
    const fakeNote = { id: 1, destroy: sinon.stub().resolves() };
    sinon.stub(Note, 'findOne').resolves(fakeNote);

    const result = await noteService.deleteNote(1, 5);

    expect(fakeNote.destroy.calledOnce).to.be.true;
    expect(result).to.equal(fakeNote);
  });
});
