describe('Diff', function () {
  describe('Parser', function () {
    var Parser = require('./diff__parser');

    describe('#splitToLines', function () {
      it('should splits string correctly', function () {
        var lines = [
          'String, which contains\n',
          'some lines with different type\r\n',
          'of line-endings.\n',
          'Even old-fashioned\r',
          'Mac-classic styled lines.'
        ];

        Parser.splitToLines(lines.join('')).should.be.deep.equal(lines);
      });
    });
  });
});
