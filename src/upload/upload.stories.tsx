/* eslint-disable no-console */
import React from 'react';

import {Meta, StoryFn} from '@storybook/react-webpack5';

import Button from '../button/button';

import Upload, {UploadHandle, UploadVariant} from './upload';

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
    variant: {
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
    variant: 'empty',
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
    const [variant, setVariant] = React.useState<UploadVariant>('empty');

    const filesSelected = React.useCallback((files: File[]) => {
      setVariant('success');
      setSelectedFiles(files);
    }, []);

    const onFilesRejected = React.useCallback((files: File[]) => {
      setVariant('error');
      setSelectedFiles(files);
    }, []);

    const validate = React.useCallback((file: File) => file.size < 100000, []);

    return (
      <Upload
        multiple={false}
        validate={validate}
        onFilesSelected={filesSelected}
        onFilesRejected={onFilesRejected}
        variant={variant}
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

filePickerScenario.parameters = {
  screenshots: {skip: true},
};

export const programmaticOpen: Story = args => {
  const {onFilesSelected, ...rest} = args;

  function UploadDemo() {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const uploadRef = React.useRef<UploadHandle>(null);

    const filesSelected = React.useCallback((files: File[]) => {
      setSelectedFiles(files);
      onFilesSelected(files);
    }, []);

    return (
      <div>
        <Upload onFilesSelected={filesSelected} {...rest} ref={uploadRef}>
          <div>{selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : 'Drop files here'}</div>
        </Upload>

        <Button onClick={() => uploadRef.current?.openFilePicker()}>Click to select file</Button>
      </div>
    );
  }

  return <UploadDemo />;
};

programmaticOpen.args = {
  multiple: false,
};

programmaticOpen.parameters = {
  screenshots: {skip: true},
};

programmaticOpen.storyName = 'Programmatic open';
