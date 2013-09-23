/**
 * @fileoverview Tests for {diffTool.Parser}
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'global/global',
  'chai',
  'diff/diff',
  'diff/diff__tools',
  'diff/diff__parser'
], function(ring, chai) {
  'use strict';

  var expect = chai.expect;
  var diffTool = ring('diff').invoke('getDiffToolUtils');

  var Parser = diffTool.Parser.getInstance();

  describe('diffTool.Parser basics', function() {
    it('diffTool.Parser is a singleton', function() {
      expect(Parser).to.be.an.instanceof(diffTool.Parser);
      expect(diffTool.Parser.getInstance()).to.equal(Parser);
    });
  });

  describe('diffTool.Parser.splitToLines', function() {
    it('diffTool.Parser.splitToLines splits string correctly', function() {
      var string = 'String, which contains\n' +
        'some lines with different type\r\n' +
        'of line-endings.\n' +
        'Even old-fashioned\r' +
        'Mac-classic styled lines.';
      var splitLines = diffTool.Parser.splitToLines(string);

      expect(splitLines).to.eql([
        'String, which contains\n',
        'some lines with different type\r\n',
        'of line-endings.\n',
        'Even old-fashioned\r',
        'Mac-classic styled lines.'
      ]);
    });
  });
});
 