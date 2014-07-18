describe('Diff.Parser', function () {
  var Parser = require('./Parser');
  var parser;

  beforeEach(function () {
    parser = new Parser();
  });

  it('should be singleton', function () {
    parser = Parser.getInstance();
    expect(Parser.getInstance()).toBe(parser);
  });

  describe('#splitToLines', function () {
    it('should splits string correctly', function () {
      var lines = [
        'String, which contains\n',
        'some lines with different type\r\n',
        'of line-endings.\n',
        'Even old-fashioned\r',
        'Mac-classic styled lines.'
      ];

      expect(Parser.splitToLines(lines.join('')))
        .toEqual(lines);
    });
  });
});
