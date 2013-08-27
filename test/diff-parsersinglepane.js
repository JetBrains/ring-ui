/**
 * @fileoverview Tests for {diffTool.ParserSinglePane}
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'global/global',
  'chai',
  'diff/diff',
  'diff/diff__tools',
  'diff/diff__parser',
  'diff/diff__parser_singlepane'
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
      var line = Parser.getBufferModifiedLine_(
          diffTool.ParserSinglePane.LineType.MODIFIED,
          'chars');

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.LineType.MODIFIED,
        chars: 'chars'
      });
    });

    it('diffTool.ParserSinglePane.getBufferLine_ returns valid ' +
        'object, which represents line in Buffer.', function() {
      var line = Parser.getBufferLine_(
          diffTool.ParserSinglePane.LineType.ORIGINAL, 'piece of code', 1, 1);

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.LineType.ORIGINAL,
        line: 'piece of code',
        modifiedLineNumber: 1,
        originalLineNumber: 1
      });
    });

    it('diffTool.ParserSinglePane.getBufferLine_ works fine with' +
        '{diffTool.parserSinglePane.BufferModifiedLine', function() {
      var modifiedLine = [
        Parser.getBufferModifiedLine_(
            diffTool.ParserSinglePane.LineType.UNCHANGED,
            'unchanged'),
        Parser.getBufferModifiedLine_(
            diffTool.ParserSinglePane.LineType.MODIFIED,
            'changed')
      ];

      var line = Parser.getBufferLine_(
          diffTool.ParserSinglePane.LineType.MODIFIED, modifiedLine, 1, 1);

      expect(line).to.eql({
        codeType: diffTool.ParserSinglePane.LineType.MODIFIED,
        line: modifiedLine,
        modifiedLineNumber: 1,
        originalLineNumber: 1
      });
    });
  });

  describe('diffTool.ParserSinglePane parse methods', function() {
    // todo(igor.alexeenko): Add test cases for multiline ranges.
    describe('diffTool.ParserSinglePane.parseInlineChanges', function() {
      it('diffTool.ParserSinglePane.parseInlineChanges returns' +
          'initial string if range object has not been taken', function() {
        expect(Parser.parseInlineChanges('string', undefined, undefined)).
            to.equal('string');
      });

      it('diffTool.ParserSinglePane.parseInlineChanges returns valid' +
          'line for output buffer.', function() {
        var chars = 'The quick brown fox jumps over the lazy dog.';

        it('diffTool.ParserSinglePane.parseInlineChanges parses ' +
            'original line, from which was deleted some chars', function() {
          var ranges = [
            {
              type: diffTool.Parser.ModificationType.UNCHANGED,
              chars: 16
            },
            {
              type: diffTool.Parser.ModificationType.MODIFIED,
              oldChars: 3
            },
            {
              type: diffTool.Parser.ModificationType.UNCHANGED,
              chars: 25
            }
          ];

          var parsedLine = [
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.UNCHANGED,
                'The quick brown '),
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.MODIFIED,
                'fox'),
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.UNCHANGED,
                ' jumps over the lazy dog.')
          ];

          expect(Parser.parseInlineChanges(chars, ranges,
              diffTool.ParserSinglePane.LineType.ORIGINAL)).to.eql(parsedLine);
        });

        it('diffTool.ParserSinglePane.parseInlineChanges parses' +
            'modified line with inserted chars.', function() {
          var ranges = [
            {
              type: diffTool.Parser.ModificationType.UNCHANGED,
              chars: 16
            },
            {
              type: diffTool.Parser.ModificationType.MODIFIED,
              newChars: 3
            },
            {
              type: diffTool.Parser.ModificationType.UNCHANGED,
              chars: 25
            }
          ];

          var parsedLine = [
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.UNCHANGED,
                'The quick brown '),
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.MODIFIED,
                'fox'),
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.UNCHANGED,
                ' jumps over the lazy dog.')
          ];

          expect(Parser.parseInlineChanges(chars, ranges,
              diffTool.ParserSinglePane.LineType.MODIFIED)).to.eql(parsedLine);
        });

        it('diffTool.ParserSinglePane.parseInlineChanges returns an empty ' +
            'string in place in original line, where some chars were ' +
            'inserted, or in modified line, where some chars ' +
            'were removed', function() {
          var ranges = [
            {
              type: diffTool.Parser.ModificationType.MODIFIED,
              oldChars: 0
            }, {
              type: diffTool.Parser.ModificationType.MODIFIED,
              unchanged: 44
            }
          ];

          var parsedLine = [
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.MODIFIED,
                ''),
            Parser.getBufferModifiedLine_(
                diffTool.Parser.ModificationType.UNCHANGED,
                'The quick brown fox jumps over the lazy dog.')
          ];

          expect(Parser.parseInlineChanges(chars, ranges,
              diffTool.ParserSinglePane.LineType.ORIGINAL)).to.eql(parsedLine);
        });
      });
    });

    describe('diffTool.ParserSinglePane.parseLineChanges', function() {
      it('diffTool.ParserSinglePane.parseLineChanges outputs' +
          'original lines of code, then outputs modified lines.' +
          'Number of lines are correct.', function() {
        var originalLines = ['some\n', 'original\n', 'lines\n'];
        var modifiedLines = ['this\n', 'lines\n', 'are\n', 'modified\n'];
        var originalOffset = 0;
        var modifiedOffset = 0;

        var output = Parser.parseLineChanges(originalLines, modifiedLines,
            originalOffset, modifiedOffset);

        expect(output).to.eql([
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.ORIGINAL,
              'some\n', 1, null),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.ORIGINAL,
              'original\n', 2, null),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.ORIGINAL,
              'lines\n', 3, null),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.MODIFIED,
              'this\n', null, 1),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.MODIFIED,
              'lines\n', null, 2),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.MODIFIED,
              'are\n', null, 3),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.MODIFIED,
              'modified\n', null, 4)
        ]);
      });

      it('diffTool.ParserSinglePane.parseLineChanges returns two lines ' +
          'of code with inline modifications: first line contains highlighted' +
          'changed char and marked as line from original code, second line ' +
          'contains highlighted new char, which was inserted instead ' +
          'of changed and marked as line from modified code.', function() {
        var original = ['original\n'];
        var modified = ['originel\n'];
        var originalOffset = 0;
        var modifiedOffset = 0;
        var ranges = [
          {
            chars: 6,
            type: diffTool.Parser.ModificationType.UNCHANGED
          },
          {
            oldChars: 1,
            newChars: 1,
            type: diffTool.Parser.ModificationType.MODIFIED
          },
          {
            chars: 2,
            type: diffTool.Parser.ModificationType.UNCHANGED
          }
        ];

        var outputBuffer = [
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.ORIGINAL, [
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.UNCHANGED, 'origin'),
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.ORIGINAL, 'a'),
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.UNCHANGED, 'l\n')
          ], 1, null),
          Parser.getBufferLine_(diffTool.ParserSinglePane.LineType.MODIFIED, [
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.UNCHANGED, 'origin'),
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.MODIFIED, 'e'),
            Parser.getBufferModifiedLine_(
                diffTool.ParserSinglePane.LineType.UNCHANGED, 'l\n')
          ], null, 1)
        ];

        var parsedChanges = Parser.parseLineChanges(original, modified,
            originalOffset, modifiedOffset, ranges);

        expect(Parser.parseLineChanges(original, modified, originalOffset,
            modifiedOffset, ranges)).to.eql(outputBuffer);
      });
    });
  });
});
