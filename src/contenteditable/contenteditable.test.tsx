import {render, screen} from '@testing-library/react';

import ContentEditable from './contenteditable';

describe('ContentEditable', () => {
  const stub = sandbox.stub();

  afterEach(() => stub.reset());

  it('should create component', () => {
    render(<ContentEditable />);
    screen.getByRole('textbox').should.exist;
  });

  it('should pass other properties', () => {
    render(<ContentEditable className="test" />);
    screen.getByRole('textbox').should.have.class('test');
  });

  it('should dangerously set html', () => {
    render(
      <ContentEditable>
        <b>{'bold'}</b>
      </ContentEditable>,
    );
    screen.getByText('bold').should.have.tagName('b');
  });

  it('should render only on html / disabled change', () => {
    const {rerender} = render(<ContentEditable onComponentUpdate={stub} />);
    rerender(<ContentEditable onComponentUpdate={stub} disabled />);
    rerender(
      <ContentEditable onComponentUpdate={stub}>
        <span />
      </ContentEditable>,
    );

    stub.should.have.been.calledTwice;
  });

  it('should not render on other props change', () => {
    const {rerender} = render(<ContentEditable onComponentUpdate={stub} />);
    rerender(<ContentEditable onComponentUpdate={stub} className="testtest" />);

    stub.should.not.have.been.called;
  });

  it('should set tabindex equal zero by default', () => {
    render(<ContentEditable />);
    screen.getByRole('textbox').should.have.attr('tabindex', '0');
  });

  it('should allow pass custom tabindex', () => {
    render(<ContentEditable tabIndex={-1} />);
    screen.getByRole('textbox').should.have.attr('tabindex', '-1');
  });
});
