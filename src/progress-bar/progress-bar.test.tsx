import {render, screen} from '@testing-library/react';

import ProgressBar, {ProgressBarAttrs} from './progress-bar';
import styles from './progress-bar.css';

describe('Progress Bar', () => {
  const renderProgressBar = (props?: ProgressBarAttrs) => {
    render(<ProgressBar label="Progress" {...props} />);
  };

  it('should create component', () => {
    renderProgressBar();
    screen.getByRole('progressbar').should.exist;
  });

  describe('default value for attributes', () => {
    it('should set default value for max attribute', () => {
      renderProgressBar();
      screen.getByRole('progressbar', {value: {max: 1.0}}).should.exist;
    });
  });

  describe('client interaction with progress bar API', () => {
    it('should set max value for progress bar', () => {
      const MAX = 100;

      renderProgressBar({
        max: MAX,
      });

      screen.getByRole('progressbar', {value: {max: MAX}}).should.exist;
    });

    it('should set progress task value', () => {
      const MIDDLE = 0.5;

      renderProgressBar({
        value: MIDDLE,
      });

      screen.getByRole('progressbar', {value: {now: MIDDLE}}).should.exist;
    });

    it('should set additional classes(modifiers) to the component', () => {
      renderProgressBar({
        className: 'test-class',
      });

      screen.getByRole('progressbar').parentElement!.should.have.class('test-class');
    });

    it('should set global modifier', () => {
      renderProgressBar({
        global: true,
      });

      screen.getByRole('progressbar').parentElement!.should.have.class(styles.globalMode);
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', () => {
    it('should set min value to equal zero', () => {
      renderProgressBar();
      screen.getByRole('progressbar', {value: {min: 0}}).should.exist;
    });

    it('should update progress value in DOM', () => {
      renderProgressBar({
        value: 0.5,
      });

      const progressBar = screen.getByRole('progressbar', {value: {now: 0.5}});
      progressBar.should.exist;
      progressBar.style.width.should.equal('50%');
    });

    it('should set width equal 100% if progress value more than max value', () => {
      renderProgressBar({
        max: 1.0,
        value: 10,
      });

      screen.getByRole('progressbar').style.width.should.equal('100%');
    });

    it('should not set style if value is not a number', () => {
      renderProgressBar({
        value: undefined,
      });
      screen.getByRole('progressbar').should.not.have.attr('style');
    });
  });
});
