import React from 'react';

import Upload from './upload';

export default {
  title: 'Components/Upload',

  parameters: {
    notes: 'Displays a file-upload dropzone',
  },
};

export const basic = () => {
  function UploadDemo() {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <Upload onFilesSelected={setFiles}>{files.length ? files.map(f => f.name).join(', ') : 'Drop files here'}</Upload>
    );
  }

  return <UploadDemo />;
};

basic.storyName = 'Upload';
