import PropTypes from 'prop-types';
import {ReactElement, ReactNode} from 'react';

export interface CustomItemProps {
  children?: ReactNode
}
export const CustomItem = ({children}: CustomItemProps) => children as ReactElement;
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};
