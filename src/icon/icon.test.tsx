import {render, screen} from '@testing-library/react';
import defaultIcon from '@jetbrains/icons/umbrella';
import expandIcon from '@jetbrains/icons/expand';

import Icon, {IconAttrs} from './icon';
import styles from './icon.css';

describe('Icon', () => {
  const renderIcon = (props?: IconAttrs) => {
    render(<Icon glyph={defaultIcon} {...props} />);
    return screen.queryByTestId('ring-icon');
  };

  it('should create component', () => {
    renderIcon()!.should.exist;
  });

  it('should render passed glyph', () => {
    const icon = renderIcon({glyph: expandIcon})!;
    expandIcon
      .replace('/>', '></path>')
      .should.include(icon.querySelector('svg')!.outerHTML.replace(' class="glyph"', ''));
  });

  it('should set compatibility mode if rendering icon without width/height', () => {
    const icon = renderIcon({
      glyph: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d=""/></svg>',
    })!;
    icon.querySelector('svg')!.should.have.class(styles.compatibilityMode);
  });

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = renderIcon({glyph: expandIcon, className: CUSTOM_CSS_CLASS})!;

    icon.should.have.class(CUSTOM_CSS_CLASS);
  });

  describe('fault tolerance', () => {
    beforeEach(() => {
      sandbox.stub(console, 'error');
    });

    it('should render nothing if null is passed as glyph', () => {
      const icon = renderIcon({glyph: null});
      should.not.exist(icon);
    });

    it('should render nothing if empty string is passed as glyph', () => {
      const icon = renderIcon({glyph: ''});
      should.not.exist(icon);
    });
  });
});
