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

});
 