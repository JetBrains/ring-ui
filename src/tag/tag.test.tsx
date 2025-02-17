import {render, screen} from '@testing-library/react';
import closeIcon from '@jetbrains/icons/close';

import Tag, {TagAttrs} from './tag';

describe('Tag', () => {
  const tagMock = {label: 'test1', rgTagIcon: closeIcon};

  const renderTag = (props?: TagAttrs) => render(<Tag key="1" {...tagMock} {...props} />);

  it('should render tags', () => {
    const {container} = renderTag();
    container.querySelector('button[data-test="ring-tag"]')?.should.exist;
  });

  it('should contain icon', () => {
    renderTag();
    screen.getByTestId('ring-icon').should.exist;
  });
});
