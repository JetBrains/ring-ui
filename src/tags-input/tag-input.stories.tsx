import checkmarkIcon from '@jetbrains/icons/checkmark';
import exceptionIcon from '@jetbrains/icons/exception';
import frownIcon from '@jetbrains/icons/frown';

import Button from '../button/button';
import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import {ControlsHeight} from '../global/controls-height';
import {Size} from '../input/input';

import TagsInput from './tags-input';

export default {
  title: 'Components/Tags Input',

  parameters: {
    notes: 'Displays a tags input field.',
  },
};

export const basic = () => {
  function dataSource() {
    return new Promise(resolve => setTimeout(resolve, 200)).then(() =>
      Promise.resolve([...Array(20)].map((it, index) => ({key: `test${index}`, label: `test${index}`}))),
    );
  }

  return (
    <form className="tagsInputs">
      <TagsInput
        tags={[
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'},
        ]}
        maxPopupHeight={250}
        dataSource={dataSource}
        allowAddNewTags
        filter
        label="M Size"
      />

      <TagsInput
        tags={[
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'},
        ]}
        maxPopupHeight={250}
        dataSource={dataSource}
        allowAddNewTags
        placeholder="This is a very very very long placeholder"
        filter
        size={Size.L}
        label="L Size"
      />

      <TagsInput
        tags={[
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'},
        ]}
        maxPopupHeight={250}
        dataSource={dataSource}
        allowAddNewTags
        filter
        size={Size.FULL}
        label="Full Size"
      />

      <TagsInput
        tags={[
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'},
        ]}
        maxPopupHeight={250}
        dataSource={dataSource}
        allowAddNewTags
        filter
        size={Size.FULL}
        height={ControlsHeight.S}
        label="S Height"
      />
    </form>
  );
};

basic.storyName = 'basic';

basic.parameters = {
  storyStyles: `
<style>
  .tagsInputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>`,
};

export const withIcons = () => {
  const tags = [
    {key: 'test1', label: 'test1', rgTagIcon: checkmarkIcon},
    {key: 'test2', label: 'test2'},
  ];

  function dataSource() {
    return [
      {key: 'test3', label: 'test3', rgTagIcon: exceptionIcon, rgTagTitle: 'I am the tag title'},
      {key: 'test4', label: 'test4', rgTagIcon: frownIcon},
    ];
  }

  return <TagsInput tags={tags} dataSource={dataSource} />;
};

withIcons.storyName = 'with icons';

export const disabled = () => <TagsInput disabled tags={[{key: 'test2', label: 'test2'}]} dataSource={() => []} />;

disabled.storyName = 'disabled';

export const withTooLongTagLabels = () => {
  const tags = [
    {key: 'test1', label: 'Label'},
    {key: 'test2', label: 'Very long label'},
  ];

  function dataSource() {
    return [
      {key: 'test3', label: 'Very very long label'},
      {key: 'test4', label: 'Very very very long label'},
    ];
  }

  return <TagsInput tags={tags} dataSource={dataSource} />;
};

withTooLongTagLabels.storyName = 'with too long tag labels';

export const autoOpen = () => {
  const tags = [
    {key: 'test1', label: 'test1'},
    {key: 'test2', label: 'test2'},
  ];

  function dataSource() {
    return [
      {key: 'test3', label: 'test3'},
      {key: 'test4', label: 'test4'},
    ];
  }

  return <TagsInput tags={tags} dataSource={dataSource} autoOpen />;
};

autoOpen.parameters = {
  screenshots: {
    captureSelector: ['#storybook-root', '[data-test~=ring-popup]'],
  },
  a11y: {element: '#storybook-root,[data-test~=ring-popup]'},
};

export const autoOpenInADialog = () => {
  const tags = [
    {key: 'test1', label: 'test1'},
    {key: 'test2', label: 'test2'},
  ];

  function dataSource() {
    return [
      {key: 'test3', label: 'test3'},
      {key: 'test4', label: 'test4'},
    ];
  }

  return (
    <>
      <Button>Button</Button>
      <Dialog label="Tags" show trapFocus autoFocusFirst={false}>
        <Content>
          <TagsInput tags={tags} dataSource={dataSource} autoOpen />
        </Content>
      </Dialog>
    </>
  );
};

autoOpenInADialog.parameters = {
  screenshots: {
    captureSelector: ['[data-test~=ring-dialog]', '[data-test~=ring-popup]'],
  },
  a11y: {element: '#storybook-root,[data-test~=ring-dialog],[data-test~=ring-popup]'},
};
