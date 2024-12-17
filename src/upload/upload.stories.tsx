/* eslint-disable no-console */
import React from 'react';

import {Meta, StoryFn} from '@storybook/react';

import Upload from './upload';

type Story = StoryFn<typeof Upload>;

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,

  parameters: {
    notes: 'Displays a file-upload dropzone',
  },
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    accept: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onFilesSelected: files => console.info('Accepted files', files),
    onFilesRejected: files => console.error('Rejected files', files),
  },
};

export default meta;

export const basic: Story = args => {
  const {onFilesSelected, ...rest} = args;

  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);

    return (
      <Upload onFilesSelected={filesSelected} {...rest}>
        {selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Drop files here'}
      </Upload>
    );
  }

  return <UploadDemo />;
};

basic.args = {
  multiple: false,
  accept: 'image/*,.pdf',
  disabled: false,
};

basic.storyName = 'Upload';
