import figma from '@figma/code-connect';

import addIcon from '@jetbrains/icons/add';
import add12pxIcon from '@jetbrains/icons/add-12px';
import downloadIcon from '@jetbrains/icons/download';
import download12pxIcon from '@jetbrains/icons/download-12px';

import {ControlsHeight} from '../global/controls-height';

import Button from './button';

figma.connect(Button, 'https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=9954%3A528', {
  props: {
    height: figma.enum('Size', {
      S: ControlsHeight.S,
      M: ControlsHeight.M,
      L: ControlsHeight.L,
    }),
    children: figma.enum('Type', {
      Label: 'Button',
      'L-Icon-Label': 'Button',
      'R-Icon-Label': 'Button',
    }),
    icon: figma.enum('Type', {
      'L-Icon-Label': figma.enum('Size', {
        S: figma.enum('Variant', {
          Main: download12pxIcon,
          Green: download12pxIcon,
          'Red solid': download12pxIcon,
          Gray: download12pxIcon,
          Outlined: download12pxIcon,
          'Red outlined': download12pxIcon,
          Ghost: download12pxIcon,
          Text: downloadIcon,
        }),
        M: downloadIcon,
        L: downloadIcon,
      }),
      Icon: figma.enum('Size', {
        S: figma.enum('Variant', {
          Main: add12pxIcon,
          Green: add12pxIcon,
          'Red solid': add12pxIcon,
          Gray: add12pxIcon,
          Outlined: add12pxIcon,
          'Red outlined': add12pxIcon,
          Ghost: add12pxIcon,
          Text: addIcon,
        }),
        M: addIcon,
        L: addIcon,
      }),
    }),
    dropdown: figma.enum('Type', {'R-Icon-Label': true}),
    disabled: figma.enum('State', {Disabled: true}),
    primary: figma.enum('Variant', {Main: true}),
    success: figma.enum('Variant', {Green: true}),
    error: figma.enum('Variant', {'Red solid': true}),
    secondary: figma.enum('Variant', {Gray: true}),
    danger: figma.enum('Variant', {'Red outlined': true}),
    ghost: figma.enum('Variant', {Ghost: true}),
    inline: figma.enum('Variant', {Text: true}),
  },
  example: ({children, ...restProps}) => <Button {...restProps}>{children}</Button>,
  imports: [
    'import Button from "@jetbrains/ring-ui/components/button/button"',
    'import {ControlsHeight} from "@jetbrains/ring-ui/components/global/controls-height"',
    'import addIcon from "@jetbrains/icons/add"',
    'import add12pxIcon from "@jetbrains/icons/add-12px"',
    'import downloadIcon from "@jetbrains/icons/download"',
    'import download12pxIcon from "@jetbrains/icons/download-12px"',
  ],
});
