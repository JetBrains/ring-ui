/**
 * @fileoverview Tests for {diffTool.ParserSinglePane}
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'global/global',
  '.',
  'diff/diff',
  'diff/diff__tools',
  'diff/diff__parser'
], function(ring, chai) {
  'use strict';

  var expect = chai.expect;
  var diffTool = ring('diff').invoke('getDiffToolUtils');

  var Parser = diffTool.ParserSinglePane.getInstance();

  describe('diffTool.ParserSinglePane basics', function() {
    it('diffTool.ParserSinglePane is a singleton', function() {
      expect(Parser).to.be.an.instanceof(diffTool.ParserSinglePane);
      expect(diffTool.ParserSinglePane.getInstance()).to.equal(Parser);
    });

    it('diffTool.ParserSinglePane is a child of diffTool.Parser', function() {
      expect(Parser).to.be.an.instanceof(diffTool.Parser);
    });
  });

  describe('diffTool.ParserSinglePane helper methods and types', function() {
    it('diffTool.ParserSinglePane.getBufferModifiedLine', function() {
      var line = Parser.getBufferLine_(
          diffTool.ParserSinglePane.CodeType.MODIFIED,
          'chars');

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.CodeType.MODIFIED,
        chars: 'chars'
      });
    });

    it('diffTool.ParserSinglePane.getBufferLine_ returns valid ' +
        'object, which represents line in Buffer.', function() {
      var line = Parser.getBufferLine_(
          diffTool.ParserSinglePane.CodeType.ORIGINAL, 'piece of code', 1, 1);

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.CodeType.ORIGINAL,
        line: 'piece of code',
        modifiedLineNumber: 1,
        originalLineNumber: 1
      });
    });

    it('diffTool.ParserSinglePane.getBufferLine_ works fine with' +
        '{diffTool.parserSinglePane.BufferModifiedLine', function() {
      var modifiedLine = [
        this.getBufferModifiedLine_(
            diffTool.ParserSinglePane.LineType.UNCHANGED,
            'unchanged'),
        this.getBufferModifiedLine_(
            diffTool.ParserSinglePane.LineType.MODIFIED,
            'changed')
      ];

      var line = Parser.getBufferLine(
          diffTool.ParserSinglePane.CodeType.MODIFIED, modifiedLine, 1, 1);

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.CodeType.MODIFIED,
        line: modifiedLine,
        modifiedLineNumber: 1,
        originalLineNumber: 1
      });
    });
  });

  describe('diffTool.ParserSinglePane', function() {

  });
});
