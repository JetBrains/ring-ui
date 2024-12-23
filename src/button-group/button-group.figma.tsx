import figma from '@figma/code-connect';

import chevronDownIcon from '@jetbrains/icons/chevron-down';

import Button from '../button/button';

import {ControlsHeight} from '../global/controls-height';

import ButtonGroup from './button-group';

figma.connect(ButtonGroup, 'https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=9954%3A528', {
  props: {
    height: figma.enum('Size', {
      S: ControlsHeight.S,
      M: ControlsHeight.M,
      L: ControlsHeight.L,
    }),
    disabled: figma.enum('State', {Disabled: true}),
    primary: figma.enum('Variant', {Main: true}),
    success: figma.enum('Variant', {Green: true}),
    error: figma.enum('Variant', {'Red solid': true}),
    secondary: figma.enum('Variant', {Gray: true}),
    danger: figma.enum('Variant', {'Red outlined': true}),
    ghost: figma.enum('Variant', {Ghost: true}),
    inline: figma.enum('Variant', {Text: true}),
  },
  variant: {Type: 'Split'},
  example: props => (
    <ButtonGroup>
      <Button {...props}>{'Button'}</Button>
      <Button {...props} icon={chevronDownIcon} />
    </ButtonGroup>
  ),
  imports: [
    'import Button from "@jetbrains/ring-ui/components/button/button"',
    'import {ControlsHeight} from "@jetbrains/ring-ui/components/global/controls-height"',
    'import chevronDownIcon from "@jetbrains/icons/chevron-down"',
  ],
});
