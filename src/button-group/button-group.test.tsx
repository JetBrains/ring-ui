import {render, screen} from '@testing-library/react';

import Button from '../button/button';
import ButtonGroup from './button-group';

import styles from './button-group.css';

function getGroup() {
  return screen.getByTestId('ring-button-group');
}

describe('Button Group', () => {
  it('should create component', () => {
    render(<ButtonGroup />);
    expect(getGroup()).to.exist;
  });

  it('should not apply disabled class when no children', () => {
    render(<ButtonGroup />);
    expect(getGroup().className).not.to.include(styles.disabled);
  });

  it('should apply disabled class for a single disabled child', () => {
    render(
      <ButtonGroup>
        <Button disabled>{'A'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should not apply disabled class for a single non-disabled child', () => {
    render(
      <ButtonGroup>
        <Button>{'A'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).not.to.include(styles.disabled);
  });

  it('should apply disabled class for a single nested disabled child', () => {
    render(
      <ButtonGroup>
        <span>
          <Button disabled>{'A'}</Button>
        </span>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should apply disabled class when all direct children are disabled', () => {
    render(
      <ButtonGroup>
        <Button disabled>{'A'}</Button>
        <Button disabled>{'B'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should not apply disabled class when some direct children are not disabled', () => {
    render(
      <ButtonGroup>
        <Button disabled>{'A'}</Button>
        <Button>{'B'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).not.to.include(styles.disabled);
  });

  it('should apply disabled class when all nested children are disabled', () => {
    render(
      <ButtonGroup>
        <span>
          <Button disabled>{'A'}</Button>
        </span>
        <span>
          <Button disabled>{'B'}</Button>
        </span>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should apply disabled class with a mix of nested and direct disabled children', () => {
    render(
      <ButtonGroup>
        <span>
          <Button disabled>{'A'}</Button>
        </span>
        <Button disabled>{'B'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should apply disabled class when conditional children are falsy and remaining are disabled', () => {
    const condition = false;
    render(
      <ButtonGroup>
        {condition && <Button>{'A'}</Button>}
        <Button disabled>{'B'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).to.include(styles.disabled);
  });

  it('should not apply disabled class when a nested child is not disabled', () => {
    render(
      <ButtonGroup>
        <span>
          <Button>{'A'}</Button>
        </span>
        <Button disabled>{'B'}</Button>
      </ButtonGroup>,
    );
    expect(getGroup().className).not.to.include(styles.disabled);
  });
});
