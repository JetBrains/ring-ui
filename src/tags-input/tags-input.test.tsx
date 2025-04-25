import {render, screen, fireEvent, within, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TagsInput, {TagsInputAttrs} from './tags-input';

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
      const onAddTag = sandbox.spy();
      const {rerender} = renderTagsInput({onAddTag});

      // Simulate adding a tag by updating the tags prop
      const newTags = [...fakeTags, {key: 2, label: 'test2'}];
      rerender(<TagsInput tags={newTags} onAddTag={onAddTag} />);

      // Check if the new tag is rendered
      expect(screen.getByText('test2')).to.exist;
    });

    it('Should remove tag', async () => {
      const onRemoveTag = sandbox.spy();
      const {tagsList} = renderTagsInput({onRemoveTag});

      // Find the remove button and click it
      const removeButton = within(tagsList).getByTestId('ring-tag-remove');
      const user = userEvent.setup();
      await user.click(removeButton);

      // Check if onRemoveTag was called
      expect(onRemoveTag).to.have.been.called;
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
      const dataSource = sandbox.spy(() => Promise.resolve([]));
      const {input} = renderTagsInput({dataSource});

      // Focus the input
      const user = userEvent.setup();
      await user.click(input);

      // Check if dataSource was called
      expect(dataSource).to.have.been.called;
    });

    it('Should call datasource with query entered', async () => {
      const dataSource = sandbox.spy(() => Promise.resolve([]));
      const {input} = renderTagsInput({dataSource});

      // Type in the input
      const user = userEvent.setup();
      await user.type(input, 'testquery');

      // Check if dataSource was called with the query
      expect(dataSource).to.have.been.calledWith({query: 'testquery'});
    });
  });

  describe('Keyboard Navigation', () => {
    // This test is challenging to implement with React Testing Library because
    // it requires simulating a complex user interaction where the input is empty
    // and the backspace key is pressed, which should remove the last tag.
    // The functionality is implemented in the handleKeyDown method of the TagsInput component.
    it('Should remove last tag on pressing backspace if input is empty', async () => {
      const onRemoveTag = sandbox.spy(() => act(() => {}));
      const {input} = renderTagsInput({onRemoveTag});

      await act(() => fireEvent.keyDown(input, {key: 'Backspace'}));

      expect(onRemoveTag).to.have.been.called;
    });

    it('Should not remove tag on pressing backspace if input is not empty', async () => {
      const onRemoveTag = sandbox.spy();
      const {input} = renderTagsInput({onRemoveTag});

      // Type in the input and press backspace
      const user = userEvent.setup();
      await user.type(input, 'test');
      fireEvent.keyDown(input, {key: 'Backspace'});

      // Check if onRemoveTag was not called
      expect(onRemoveTag).to.not.have.been.called;
    });
  });
});
