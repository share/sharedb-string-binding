var expect = require('expect.js');
var StringBinding = require('../index.js');
var Backend = require('sharedb');

global.document = {};

describe('StringBinding', function() {
  beforeEach(function() {
    // Mock an HTML text input or textarea
    var element = this.element = {
      value: '',
      selectionStart: 0,
      selectionEnd: 0,
      selectionDirection: 'none'
    };
    element.setSelectionRange = function(selectionStart, selectionEnd, selectionDirection) {
      element.selectionStart = selectionStart;
      element.selectionEnd = selectionEnd;
      element.selectionDirection = selectionDirection || 'none';
    };
    document.activeElement = element;

    this.backend = new Backend();
    this.connection = this.backend.connect();
    this.doc = this.connection.get('dogs', 'dog1');
    this.doc.create({name: ''});

    this.binding = new StringBinding(this.element, this.doc, ['name']);
  });

  it('supports updating the element when the doc value is the same', function() {
    expect(this.element.value).equal('');
    this.binding.update();
    expect(this.element.value).equal('');
  });

  it('supports updating the element from the current doc value', function() {
    this.doc.submitOp({p: ['name'], oi: 'Fido'});
    this.binding.update();
    expect(this.element.value).equal('Fido');
  });

  it('inserts text on input change', function() {
    this.element.value = 'Fido';
    expect(this.doc.data.name).equal('');
    this.binding.onInput();
    expect(this.doc.data.name).equal('Fido');
  });

  it('removes text on input change', function() {
    this.doc.submitOp({p: ['name'], oi: 'Fido'});
    expect(this.doc.data.name).equal('Fido');
    this.binding.onInput();
    expect(this.doc.data.name).equal('');
  });

  it('replaces text on input change', function() {
    this.element.value = 'Fido';
    this.doc.submitOp({p: ['name'], oi: 'Spot'});
    this.binding.onInput();
    expect(this.doc.data.name).equal('Fido');
  });
});
