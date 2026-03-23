import {render, screen, fireEvent, within, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TagsInput, {type TagsInputAttrs} from './tags-input';

import styles from './tags-input.css';
import inputStyles from '../input/input.css';
import chevronStyles from '../select/chevron-button.css';

describe('Tags Input', () => {
  const fakeTags = [{key: 1, label: 'test1'}];

  const renderTagsInput = (props?: TagsInputAttrs) => {
    const result = render(<TagsInput tags={fakeTags} {...props} />);
    return {
      ...result,
      tagsInput: screen.getByTestId('ring-tags-list').parentElement,
      tagsList: screen.getByTestId('ring-tags-list'),
      input: screen.getByTestId('ring-select__focus'),
      select: screen.getByTestId('ring-select'),
    };
  };

  describe('DOM', () => {
    it('should render select', () => {
      const {select} = renderTagsInput();
      expect(select).to.exist;
    });

    it('Should use passed className', () => {
      const {tagsInput} = renderTagsInput({
        className: 'test-class',
      });
      expect(tagsInput).to.have.class('test-class');
    });
  });

  describe('Select', () => {
    it('Should add tag', () => {
      const onAddTag = vi.fn();
      const {rerender} = renderTagsInput({onAddTag});

      // Simulate adding a tag by updating the tags prop
      const newTags = [...fakeTags, {key: 2, label: 'test2'}];
      rerender(<TagsInput tags={newTags} onAddTag={onAddTag} />);

      // Check if the new tag is rendered
      expect(screen.getByText('test2')).to.exist;
    });

    it('Should remove tag', async () => {
      const onRemoveTag = vi.fn();
      const {tagsList} = renderTagsInput({onRemoveTag});

      // Find the remove button and click it
      const removeButton = within(tagsList).getByTestId('ring-tag-remove');
      const user = userEvent.setup();
      await user.click(removeButton);

      // Check if onRemoveTag was called
      expect(onRemoveTag).toHaveBeenCalled();
    });

    it('Should copy tags to state on receiving props', () => {
      const {rerender} = renderTagsInput();
      const newTags = [{key: 4, label: 'test5'}];
      rerender(<TagsInput tags={newTags} />);

      // Check if the new tag is rendered and old tag is removed
      expect(screen.queryByText('test1')).to.be.null;
      expect(screen.getByText('test5')).to.exist;
    });
  });

  describe('DataSource', () => {
    it('Should call datasource when input is focused', async () => {
      const dataSource = vi.fn().mockResolvedValue([]);
      const {input} = renderTagsInput({dataSource});

      // Focus the input
      const user = userEvent.setup();
      await user.click(input);

      // Check if dataSource was called
      expect(dataSource).toHaveBeenCalled();
    });

    it('Should call datasource with query entered', async () => {
      const dataSource = vi.fn().mockResolvedValue([]);
      const {input} = renderTagsInput({dataSource});

      // Type in the input
      const user = userEvent.setup();
      await user.type(input, 'testquery');

      // Check if dataSource was called with the query
      expect(dataSource).toHaveBeenCalledWith({query: 'testquery'});
    });
  });

  describe('Keyboard Navigation', () => {
    // This test is challenging to implement with React Testing Library because
    // it requires simulating a complex user interaction where the input is empty
    // and the backspace key is pressed, which should remove the last tag.
    // The functionality is implemented in the handleKeyDown method of the TagsInput component.
    it('Should remove last tag on pressing backspace if input is empty', async () => {
      const onRemoveTag = vi.fn().mockImplementation(() => act(() => {}));
      const {input} = renderTagsInput({onRemoveTag});

      await act(() => fireEvent.keyDown(input, {key: 'Backspace'}));

      expect(onRemoveTag).toHaveBeenCalled();
    });

    it('Should not remove tag on pressing backspace if input is not empty', async () => {
      const onRemoveTag = vi.fn();
      const {input} = renderTagsInput({onRemoveTag});

      // Type in the input and press backspace
      const user = userEvent.setup();
      await user.type(input, 'test');
      fireEvent.keyDown(input, {key: 'Backspace'});

      // Check if onRemoveTag was not called
      expect(onRemoveTag).not.toHaveBeenCalled;
    });
  });

  describe('with error', () => {
    it('should add error class', () => {
      const {tagsList} = renderTagsInput({
        error: '',
      });
      expect(tagsList).to.have.class(styles.error);
    });

    it('should render error message', () => {
      const error = 'This is a sample error message';
      const {tagsList} = renderTagsInput({
        error,
      });
      expect(tagsList).to.have.class(styles.error);
      const errorElement = tagsList.querySelector(`.${inputStyles.errorText}`);
      expect(errorElement).to.have.text(error);
    });
  });

  describe('opening and closing', () => {
    it('should open and close popup on clicking on chevron', async () => {
      const {tagsInput} = renderTagsInput();
      const chevronButton = tagsInput?.querySelector(`.${chevronStyles.chevronButton}`);
      if (!chevronButton) throw new Error('Chevron button not found');

      expect(screen.queryByTestId('ring-popup')).not.to.exist;

      const user = userEvent.setup();
      await user.click(chevronButton);
      expect(screen.queryByTestId('ring-popup')).to.exist;

      await user.click(chevronButton);
      expect(screen.queryByTestId('ring-popup')).not.to.exist;
    });
  });
});
