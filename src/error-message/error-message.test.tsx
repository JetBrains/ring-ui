import {shallow, mount} from 'enzyme';

import ErrorMessage, {ErrorMessageProps} from './error-message';

describe('Error Message', () => {
  const shallowErrorMessage = (props?: ErrorMessageProps) => shallow(<ErrorMessage {...props}/>);
  const mountErrorMessage = (props?: ErrorMessageProps) => mount(<ErrorMessage {...props}/>);

  it('should create component', () => {
    mountErrorMessage().should.have.type(ErrorMessage);
  });

  it('should wrap children with div', () => {
    shallowErrorMessage().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowErrorMessage({className: 'test-class'}).should.have.className('test-class');
  });
});
