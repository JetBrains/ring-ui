/* eslint-disable react/jsx-no-literals */
import {render, screen, fireEvent} from '@testing-library/react';
import {beforeEach, type Mock} from 'vitest';
import userEvent from '@testing-library/user-event';
import {createRef} from 'react';

import Upload, {type UploadHandle} from './upload';

import styles from './upload.css';

describe('<Upload />', () => {
  let onFilesSelectedMock: Mock;
  let onFilesRejectedMock: Mock;

  beforeEach(() => {
    onFilesSelectedMock = vi.fn();
    onFilesRejectedMock = vi.fn();
  });

  const testFile = new File(['test-content'], 'test-file.txt', {type: 'text/plain'});

  it('should render component', () => {
    render(
      <Upload onFilesSelected={onFilesSelectedMock}>
        <div data-test='upload-content'>{'Drop files here'}</div>
      </Upload>,
    );

    const component = screen.getByTestId('ring-upload');
    const child = screen.getByTestId('upload-content');

    expect(component).not.toBeNull();
    expect(child).not.toBeNull();
  });

  it('should expose imperative API', () => {
    const ref = createRef<UploadHandle>();
    render(
      <Upload onFilesSelected={onFilesSelectedMock} ref={ref}>
        <div data-test='upload-content'>{'Drop files here'}</div>
      </Upload>,
    );

    expect(ref.current?.openFilePicker).toBeDefined();
  });

  it('triggers `onFilesSelected` when files are dropped', async () => {
    render(<Upload onFilesSelected={onFilesSelectedMock}>Drop files here</Upload>);

    const fileInput = screen.getByTestId('ring-file-input');

    await userEvent.upload(fileInput, testFile);

    expect(onFilesSelectedMock).toHaveBeenCalledOnce;
    expect(onFilesSelectedMock).toHaveBeenCalledWith([testFile]);
  });

  it('triggers `onFilesRejected` when file validation mockReturnValue false', async () => {
    render(
      <Upload onFilesSelected={onFilesSelectedMock} onFilesRejected={onFilesRejectedMock} validate={() => false}>
        Drop files here
      </Upload>,
    );

    const fileInput = screen.getByTestId('ring-file-input');

    await userEvent.upload(fileInput, testFile);

    expect(onFilesSelectedMock).not.toHaveBeenCalledOnce;
    expect(onFilesRejectedMock).toHaveBeenCalledExactlyOnceWith([testFile]);
  });

  it('should update style on drag enter/leave', () => {
    render(<Upload onFilesSelected={onFilesSelectedMock}>Drop files here</Upload>);
    const dropZone = screen.getByText('Drop files here');
    const fileInput = screen.getByTestId('ring-file-input');

    expect(dropZone.className).to.not.include(styles.dragOver);
    fireEvent.dragEnter(fileInput);
    expect(dropZone.className).to.include(styles.dragOver);
    fireEvent.dragLeave(fileInput);
    expect(dropZone.className).to.not.include(styles.dragOver);
  });
});
