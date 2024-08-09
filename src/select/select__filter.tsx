import {Component, RefCallback} from 'react';
import classNames from 'classnames';

import Input, {InputAttrs} from '../input/input';
import sniffr from '../global/sniffer';
import {ActiveItemContext} from '../list/list';
import {I18nContext} from '../i18n/i18n-context';

import styles from './select-popup.css';

function noop() {}

type SelectFilterProps = InputAttrs & {
  inputRef: RefCallback<HTMLInputElement | HTMLTextAreaElement>
  listId?: string | undefined
}

export default class SelectFilter extends Component<SelectFilterProps> {
  static defaultProps = {
    inputRef: noop
  };

  componentWillUnmount() {
    this.blur();
  }

  focus() {
    const {input} = this;
    if (input && input !== document.activeElement) {
      if (sniffr.browser.name === 'firefox') {
        input.select();
      } else {
        input.focus();
      }
    }
  }

  blur() {
    if (this.input && this.input === document.activeElement) {
      this.input.blur();
    }
  }

  input?: HTMLInputElement | HTMLTextAreaElement | null;
  inputRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    this.input = el;
    this.props.inputRef(el);
  };

  render() {
    const {className, listId, ...restProps} = this.props;
    const classes = classNames(styles.filter, className);

    return (
      <ActiveItemContext.ValueContext.Consumer>
        {activeItemId => (
          <I18nContext.Consumer>
            {({translate}) => (
              <Input
                {...restProps}
                placeholder={restProps.placeholder ?? translate('filterItems')}
                aria-owns={listId}
                aria-activedescendant={activeItemId}
                autoComplete="off"
                autoFocus
                borderless
                inputRef={this.inputRef}
                className={classes}
              />
            )}
          </I18nContext.Consumer>
        )}
      </ActiveItemContext.ValueContext.Consumer>
    );
  }
}
