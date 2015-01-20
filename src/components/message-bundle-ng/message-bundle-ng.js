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
    this.avatareditor_add = function() {
      return 'Add Image';
    };
    this.errorpage_seriouslywrong = function() {
      return 'Oh-oh... Something went seriously wrong.';
    };
    this.errorpage_offline = function() {
      return 'There\'s nothing we can do: The server seems to be offline.';
    };
    this.errorpage_disconnected = function() {
      return 'Disconnected';
    };
    this.errorpage_disconnectedmsg = function() {
      return 'No, no one\'s there.';
    };
    this.errorpage_403 = function() {
      return 'Woah, you can\'t touch this!';
    };
    this.errorpage_403msg = function() {
      return 'Unfortunately, you are not allowed to access the page you\'ve requested. It seems you don\'t have sufficient permissions.';
    };
    this.errorpage_404 = function() {
      return 'Nope, can\'t find it!';
    };
    this.errorpage_404msg = function() {
      return 'Despite our best efforts, there\'s nothing here to show you with the URL you requested. Most likely the URL is invalid or you don\'t have permissions to access the page.';
    };
    this.errorpage_500 = function() {
      return 'Oh-oh... Something went seriously wrong';
    };
    this.errorpage_500msg = function() {
      return 'Despite our best efforts, the server is not working properly.';
    };
  }]);
