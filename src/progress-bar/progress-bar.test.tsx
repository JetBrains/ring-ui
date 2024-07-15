import {shallow, mount} from 'enzyme';

import ProgressBar, {ProgressBarAttrs} from './progress-bar';
import styles from './progress-bar.css';

describe('Progress Bar', () => {
  const shallowProgressBar = (props?: ProgressBarAttrs) => shallow(
    <ProgressBar label="Progress" {...props}/>);
  const mountProgressBar = (props?: ProgressBarAttrs) =>
    mount(<ProgressBar label="Progress" {...props}/>).find<ProgressBar>(ProgressBar);

  it('should create component', () => {
    shallowProgressBar().should.exist;
  });

  describe('default value for attributes', () => {
    it('should set default value for max attribute', () => {
      mountProgressBar().should.have.prop('max', 1.0);
    });
  });

  describe('client interaction with progress bar API', () => {
    it('should set max value for progress bar', () => {
      const MAX = 100;

      const wrapper = mountProgressBar({
        max: MAX
      });

      wrapper.should.have.prop('max', MAX);
    });

    it('should set progress task value', () => {
      const MIDDLE = 0.5;

      const wrapper = mountProgressBar({
        value: MIDDLE
      });

      wrapper.should.have.prop('value', MIDDLE);
    });

    it('should set additional classes(modifiers) to the component', () => {
      const wrapper = mountProgressBar({
        className: 'test-class'
      });

      wrapper.instance().progressbarWrapper!.should.have.class('test-class');
    });

    it('should set global modifier', () => {
      const wrapper = mountProgressBar({
        global: true
      });

      wrapper.instance().progressbarWrapper!.
        should.have.class(styles.globalMode);
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', () => {
    it('should set min value to equal zero', () => {
      const wrapper = mountProgressBar();
      wrapper.instance().progressbar!.should.have.attr('aria-valuemin', '0');
    });

    it('should update max value in DOM', () => {
      const wrapper = mountProgressBar({
        max: 100
      });

      wrapper.instance().progressbar!.should.have.attr('aria-valuemax', '100');
    });

    it('should update progress value in DOM', () => {
      const wrapper = mountProgressBar({
        value: 0.5
      });

      wrapper.instance().progressbar!.should.have.attr('aria-valuenow', '0.5');
      wrapper.instance().progressbar!.should.have.attr('style').match(/width: 50%;/);
    });

    it('should set width equal 100% if progress value more than max value', () => {
      const wrapper = mountProgressBar({
        max: 1.0,
        value: 10
      });

      wrapper.instance().progressbar!.should.have.attr('style').match(/width: 100%;/);
    });

    it('should not set style if value is not a number', () => {
      const wrapper = mountProgressBar({
        value: undefined
      });
      wrapper.instance().progressbar!.should.not.have.attr('style');
    });
  });
});
