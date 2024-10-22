import {PureComponent} from 'react';

import dataTests from '../global/data-tests';

import Tabs, {TabsAttrs, Children} from './dumb-tabs';

export interface SmartTabsProps extends TabsAttrs {
  children: Children;
  initSelected?: string | null | undefined;
}
export default class SmartTabs extends PureComponent<SmartTabsProps> {
  constructor(props: SmartTabsProps) {
    super(props);

    this.state = {
      selected:
        this.props.initSelected || (Array.isArray(this.props.children) && this.props.children[0].props.id) || '0',
    };
  }

  state: {
    selected: string;
  };

  handleSelect = (selected: string) => this.setState({selected});

  render() {
    const {children, initSelected, 'data-test': dataTest, ...restProps} = this.props;
    return (
      <Tabs
        data-test={dataTests('ring-smart-tabs', dataTest)}
        selected={this.state.selected}
        onSelect={this.handleSelect}
        {...restProps}
      >
        {children}
      </Tabs>
    );
  }
}
