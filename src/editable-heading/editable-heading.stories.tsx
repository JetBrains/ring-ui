import {useState, useCallback} from 'react';
import pencilIcon from '@jetbrains/icons/pencil';
import moreOptionsIcon from '@jetbrains/icons/more-options';

import {Size} from '../input/input';
import Button from '../button/button';
import EditableHeading, {type EditableHeadingProps, Levels} from './editable-heading';

const lorem = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </div>
);

export default {
  title: 'Components/Editable Heading',

  parameters: {
    notes: 'A component for editable rendering h1-h5 tags.',
  },
};

export const basic = () => {
  const ExampleEditableHeading = (props: EditableHeadingProps) => {
    const {children: initChildren, ...restProps} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [children, setChildren] = useState(initChildren);

    const onSave = useCallback(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
      }, 1000);
    }, []);

    const onCancel = useCallback(() => {
      setChildren(initChildren);
      setIsEditing(false);
    }, [initChildren]);

    return (
      <EditableHeading
        isEditing={isEditing}
        isSavingPossible={children !== initChildren}
        placeholder='Enter the field name'
        onEdit={() => setIsEditing(!isEditing)}
        onChange={e => setChildren(e.target.value)}
        onSave={onSave}
        onCancel={onCancel}
        className='example-editable-heading'
        isSaving={isSaving}
        {...restProps}
      >
        {children}
      </EditableHeading>
    );
  };

  const renderMenu = () => (
    <>
      <Button icon={pencilIcon} className='example-editable-heading__menu-button' title='Edit' />
      <Button icon={moreOptionsIcon} className='example-editable-heading__menu-button' title='More Options' />
    </>
  );

  return (
    <div>
      <ExampleEditableHeading level={Levels.H1}>Editable Heading 1</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H2}>Editable Heading 2</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H3}>Editable Heading 3</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.S}>
        S size
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.M}>
        M size
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.L}>
        L size
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading level={Levels.H1} size={Size.FULL}>
        FULL size
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading renderMenu={renderMenu}>Heading with menu</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading size={Size.FULL} renderMenu={renderMenu}>
        Full size heading with menu
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading size={Size.M}>Too long long long long long long long heading</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading multiline maxInputRows={5}>
        Multiline Heading. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio tellus. Suspendisse
        ut elit orci. Pellentesque sagittis pharetra lacus, id vehicula mauris. Donec lacinia tincidunt risus, et
        sollicitudin risus dignissim sit amet. Duis eu lectus ac odio pharetra egestas in eget ipsum. Curabitur luctus
        lacinia molestie. Nullam id metus tortor.
      </ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading error=''>Invalid Heading</ExampleEditableHeading>
      {lorem}

      <ExampleEditableHeading error='Some error message'>Invalid Heading with an error message</ExampleEditableHeading>
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

  .example-editable-heading__menu-button {
    padding: 0;
    margin-left: var(--ring-unit);
  }
</style>`,
};
