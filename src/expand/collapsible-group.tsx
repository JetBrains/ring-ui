import {forwardRef} from 'react';
import deprecate from 'util-deprecate';

import CollapsibleGroup, {type CollapsibleGroupProps} from '../collapsible-group/collapsible-group';

const warnDeprecation = deprecate(
  () => {},
  '`CollapsibleGroup` from `@jetbrains/ring-ui/components/expand/collapsible-group` is deprecated and will be removed in Ring UI 8.0. Import it from `@jetbrains/ring-ui/components/collapsible-group/collapsible-group` instead.',
);

/**
 * @deprecated The `expand` module has been renamed to `collapsible-group`. This re-export will be removed in
 * Ring UI 8.0. Use `CollapsibleGroup` from `@jetbrains/ring-ui/components/collapsible-group/collapsible-group` instead.
 */
const DeprecatedCollapsibleGroup = forwardRef<HTMLDivElement, CollapsibleGroupProps>((props, ref) => {
  warnDeprecation();
  return <CollapsibleGroup ref={ref} {...props} />;
});

DeprecatedCollapsibleGroup.displayName = 'CollapsibleGroup';

export type {CollapsibleGroupProps};
export default DeprecatedCollapsibleGroup;
