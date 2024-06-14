import {Component} from 'react';
import {shallow, render} from 'enzyme';

import TagsList, {TagsListAttrs} from './tags-list';

describe('Tags List', () => {
  let tagsList;
  const tagsMock = [{key: 1, label: 'test1'}];
  const shallowTagsList = (props?: Partial<TagsListAttrs>) =>
    shallow(<TagsList tags={tagsMock} {...props}/>);
  const renderTagsList = (props?: Partial<TagsListAttrs>) =>
    render(<TagsList tags={tagsMock} {...props}/>);

  describe('DOM', () => {
    it('should render tags list', () => {
      shallowTagsList().should.have.data('test', 'ring-tags-list');
    });

    it('should render passed label inside tags', () => {
      renderTagsList().find('[data-test~="ring-tag"]').should.have.text('test1');
    });

    it('should render custom tag', () => {
      class CustomTag extends Component {
        render() {
          return (<span data-test="custom-tag" className="custom-tag"/>);
        }
      }

      tagsList = renderTagsList({
        customTagComponent: CustomTag
      });

      tagsList.find('.custom-tag').should.have.data('test', 'custom-tag');
    });

    it('Should use passed className', () => {
      tagsList = shallowTagsList({
        className: 'test-class'
      });

      tagsList.should.have.className('test-class');
    });
  });
});
