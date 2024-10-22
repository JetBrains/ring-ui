import {shallow, mount} from 'enzyme';

import Select from '../select/select';

import Caret from '../caret/caret';

import TagsInput, {TagsInputAttrs} from './tags-input';

describe('Tags Input', () => {
  const fakeTags = [{key: 1, label: 'test1'}];

  const shallowTagsInput = (props?: TagsInputAttrs) => shallow<TagsInput>(<TagsInput tags={fakeTags} {...props} />);
  const mountTagsInput = (props?: TagsInputAttrs) => mount<TagsInput>(<TagsInput tags={fakeTags} {...props} />);

  describe('DOM', () => {
    it('should render select in input_without_controls mode', () => {
      shallowTagsInput().find(Select).should.have.prop('type', Select.Type.INPUT_WITHOUT_CONTROLS);
    });

    it('Should use passed className', () => {
      const wrapper = shallowTagsInput({
        className: 'test-class',
      });
      wrapper.should.have.className('test-class');
    });
  });

  describe('Select', () => {
    it('should auto open popup', () => {
      const wrapper = mountTagsInput({autoOpen: true});
      const instance = wrapper.instance();

      instance.select!._popup!.isVisible()!.should.be.true;
    });

    it('Should add tag', () => {
      const wrapper = mountTagsInput();
      const instance = wrapper.instance();
      instance.addTag({key: 2, label: 'test2'});
      wrapper.state('tags').should.deep.contain({key: 2, label: 'test2'});
    });

    it('Should remove tag', async () => {
      const wrapper = mountTagsInput();
      const instance = wrapper.instance();
      await instance.onRemoveTag(fakeTags[0]);
      wrapper.state('tags').should.be.empty;
    });

    it('Should clear selected value after adding tag', () => {
      const wrapper = mountTagsInput();
      const instance = wrapper.instance();
      sandbox.spy(instance.select!, 'clear');
      instance.addTag({key: 2, label: 'test2'});

      instance.select!.clear.should.have.been.called;
    });

    it('Should clear select input after adding tag', () => {
      const wrapper = mountTagsInput();
      const instance = wrapper.instance();
      sandbox.spy(instance.select!, 'filterValue');
      instance.addTag({key: 2, label: 'test2'});

      instance.select!.filterValue.should.have.been.calledWith('');
    });

    it('Should copy tags to state on receiving props', () => {
      const wrapper = shallowTagsInput();
      const newTags = [{key: 4, label: 'test5'}];
      wrapper.setProps({tags: newTags});
      wrapper.state('tags').should.be.deep.equal(newTags);
    });
  });

  describe('DataSource', () => {
    it('Should call datasource and set suggestions returned', async () => {
      const suggestions = [{key: 14, label: 'suggestion 14'}];
      const dataSource = sandbox.spy(() => Promise.resolve(suggestions));
      const wrapper = mountTagsInput({dataSource});
      const instance = wrapper.instance();

      await instance.loadSuggestions();
      wrapper.state('suggestions').should.deep.equal(suggestions);
    });

    it('Should call datasource with query entered', () => {
      const dataSource = sandbox.spy(() => Promise.resolve([]));
      const wrapper = shallowTagsInput({dataSource});
      const instance = wrapper.instance();
      instance.loadSuggestions('testquery');

      dataSource.should.have.been.calledWith({query: 'testquery'});
    });

    it('Should call datasource when arrow down pressed', () => {
      const dataSource = sandbox.spy(() => Promise.resolve([]));
      const wrapper = mountTagsInput({dataSource});
      const instance = wrapper.instance();
      instance.select!.props.onBeforeOpen();

      dataSource.should.have.been.calledWith({query: ''});
    });
  });

  describe('Loading', () => {
    it('Should turn on loading message immediately after initialization', () => {
      const wrapper = mountTagsInput();
      wrapper.should.have.state('loading', true);
    });

    it('Should turn on loading message while loading suggestions', async () => {
      const dataSource = sandbox.spy(() => Promise.resolve([]));
      const wrapper = mountTagsInput({dataSource});
      const instance = wrapper.instance();

      wrapper.should.have.state('loading', true);

      await instance.loadSuggestions();
      wrapper.should.have.state('loading', false);
    });
  });

  it('Should drop existing tags from suggestions by key', () => {
    const wrapper = mountTagsInput();
    const instance = wrapper.instance();
    const notAddedSuggestions = instance.filterExistingTags([
      {key: 1, label: 'test1'},
      {key: 2, label: 'test2'},
    ]);

    notAddedSuggestions.should.be.deep.equal([{key: 2, label: 'test2'}]);
  });

  describe('Shortcuts', () => {
    describe('Keyboard handling', () => {
      const getEventMock = (keyboardKey: string) =>
        Object.assign({
          key: keyboardKey,
          preventDefault: sandbox.spy(),
          target: {
            matches: () => true,
          },
        });

      it('Should remove last tag on pressing backspace if input is empty', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'onRemoveTag');
        instance.getInputNode()!.value = '';
        instance.handleKeyDown(getEventMock('Backspace'));

        instance.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('Should not tag on pressing backspace if input is not empty', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'onRemoveTag');
        instance.getInputNode()!.value = 'entered value';
        instance.handleKeyDown(getEventMock('Backspace'));

        instance.onRemoveTag.should.not.have.been.called;
      });

      it('should remove tag with DELETE key if tag is focused', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'onRemoveTag');
        wrapper.setState({
          activeIndex: 0,
        });
        instance.handleKeyDown(getEventMock('Delete'));
        instance.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('should remove tag with BACKSPACE key if tag is focused', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'onRemoveTag');
        instance.handleKeyDown(getEventMock('Backspace'));

        instance.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('should not remove tag with DELETE key if tag is not focused', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'onRemoveTag');
        instance.handleKeyDown(getEventMock('Delete'));
        instance.onRemoveTag.should.not.have.been.called;
      });

      it('should not navigate to the first tag from select input', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'selectTag');
        instance.getInputNode();
        instance.caret = {
          getPosition: () => 1,
        } as Caret;
        instance.handleKeyDown(getEventMock('ArrowLeft'));

        instance.selectTag.should.not.have.been.called;
      });

      it('should navigate to the first tag from select input', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        instance.caret = {
          getPosition: sandbox.spy(),
        } as never;
        instance.handleKeyDown(getEventMock('ArrowLeft'));

        wrapper.should.have.state('activeIndex', 0);
      });

      it('should navigate to the select input', () => {
        const wrapper = mountTagsInput();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'setActiveIndex');
        instance.handleKeyDown(getEventMock('ArrowRight'));

        instance.setActiveIndex.should.not.have.been.calledWith(undefined);
      });
    });
  });
});
