import $ from 'jquery';
import TestUtils from 'react-addons-test-utils';
import Icon from './icon';
import expandIcon from 'jetbrains-icons/expand.svg';

describe('Icon', function () {
  beforeEach(function () {
    this.icon = TestUtils.renderIntoDocument(Icon.factory({
      glyph: expandIcon
    }));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.icon, Icon).should.equal(true);
  });

  it('should render passed glyph', function () {
    $(this.icon.node).find('use').attr('xlink:href').should.contain(expandIcon);
  });

  it('should set size 16', function () {
    this.icon.rerender({size: Icon.Size.Size16});

    $(this.icon.node).find('svg').attr('style').should.contain('width: 16px');
    $(this.icon.node).find('svg').attr('style').should.contain('height: 16px');
  });

  it('should set one custom dimension', function () {
    this.icon.rerender({width: 100});

    $(this.icon.node).find('svg').attr('style').should.contain('width: 100px');
    $(this.icon.node).find('svg').attr('style').should.not.contain('height:');
  });

  it('should set two custom dimensions', function () {
    this.icon.rerender({width: 99, height: 66});

    $(this.icon.node).find('svg').attr('style').should.contain('width: 99px');
    $(this.icon.node).find('svg').attr('style').should.contain('height: 66px');
  });

  it('should set custom class', function () {
    const CUSTOM_CSS_CLASS = 'my-icon';

    this.icon.rerender({className: CUSTOM_CSS_CLASS});
    $(this.icon.node).attr('class').should.contain(CUSTOM_CSS_CLASS);
  });
});
