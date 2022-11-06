import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import {Size} from '../input/input';

import EditableHeading, {EditableHeadingProps, Levels} from './editable-heading';

const lorem = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </div>
);

export default {
  title: 'Components/Editable Heading',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for editable rendering h1-h5 tags.'
  }
};

export const basic = () => {
  const ExampleEditableHeading = (props: EditableHeadingProps) => {
    const {children: initChildren, ...restProps} = props;
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [children, setChildren] = React.useState(initChildren);

    return (
      <EditableHeading
        isEditing={isEditing}
        isSavingPossible={children !== initChildren}
        placeholder="Enter the field name"
        onEdit={() => setIsEditing(!isEditing)}
        onChange={e => setChildren(e.target.value)}
        onSave={() => {
          setIsSaving(true);
          setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
          }, 1000);
        }}
        onCancel={() => {
          setChildren(initChildren);
          setIsEditing(false);
        }}
        className="example-editable-heading"
        autoFocus
        isSaving={isSaving}
        {...restProps}
      >{children}</EditableHeading>
    );
  };

  return (
    <div>
      <ExampleEditableHeading level={Levels.H1}>Editable Heading 1</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H2}>Editable Heading 2</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H3}>Editable Heading 3</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.S}>S size</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.M}>M size</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.L}>L size</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.FULL}>FULL size</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading error>Invalid Heading</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading disabled>Disabled Heading</ExampleEditableHeading>
      {lorem}
    </div>
  );
};

basic.storyName = 'Editable Heading';

basic.parameters = {
  storyStyles: `
<style>
  .example-editable-heading:not(:first-child) {
    margin-top: var(--ring-line-height);
  }
</style>`
};

