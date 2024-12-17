/* eslint-disable no-console */
import React from 'react';

import {Meta, StoryFn} from '@storybook/react';

import Button from '../button/button';

import Upload, {PickFileState, UploadContext} from './upload';

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
    const isSmall = 'small' in args && args.small;
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);

    return (
      <Upload onFilesSelected={filesSelected} {...rest} className={isSmall ? 'smallUpload' : ''}>
        <div>{selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Browse or Drop a File'}</div>
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

basic.parameters = {
  storyStyles: `
.smallUpload {
  width: calc(var(--ring-unit) * 18);
  height: calc(var(--ring-unit) * 12);
}
`,
};

basic.storyName = 'Upload';

export const small: Story = args => {
  const {onFilesSelected, ...rest} = args;

  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);

    return (
      <Upload onFilesSelected={filesSelected} {...rest} className="smallUpload">
        <div>{selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Browse or Drop a File'}</div>
      </Upload>
    );
  }

  return <UploadDemo />;
};

small.parameters = {
  storyStyles: `
.smallUpload {
  width: calc(var(--ring-unit) * 18);
  height: calc(var(--ring-unit) * 12);
}
`,
};

export const filePickerScenario: Story = () => {
  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [uploaderState, setUploaderState] = React.useState<PickFileState>('empty');

    const filesSelected = React.useCallback((files: File[]) => {
      setUploaderState('success');
      setSelectedFiles(files);
    }, []);

    const onFilesRejected = React.useCallback((files: File[]) => {
      setUploaderState('error');
      setSelectedFiles(files);
    }, []);

    const validate = React.useCallback((file: File) => file.size < 100000, []);

    return (
      <Upload
        multiple={false}
        validate={validate}
        onFilesSelected={filesSelected}
        onFilesRejected={onFilesRejected}
        state={uploaderState}
      >
        <div>
          {selectedFiles.length
            ? selectedFiles.map(f => f.name).join(', ')
            : 'Browse or Drop a file with size less than 100Kb'}
        </div>
      </Upload>
    );
  }

  return <UploadDemo />;
};

export const programmaticOpen: Story = args => {
  const {onFilesSelected, ...rest} = args;

  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const openFnRef = React.useRef<() => void>();

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);

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
