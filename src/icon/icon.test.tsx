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
    expect(renderIcon()!).to.exist;
  });

  it('should render passed glyph', () => {
    const icon = renderIcon({glyph: expandIcon})!;
    expect(expandIcon.replace('/>', '></path>')).to.include(
      icon.querySelector('svg')!.outerHTML.replace(' class="glyph"', ''),
    );
  });

  it('should set compatibility mode if rendering icon without width/height', () => {
    const icon = renderIcon({
      glyph: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d=""/></svg>',
    })!;
    expect(icon.querySelector('svg')!).to.have.class(styles.compatibilityMode);
  });

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = renderIcon({glyph: expandIcon, className: CUSTOM_CSS_CLASS})!;

    expect(icon).to.have.class(CUSTOM_CSS_CLASS);
  });

  describe('fault tolerance', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error');
    });

    it('should render nothing if null is passed as glyph', () => {
      const icon = renderIcon({glyph: null});
      expect(icon).to.not.exist;
    });

    it('should render nothing if empty string is passed as glyph', () => {
      const icon = renderIcon({glyph: ''});
      expect(icon).to.not.exist;
    });
  });
});
