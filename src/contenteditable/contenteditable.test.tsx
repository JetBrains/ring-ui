import {render, screen} from '@testing-library/react';

import ContentEditable from './contenteditable';

describe('ContentEditable', () => {
  const stub = sandbox.stub();

  afterEach(() => stub.reset());

  it('should create component', () => {
    render(<ContentEditable />);
    expect(screen.getByRole('textbox')).to.exist;
  });

  it('should pass other properties', () => {
    render(<ContentEditable className="test" />);
    expect(screen.getByRole('textbox')).to.have.class('test');
  });

  it('should dangerously set html', () => {
    render(
      <ContentEditable>
        <b>{'bold'}</b>
      </ContentEditable>,
    );
    expect(screen.getByText('bold')).to.have.tagName('b');
  });

  it('should render only on html / disabled change', () => {
    const {rerender} = render(<ContentEditable onComponentUpdate={stub} />);
    rerender(<ContentEditable onComponentUpdate={stub} disabled />);
    rerender(
      <ContentEditable onComponentUpdate={stub}>
        <span />
      </ContentEditable>,
    );

    expect(stub).to.have.been.calledTwice;
  });

  it('should not render on other props change', () => {
    const {rerender} = render(<ContentEditable onComponentUpdate={stub} />);
    rerender(<ContentEditable onComponentUpdate={stub} className="testtest" />);

    expect(stub).to.not.have.been.called;
  });

  it('should set tabindex equal zero by default', () => {
    render(<ContentEditable />);
    expect(screen.getByRole('textbox')).to.have.attr('tabindex', '0');
  });

  it('should allow pass custom tabindex', () => {
    render(<ContentEditable tabIndex={-1} />);
    expect(screen.getByRole('textbox')).to.have.attr('tabindex', '-1');
  });
});
