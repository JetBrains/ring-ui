/* eslint-disable google-camelcase/google-camelcase */
/* global angular: false */
/**
 * This service is used by directive to correctly show messages.
 * You can decorate this service to provide your own localized messages.
 */
angular.module('Ring.message-bundle', [])
/**
 * Empty i18n function. If project supports localization, it should decorate i18n
 * with translating function
 */
  .factory('ringI18n', function() {
    return function(str) {
      return str;
    };
  })
  .service('RingMessageBundle', [
    'ringI18n',
    function(ringI18n) {
      var i18n = ringI18n;
      this.form_required = function() {
        return i18n('Value is required');
      };
      this.form_invalid = function() {
        return i18n('Value is invalid');
      };
      this.form_url = function() {
        return i18n('Should be a valid URL');
      };
      this.form_email = function() {
        return i18n('Should be a valid email');
      };
      this.form_number = function() {
        return i18n('Should be a number');
      };
      this.form_maxlength = function() {
        return i18n('Is too long');
      };
      this.form_minlength = function() {
        return i18n('Is too short');
      };
      this.form_pattern = function() {
        return i18n('Doesn\'t match the pattern');
      };
      this.form_equalvalue = function() {
        return i18n('Is not the same');
      };
      this.form_unique = function() {
        return i18n('Is not unique');
      };
      this.form_max = function() {
        return i18n('Is out of range');
      };
      this.form_min = function() {
        return i18n('Is out of range');
      };
      this.form_save = function() {
        return i18n('Save');
      };
      this.form_saved = function() {
        return i18n('Saved');
      };
      this.avatareditor_nosupport = function() {
        return i18n('Sorry, your browser doesn\'t support File API');
      };
      this.avatareditor_noselected = function() {
        return i18n('No image file was selected');
      };
      this.avatareditor_delete = function() {
        return i18n('Delete Image');
      };
      this.avatareditor_add = function() {
        return i18n('Add Image');
      };
      this.errorpage_seriouslywrong = function() {
        return i18n('Oh-oh... Something went seriously wrong.');
      };
      this.errorpage_offline = function() {
        return i18n('There\'s nothing we can do: The server seems to be offline.');
      };
      this.errorpage_disconnected = function() {
        return i18n('Disconnected');
      };
      this.errorpage_disconnectedmsg = function() {
        return i18n('No, no one\'s there.');
      };
      this.errorpage_403 = function() {
        return i18n('Woah, you can\'t touch this!');
      };
      this.errorpage_403msg = function() {
        return i18n('Unfortunately, you are not allowed to access the page you\'ve requested. It seems you don\'t have sufficient permissions.');
      };
      this.errorpage_404 = function() {
        return i18n('Nope, can\'t find it!');
      };
      this.errorpage_404msg = function() {
        return i18n('Despite our best efforts, there\'s nothing here to show you with the URL you requested. Most likely the URL is invalid or you don\'t have permissions to access the page.');
      };
      this.errorpage_500 = function() {
        return i18n('Oh-oh... Something went seriously wrong');
      };
      this.errorpage_500msg = function() {
        return i18n('Despite our best efforts, the server is not working properly.');
      };
      this.select_options_not_found = function () {
        return i18n('No options found');
      };
      this.select_loading = function () {
        return i18n('Loading...');
      };
      this.select_label = function () {
        return i18n('Please select option');
      };
      this.previous_page = function () {
        return i18n('previous');
      };
      this.next_page = function () {
        return i18n('next page');
      };
      this.first_page = function () {
        return i18n('First page');
      };
      this.last_page = function () {
        return i18n('Last page');
      };
      this.items_per_page = function () {
        return i18n('per page');
      };
    }
  ]);
