import React, {PureComponent} from 'react';

import sniffr from '../global/sniffer';

function noop() {}

/**
 * Workaround: IE11 loses symbols in onChange event
 * See RG-1361 and https://github.com/facebook/react/issues/7027
 */
const isIE11 = sniffr.browser.name === 'ie' && sniffr.browser.versionString === '11.0';

export default function ieCompatibleInputHOC(ComposedComponent) {
  return class IeCompatibleInput extends PureComponent {
    static propTypes = ComposedComponent.propTypes;

    render() {
      const {onChange, multiple, ...restProps} = this.props;

      const changeListenProps = (isIE11 && !multiple) ? {
        onInput: onChange,
        onChange: noop
      } : {
        onChange
      };

      return (
        <ComposedComponent
          multiple={multiple}
          {...changeListenProps}
          {...restProps}
        />
      );
    }
  };
}
