import Selection from './selection';

describe('Selection', () => {
  const element = 'test';
  const element2 = 123;
  const element3 = undefined;
  const elements = [element, element, element2, element3];

  let selection;
  let onChange;
  beforeEach(() => {
    selection = new Selection();
    onChange = sinon.spy();
  });

  it('should return an instance of Set', () => {
    selection.should.be.an.instanceof(Set);
  });

  it('shouldn\'t overload other Set\'s methods', () => {
    selection.entries.should.be.equal(Set.prototype.entries);
    selection.forEach.should.be.equal(Set.prototype.forEach);
    selection.has.should.be.equal(Set.prototype.has);
    selection.keys.should.be.equal(Set.prototype.keys);
    selection.values.should.be.equal(Set.prototype.values);
  });

  it('should provide a way to subscribe to changes', () => {
    selection.on('change', onChange);
    selection.add(element);
    onChange.should.have.been.called;
  });

  it('should provide a way to unsubscribe from changes', () => {
    selection.on('change', onChange);
    selection.off('change', onChange);
    selection.add(element);
    onChange.should.not.have.been.called;
  });

  describe('the add method', () => {
    it('should add new elements', () => {
      selection.add(element);
      selection.add(element);
      selection.add(element2);
      selection.add(element3);
      selection.size.should.be.equal(3); // eslint-disable-line no-magic-numbers
    });

    it('should return its object\'s instance', () => {
      selection.add(element).should.be.an.instanceof(Selection);
      selection.add(element).should.be.an.instanceof(Selection); // trying to add an existing element
    });

    it('should call on-change listeners on adding new elements', () => {
      selection.on('change', onChange);
      selection.add(element);

      onChange.should.have.been.called;
    });

    it('shouldn\'t call on-change listeners on adding existing elements', () => {
      selection.add(element);
      selection.on('change', onChange);
      selection.add(element);

      onChange.should.not.have.been.called;
    });
  });

  describe('the delete method', () => {
    it('should delete existing elements', () => {
      selection.add(element);
      selection.add(element);
      selection.add(element2);
      selection.add(element3);

      selection.delete(element);
      selection.delete(element2);
      selection.delete(element3);

      selection.size.should.be.equal(0);
    });

    it('should return a boolean result', () => {
      selection.add(element);

      selection.delete(element).should.be.true;
      selection.delete(element).should.be.false;
    });

    it('should call on-change listeners on deleting existing elements', () => {
      selection.add(element);
      selection.on('change', onChange);
      selection.delete(element);

      onChange.should.have.been.called;
    });

    it('shouldn\'t call on-change listeners on trying to delete non-existing elements', () => {
      selection.on('change', onChange);
      selection.delete(element);

      onChange.should.not.have.been.called;
    });
  });

  describe('the clear method', () => {
    it('should delete all existing elements', () => {
      selection.add(element);
      selection.add(element);
      selection.add(element2);
      selection.add(element3);
      selection.clear();

      selection.size.should.be.equal(0);
    });

    it('should return undefined', () => {
      expect(selection.clear()).to.be.undefined;
    });

    it('should call on-change listeners on not empty set', () => {
      selection.add(element);
      selection.on('change', onChange);
      selection.clear();

      onChange.should.have.been.called;
    });

    it('shouldn\'t call on-change listeners on empty set', () => {
      selection.on('change', onChange);
      selection.clear();

      onChange.should.not.have.been.called;
    });
  });

  describe('the addGroup method', () => {
    it('should add new elements', () => {
      selection.addGroup(elements);
      selection.size.should.be.equal(3); // eslint-disable-line no-magic-numbers
    });

    it('should return its object\'s instance', () => {
      selection.addGroup(elements).should.be.an.instanceof(Selection);
      selection.addGroup(elements).should.be.an.instanceof(Selection); // trying to add an array of existing element
    });

    it('should call on-change listeners on adding new elements', () => {
      selection.on('change', onChange);
      selection.addGroup(elements);

      onChange.should.have.been.called;
    });

    it('shouldn\'t call on-change listeners on adding existing elements', () => {
      selection.addGroup(elements);
      selection.on('change', onChange);
      selection.addGroup(elements);

      onChange.should.not.have.been.called;
    });
  });

  describe('the deleteGroup method', () => {
    it('should delete existing elements', () => {
      selection.addGroup(elements);
      selection.deleteGroup(elements);

      selection.size.should.be.equal(0);
    });

    it('should return a boolean result', () => {
      selection.addGroup(elements);

      selection.deleteGroup(elements).should.be.true;
      selection.deleteGroup(elements).should.be.false;
    });

    it('should call on-change listeners on deleting existing elements', () => {
      selection.addGroup(elements);
      selection.on('change', onChange);
      selection.deleteGroup(elements);

      onChange.should.have.been.called;
    });

    it('shouldn\'t call on-change listeners on trying to delete non-existing elements', () => {
      selection.on('change', onChange);
      selection.deleteGroup(elements);

      onChange.should.not.have.been.called;
    });
  });
});
