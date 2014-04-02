define(['global/global', 'chai', 'chai-as-promised', 'shortcuts/shortcuts'], function(ring, chai) {
  'use strict';

  var expect = chai.expect;
  var shortcuts = ring('shortcuts');

  describe('Shortcuts', function () {
    it('Default scope should be empty', function () {
      expect(shortcuts('getScope')).to.eql([]);
    });

    describe('Scope chain operations', function () {
      var scope1 = 'a';
      var scope2 = 'bb';
      var scope3 = 'ccc';

      beforeEach(function(){
        shortcuts('setScope');
      });

      it('Emptified scope chain be equal to default', function () {
        expect(shortcuts('getScope')).to.eql([]);
      });

      it('setScope should set full scope chain by string name', function () {
        var scope = 'aaaa';
        shortcuts('setScope', scope);

        expect(shortcuts('getScope')).to.eql([scope]);
      });

      it('setScope should set full scope chain by array of names', function () {
        shortcuts('setScope', [scope1, scope2]);

        expect(shortcuts('getScope')).to.eql([scope1, scope2]);
      });

      it('pushScope should add scope to scope chain end', function () {
        shortcuts('setScope', scope1);
        shortcuts('pushScope', scope2);

        expect(shortcuts('getScope')).to.eql([scope1, scope2]);
      });

      it('popScope should remove by name scope and next scopes from chain', function () {
        shortcuts('setScope', [scope1, scope2, scope3]);
        shortcuts('popScope', scope2);

        expect(shortcuts('getScope')).to.eql([scope1]);
      });

      it('spliceScope should remove by name scope from chain', function () {
        shortcuts('setScope', [scope1, scope2, scope3]);
        shortcuts('spliceScope', scope2);

        expect(shortcuts('getScope')).to.eql([scope1, scope3]);
      });
    });
  });
});
