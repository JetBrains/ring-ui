import {render, screen} from '@testing-library/react';
import closeIcon from '@jetbrains/icons/close';

import Tag, {type TagAttrs} from './tag';

describe('Tag', () => {
  const tagMock = {label: 'test1', rgTagIcon: closeIcon};

  const renderTag = (props?: TagAttrs) => render(<Tag key='1' {...tagMock} {...props} />);

  it('should render tags', () => {
    const {container} = renderTag();
    expect(container.querySelector('button[data-test="ring-tag"]')).to.exist;
  });

  it('should contain icon', () => {
    renderTag();
    expect(screen.getByTestId('ring-icon')).to.exist;
  });
});
