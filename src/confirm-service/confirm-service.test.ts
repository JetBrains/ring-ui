import {render, fireEvent} from '@testing-library/react';
import {type ReactElement} from 'react';

import islandStyles from '../island/island.css';
import confirm, {reactRoot} from './confirm-service';

describe('Confirm Service', () => {
  const getContainer = () => document.querySelector('[data-test~="ring-dialog"]');

  let unmount: () => void;
  beforeEach(() => {
    vi.spyOn(reactRoot, 'render').mockImplementation(element => {
      unmount = render(element as ReactElement).unmount;
    });
  });

  afterEach(() => {
    unmount();
  });

  it('should show confirm', () => {
    confirm({text: 'foo'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain(`.${islandStyles.title}`);
  });

  it('should show confirm text', () => {
    confirm({text: 'foo'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('foo');
  });

  it('should show confirm description', () => {
    confirm({text: 'foo', description: 'descr'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('descr');
  });

  it('should show confirm button text', () => {
    confirm({text: 'foo', confirmLabel: 'confirm text'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    confirm({text: 'foo', rejectLabel: 'reject text'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('reject text');
  });

  it('should resolve on confirm', async () => {
    const spy = vi.fn();
    const promise = confirm({text: 'foo'}).then(spy);
    const container = getContainer();
    const okButton = container?.querySelector('*[data-test="confirm-ok-button"]');
    expect(okButton).to.exist;
    okButton && fireEvent.click(okButton);

    await promise;
    expect(spy).toHaveBeenCalled();
  });

  it('should reject on reject', async () => {
    const spy = vi.fn();
    const promise = confirm({text: 'foo'}).catch(spy);
    const container = getContainer();
    const okButton = container?.querySelector('*[data-test="confirm-reject-button"]');
    expect(okButton).to.exist;
    okButton && fireEvent.click(okButton);

    await promise;
    expect(spy).toHaveBeenCalled();
  });
});
