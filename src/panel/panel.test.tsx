import {shallow, mount, render} from 'enzyme';

import Panel from './panel';

describe('Panel', () => {
  it('should create component', () => {
    mount(<Panel />).should.have.type(Panel);
  });

  it('should use provided className', () => {
    const wrapper = shallow(<Panel className="custom-class" />);
    wrapper.should.have.className('custom-class');
  });

  it('should render children', () => {
    const wrapper = render(<Panel>{'text'}</Panel>);
    wrapper.should.have.text('text');
  });
});
