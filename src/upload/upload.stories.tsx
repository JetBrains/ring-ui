/* eslint-disable no-console */
import React from 'react';

import {Meta, StoryFn} from '@storybook/react';

import Button from '../button/button';

import Upload, {UploadContext} from './upload';

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
    state: {
      control: {
        type: 'select',
        labels: {
          empty: 'empty',
          success: 'success',
          error: 'error',
        },
      },
    },
  },
  args: {
    state: 'empty',
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
        <div>{selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Drop files here'}</div>
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

export const programmaticOpen: Story = args => {
  const {onFilesSelected, ...rest} = args;

  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const openFnRef = React.useRef<() => void>();

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);
    console.log('openFn', openFnRef.current);
    return (
      <div>
        <Upload onFilesSelected={filesSelected} {...rest}>
          <UploadContext.Consumer>
            {ctx => {
              openFnRef.current = ctx.openFilePicker;
              return null;
            }}
          </UploadContext.Consumer>
          <div>{selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Drop files here'}</div>
        </Upload>

        <Button onClick={() => openFnRef.current?.()}>Click to select file</Button>
      </div>
    );
  }

  return <UploadDemo />;
};

programmaticOpen.args = {
  multiple: false,
};

programmaticOpen.storyName = 'Programmatic open';
