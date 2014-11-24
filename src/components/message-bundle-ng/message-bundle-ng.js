/* global angular: false */
/**
 * This service is used by directive to correctly show messages.
 * You can decorate this service to provide your own localized messages.
 */
angular.module('Ring.message-bundle', []).
  service('RingMessageBundle', [function () {
    this.form_required = function () {
      return 'Value is required';
    };
    this.form_url = function () {
      return 'Should be a valid URL';
    };
    this.form_email = function () {
      return 'Should be a valid email';
    };
    this.form_maxlength = function () {
      return 'Is too long';
    };
    this.form_minlength = function () {
      return 'Is too short';
    };
    this.form_pattern = function () {
      return 'Doesn\'t match the pattern';
    };
    this.form_equalvalue = function () {
      return 'Is not the same';
    };
    this.form_unique = function () {
      return 'Is not unique';
    };
    this.avatareditor_nosupport = function() {
      return 'Sorry, your browser doesn\'t support File API';
    };
    this.avatareditor_noselected = function() {
      return 'No image file was selected';
    };
    this.avatareditor_delete = function() {
      return 'Delete Image';
    };
  }]);
