/* global inject */
import angular from 'angular';

import 'angular-mocks';
import TitleNg from './title-ng';


describe('pageTitle', () => {
  beforeEach(window.module(TitleNg));
  beforeEach(window.module($provide => {
    $provide.value('$document', angular.element({title: ''}));
  }));


  let pageTitle;
  let $document;
  beforeEach(inject((_pageTitle_, _$document_) => {
    pageTitle = _pageTitle_;
    $document = _$document_;
  }));


  it('should export service', () => {
    pageTitle.should.exist;
  });


  it('should set page title', () => {
    pageTitle.addElement('foo');

    $document[0].title.should.equal('foo');
  });


  it('should interpolate string', () => {
    pageTitle.addElement('{{"foo" | uppercase}}');

    $document[0].title.should.equal('FOO');
  });


  it('should allow set just text without interpolation', () => {
    pageTitle.setText('{{A > B}}');

    $document[0].title.should.equal('{{A > B}}');
  });
});
