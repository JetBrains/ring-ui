import {render, screen} from '@testing-library/react';

import ProgressBar, {ProgressBarAttrs} from './progress-bar';
import styles from './progress-bar.css';

describe('Progress Bar', () => {
  const renderProgressBar = (props?: ProgressBarAttrs) => {
    render(<ProgressBar label="Progress" {...props} />);
  };

  it('should create component', () => {
    renderProgressBar();
    expect(screen.getByRole('progressbar')).to.exist;
  });

  describe('default value for attributes', () => {
    it('should set default value for max attribute', () => {
      renderProgressBar();
      expect(screen.getByRole('progressbar', {value: {max: 1.0}})).to.exist;
    });
  });

  describe('client interaction with progress bar API', () => {
    it('should set max value for progress bar', () => {
      const MAX = 100;

      renderProgressBar({
        max: MAX,
      });

      expect(screen.getByRole('progressbar', {value: {max: MAX}})).to.exist;
    });

    it('should set progress task value', () => {
      const MIDDLE = 0.5;

      renderProgressBar({
        value: MIDDLE,
      });

      expect(screen.getByRole('progressbar', {value: {now: MIDDLE}})).to.exist;
    });

    it('should set additional classes(modifiers) to the component', () => {
      renderProgressBar({
        className: 'test-class',
      });

      expect(screen.getByRole('progressbar').parentElement!).to.have.class('test-class');
    });

    it('should set global modifier', () => {
      renderProgressBar({
        global: true,
      });

      expect(screen.getByRole('progressbar').parentElement!).to.have.class(styles.globalMode);
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', () => {
    it('should set min value to equal zero', () => {
      renderProgressBar();
      expect(screen.getByRole('progressbar', {value: {min: 0}})).to.exist;
    });

    it('should update progress value in DOM', () => {
      renderProgressBar({
        value: 0.5,
      });

      const progressBar = screen.getByRole('progressbar', {value: {now: 0.5}});
      expect(progressBar).to.exist;
      expect(progressBar.style.width).to.equal('50%');
    });

    it('should set width equal 100% if progress value more than max value', () => {
      renderProgressBar({
        max: 1.0,
        value: 10,
      });

      expect(screen.getByRole('progressbar').style.width).to.equal('100%');
    });

    it('should not set style if value is not a number', () => {
      renderProgressBar({
        value: undefined,
      });
      expect(screen.getByRole('progressbar')).to.not.have.attr('style');
    });
  });
});
