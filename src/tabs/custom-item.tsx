import PropTypes from 'prop-types';
import {ReactElement} from 'react';

import {TabProps} from './tab';

export const CustomItem = ({children}: TabProps) => children as ReactElement;
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};
