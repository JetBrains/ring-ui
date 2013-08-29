/**
 * @fileoverview Tests for {diffTool.SingleEditorController}
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define([
  'global/global',
  'chai',
  'handlebars',
  'diff/diff',
  'diff/diff__tools',
  'diff/diff__editorcontroller_single'
], function(ring, chai, Handlebars) {
  'use strict';

  var expect = chai.expect;

  var diffTool = ring('diff').invoke('getDiffToolUtils');

  describe('diffTool.SingleEditorController basics', function() {
    it('diffTool.SingleEditorController is loads as ring module', function() {
      expect(diffTool.SingleEditorController).not.to.be.an('undefined');
    });

    var element = document.createElement('div');
    var controller = new diffTool.SingleEditorController(element);

    it('diffTool.SingleEditorController is child of ' +
        'diffTool.EditorController', function() {
      expect(controller).to.be.an.instanceof(diffTool.EditorController);
    });

    it('diffTool.SingleEditorController\'s parser is ' +
        'diffTool.ParserSinglePane', function() {
      expect(controller.codeParser_).to.equal(
          diffTool.ParserSinglePane.getInstance());
    });
  });

  describe('diffTool.SingleEditorController used templates', function() {
    it('diffTool.SingleEditorController.Template is list of valid ' +
        'IDs of real Handlebars templates', function() {
      var currentTemplate;

      for (var ID in diffTool.SingleEditorController.Template) {
        if (diffTool.SingleEditorController.Template.hasOwnProperty(ID)) {
          currentTemplate = diffTool.SingleEditorController.Template[ID];
          expect(currentTemplate).not.to.be.an('undefined');
        }
      }
    });
  });

  describe('diffTool.SingleEditorController enable/disable', function() {
    it('diffTool.SingleEditorController.setEnable(false) removes element\'s ' +
        'HTML.', function() {
      var element = document.createElement('div');
      var controller = new diffTool.SingleEditorController(element);
      controller.setEnabled(true);

      controller.setContent('original', 'modified', [{
        newLines: 1,
        oldLines: 1,
        type: 'modified'
      }]);

      expect(element.innerHTML).not.to.equal('');

      controller.setEnabled(false);

      expect(element.innerHTML).to.equal('');
    });
  });

  describe('diffTool.SingleEditorController setContent', function() {
    it('diffTool.SingleEditorController.setContentInternal creates ' +
        'valid markup for data returned by parser.', function() {
      var element = document.createElement('div');
      var controller = new diffTool.SingleEditorController(element);
      controller.setEnabled(true);

      controller.setContent('original\n', 'original\nmodified\n', [{
          lines: 1,
          type: 'unchanged'
        },
        {
          newLines: 1,
          oldLines: 0,
          type: 'modified'
        }
      ]);

      // NB! I am careful with checking element's innerHTML property, because
      // I can't control what Handlebars templates actually compiles, so
      // I check DOM by finding required elements by selectors and checking
      // numbers of found elements..

      it('diffTool.SingleEditorController.setContentInternal creates' +
          'wrap element and elements for gutter and code', function() {
        expect(element.querySelector('.diff_singlepane')).
            to.be.an.instanceof(Element);
        expect(element.querySelector('.diff__gutter')).
            to.be.an.instanceof(Element);
        expect(element.querySelector('.diff__code')).
            to.be.an.instanceof(Element);
      });

      it('diffTool.SingleEditorController.setContentInternal creates ' +
          'elements for each line of code and appends valid classes ' +
          'to them.', function() {
        expect(element.querySelectorAll('.diff__codeline').length).to.equal(3);
        expect(element.querySelectorAll('.diff__gutterline').length).
            to.equal(3);

        expect(element.querySelectorAll('.diff__codeline_modified')).
            to.equal(2);
        expect(element.querySelectorAll('.diff__gutterline_modified')).
            to.equal(2);
      });
    });
  });

  describe('diffTool.SingleEditorController additional methods', function() {
    var Parser = diffTool.ParserSinglePane.getInstance();

    describe('diffTool.SingleEditorController.getGutterData_ returns ' +
        'valid object for template, which renders line in gutter. ' +
        'This object contains name of additional class, and line ' +
        'numbers', function() {
      it('diffTool.SingleEditorController.getGutterData_ returns valid ' +
          'data for unchanged line', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.UNCHANGED, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getGutterData_(line);

        expect(lineData.additionalClassName).to.equal('');
        expect(lineData.originalLineNumber).to.equal(1);
        expect(lineData.modifiedLineNumber).to.equal(1);
      });

      it('diffTool.SingleEditorController.getGutterData_ returns valid ' +
          'data for deleted line', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.ORIGINAL, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getGutterData_(line);

        expect(lineData.additionalClassName).to.equal(
            'diff__gutterline_original');
        expect(lineData.originalLineNumber).to.equal(1);
        expect(lineData.modifiedLineNumber).to.equal(1);
      });

      it('diffTool.SingleEditorController.getGutterData_ returns valid ' +
          'data for added line', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.MODIFIED, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getGutterData_(line);

        expect(lineData.additionalClassName).to.equal(
            'diff__gutterline_modified');
        expect(lineData.originalLineNumber).to.equal(1);
        expect(lineData.modifiedLineNumber).to.equal(1);
      });

      it('diffTool.SingleEditorController.getGutterData_ returns valid ' +
          'data for folded line', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.FOLDED, 'asd', null, null);
        var lineData = diffTool.SingleEditorController.getGutterData_(line);

        expect(lineData.additionalClassName).to.equal(
            'diff__gutterline_folded');
        expect(lineData.originalLineNumber).to.equal(null);
        expect(lineData.modifiedLineNumber).to.equal(null);
      });
    });

    describe('diffTool.SingleEditorController.getCodeLineData_ returns ' +
        'valid data-object for line of code.', function() {
      it('diffTool.SingleEditorController.getCodeLineData_ returns valid ' +
          'data for unchanged strings', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.UNCHANGED, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getCodeLineData_(line);

        expect(lineData.line).to.equal('asd');
        expect(lineData.additionalClassName).to.equal('');
      });

      it('diffTool.SingleEditorController.getCodeLineData_ returns valid ' +
          'data for unchanged strings', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.ORIGINAL, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getCodeLineData_(line);

        expect(lineData.line).to.equal('asd');
        expect(lineData.additionalClassName).to.equal(
            'diff__codeline_original');
      });

      it('diffTool.SingleEditorController.getCodeLineData_ returns valid ' +
          'data for unchanged strings', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.MODIFIED, 'asd', 1, 1);
        var lineData = diffTool.SingleEditorController.getCodeLineData_(line);

        expect(lineData.line).to.equal('asd');
        expect(lineData.additionalClassName).to.equal(
            'diff__codeline_modified');
      });

      it('diffTool.SingleEditorController.getCodeLineData_ returns valid ' +
          'data for unchanged strings', function() {
        var line = Parser.getBufferLine_(
            diffTool.ParserSinglePane.LineType.FOLDED, '', null, null);
        var lineData = diffTool.SingleEditorController.getCodeLineData_(line);

        expect(lineData.line).to.equal('');
        expect(lineData.additionalClassName).to.equal(
            'diff__codeline_folded');
      });
    });

    describe('diffTool.SingleEditorController.getCodeLine_', function() {
      it('diffTool.SingleEditorController.getCodeLine_ returns plain string ' +
          'if there are no inline changes', function() {
        var line = 'asd';
        var parsedLine = diffTool.SingleEditorController.getCodeLine_(line);

        expect(parsedLine).to.equal('asd');
      });

      it('diffTool.SingleEditorController.getCodeLine_ returns marked up ' +
          'line if this line has inline changes', function() {
        var element = document.createElement('div');
        var line = [
          Parser.getBufferModifiedLine_(
              diffTool.ParserSinglePane.LineType.UNCHANGED, 'unchanged'),
          Parser.getBufferModifiedLine_(
              diffTool.ParserSinglePane.LineType.MODIFIED, ''),
          Parser.getBufferModifiedLine_(
              diffTool.ParserSinglePane.LineType.ORIGINAL, ''),
          Parser.getBufferModifiedLine_(
              diffTool.ParserSinglePane.LineType.UNCHANGED, 'asd')
        ];
        element.innerHTML = diffTool.SingleEditorController.getCodeLine_(line);

        expect(element.querySelectorAll('span').length).to.equal(4);
        expect(element.querySelectorAll('.diff__inline_unchanged').length).
            to.equal(2);
        expect(element.querySelectorAll('.diff__inline_original').length).
            to.equal(1);
        expect(element.querySelectorAll('.diff__inline_modified').length).
            to.equal(1);
        expect(element.querySelectorAll('.diff__inline_empty').length).
            to.equal(2);
      });
    });
  });
});
