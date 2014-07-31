function testStorage(storage) {
  describe('Set', function () {
    it('Correct set call should be fulfilled', function () {
      expect(storage.set('empty', {}).state()).toBe('resolved');
    });

    it('Should correctly set url incopatible characters', function () {
      storage.set('test;', 'value;');

      storage.get('test;').done(function(result) {
        expect(result).toBe('value;');
      });
    });

    it('Set should fail on wrong input (e.g. on circular objects)', function () {
      var circular = {};
      circular.circular = circular;

      expect(storage.set('circular', circular).state()).toBe('rejected');
    });
  });

  describe('Get', function () {
    var test = {a: 666};

    it('Should get items', function () {
      storage.set('test2', test);

      storage.get('test2').done(function(result) {
        expect(result).toEqual(test);
      });
    });

    it('Should not return same objects', function () {
      storage.set('test', test);

      storage.get('test2').done(function(result) {
        expect(result).not.toBe(test);
      });
    });

    it('Should fail when there is no item', function () {
      expect(storage.get('test').state()).toBe('rejected');
    });
  });

  describe('Remove', function () {
    it('Should remove present items', function () {
      storage.set('empty', {});
      storage.remove('empty');

      expect(storage.get('empty').state()).toBe('rejected');
    });

    it('Correct remove should be fulfilled', function () {
      storage.set('empty', {});
      expect(storage.remove('empty').state()).toBe('resolved');
    });
  });

  describe('Each', function () {
    it('Should iterate over items', function () {
      storage.set('test', 'value');
      var iterator = jasmine.createSpy('iterator');

      storage.each(iterator);
      expect(iterator).toHaveBeenCalledWith('test', 'value');
    });

    it('Correct iteration should be fulfilled', function () {
      storage.set('test1', '');

      expect(storage.each(function () {
      }).state()).toBe('resolved');
    });

    it('Should not iterate without items', function () {
      expect(storage.each(function () {
      }).state()).toBe('rejected');
    });

    it('Should iterate over all items', function () {
      var iterator = jasmine.createSpy('iterator2');

      storage.set('test1', '');
      storage.set('test2', '');
      storage.set('test3', '');
      storage.each(iterator);

      expect(iterator.calls.length).toBe(3);
    });

    it('Should fail on wrong callback', function () {
      storage.set('test', '');

      expect(storage.each().state()).toBe('rejected');
    });
  });
}

describe('Storage', function () {
  beforeEach(function(){
    localStorage.clear();
  });

  var Storage = require('./storage');

  testStorage(new Storage());
});


describe('Fallback storage', function () {
  var cookieName = 'testCookie';

  beforeEach(function(){
    document.cookie = cookieName + '=;';
  });

  var FallbackStorage = require('./storage_fallback');

  testStorage(new FallbackStorage({cookieName: cookieName}));
});