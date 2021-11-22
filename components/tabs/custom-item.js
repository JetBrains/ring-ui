import PropTypes from 'prop-types';

export const CustomItem = ({children}) => children;
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};
