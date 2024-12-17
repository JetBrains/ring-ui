/* eslint-disable react/jsx-no-literals */
import {render, screen, fireEvent} from '@testing-library/react';

import {SinonStub} from 'sinon';

import {beforeEach} from 'vitest';

import Upload from './upload';
import styles from './upload.css';

describe('<Upload />', () => {
  let onFilesSelectedMock: SinonStub;

  beforeEach(() => {
    onFilesSelectedMock = sandbox.stub();
  });

  const testFile = new File(['test-content'], 'test-file.txt', {type: 'text/plain'});

  it('should render component', () => {
    render(
      <Upload onFilesSelected={onFilesSelectedMock}>
        <div data-test="upload-content">{'Drop files here'}</div>
      </Upload>,
    );

    const component = screen.getByTestId('ring-upload');
    const child = screen.getByTestId('upload-content');

    expect(component).not.toBeNull();
    expect(child).not.toBeNull();
  });

  it('triggers `onFilesSelected` when files are dropped', () => {
    render(<Upload onFilesSelected={onFilesSelectedMock}>Drop files here</Upload>);

    const dropZone = screen.getByText('Drop files here');

    const dataTransfer = {
      items: [
        {
          kind: 'file',
          getAsFile: () => testFile,
        },
      ],
    };

    fireEvent.drop(dropZone, {dataTransfer});

    onFilesSelectedMock.should.have.been.calledOnce;
    onFilesSelectedMock.should.have.been.calledWith([testFile]);
  });

  it('should update style on drag enter/leave', () => {
    render(<Upload onFilesSelected={onFilesSelectedMock}>Drop files here</Upload>);
    const dropZone = screen.getByText('Drop files here');

    dropZone.className.should.not.include(styles.dragOver);
    fireEvent.dragEnter(dropZone);
    dropZone.className.should.include(styles.dragOver);
    fireEvent.dragLeave(dropZone);
    dropZone.className.should.not.include(styles.dragOver);
  });

  it('ignores non-file items during drop', () => {
    render(<Upload onFilesSelected={onFilesSelectedMock}>Drop files here</Upload>);

    const dropZone = screen.getByTestId('ring-upload');

    const dataTransfer = {
      items: [
        {
          kind: 'string',
          getAsFile: () => null,
        },
      ],
    };

    fireEvent.drop(dropZone, {dataTransfer});
    onFilesSelectedMock.should.not.been.called;
  });
});
