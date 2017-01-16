/* global angular: false */
/**
 * This service is used by directive to correctly show messages.
 * You can decorate this service to provide your own localized messages.
 */
const angularModule = angular.module('Ring.message-bundle', []);

/**
 * Empty i18n function. If project supports localization, it should decorate i18n
 * with translating function
 */
function emptyI18n() {
  return str => str;
}

function RingMessageBundle(ringI18n) {
  const i18n = ringI18n;

/* eslint-disable camelcase */
  this.form_required = () => i18n('Value is required');
  this.form_invalid = () => i18n('Value is invalid');
  this.form_url = () => i18n('Should be a valid URL');
  this.form_email = () => i18n('Should be a valid email');
  this.form_number = () => i18n('Should be a number');
  this.form_maxlength = () => i18n('Is too long');
  this.form_minlength = () => i18n('Is too short');
  this.form_pattern = () => i18n('Doesn\'t match the pattern');
  this.form_equalvalue = () => i18n('Is not the same');
  this.form_unique = () => i18n('Is not unique');
  this.form_max = () => i18n('Is out of range');
  this.form_min = () => i18n('Is out of range');
  this.form_save = () => i18n('Save');
  this.form_saved = () => i18n('Saved');
  this.form_cancel = () => i18n('Cancel');
  this.avatareditor_nosupport = () => i18n('Sorry, your browser doesn\'t support File API');
  this.avatareditor_noselected = () => i18n('No image file was selected');
  this.avatareditor_delete = () => i18n('Delete Image');
  this.avatareditor_add = () => i18n('Add Image');
  this.errorpage_seriouslywrong = () => i18n('Oh-oh... Something went seriously wrong.');
  this.errorpage_offline = () => i18n('There\'s nothing we can do: The server seems to be offline.');
  this.errorpage_disconnected = () => i18n('Disconnected');
  this.errorpage_disconnectedmsg = () => i18n('No, no one\'s there.');
  this.errorpage_403 = () => i18n('Woah, you can\'t touch this!');
  this.errorpage_403msg = () => i18n('Unfortunately, you are not allowed to access the page you\'ve requested. It seems you don\'t have sufficient permissions.');
  this.errorpage_404 = () => i18n('Nope, can\'t find it!');
  this.errorpage_404msg = () => i18n('Despite our best efforts, there\'s nothing here to show you with the URL you requested. Most likely the URL is invalid or you don\'t have permissions to access the page.');
  this.errorpage_500 = () => i18n('Oh-oh... Something went seriously wrong');
  this.errorpage_500msg = () => i18n('Despite our best efforts, the server is not working properly.');
  this.select_options_not_found = () => i18n('No options found');
  this.select_loading = () => i18n('Loading...');
  this.select_label = () => i18n('Please select option');
  this.previous_page = () => i18n('previous');
  this.next_page = () => i18n('next page');
  this.first_page = () => i18n('First page');
  this.last_page = () => i18n('Last page');
  this.items_per_page = () => i18n('per page');
/* eslint-enable camelcase */
}

angularModule.factory('ringI18n', emptyI18n);
angularModule.service('RingMessageBundle', RingMessageBundle);

export default angularModule.name;
