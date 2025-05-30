import {Component} from 'react';
import {render, screen} from '@testing-library/react';

import TagsList, {TagsListAttrs} from './tags-list';

describe('Tags List', () => {
  const tagsMock = [{key: 1, label: 'test1'}];
  const renderTagsList = (props?: Partial<TagsListAttrs>) => render(<TagsList tags={tagsMock} {...props} />);

  describe('DOM', () => {
    it('should render tags list', () => {
      renderTagsList();
      expect(screen.getByTestId('ring-tags-list')).to.exist;
    });

    it('should render passed label inside tags', () => {
      renderTagsList();
      const tag = screen.getByTestId('ring-tag');
      expect(tag).to.have.text('test1');
    });

    it('should render custom tag', () => {
      class CustomTag extends Component {
        render() {
          return <span data-test="custom-tag" className="custom-tag" />;
        }
      }

      renderTagsList({
        customTagComponent: CustomTag,
      });

      expect(screen.getByTestId('custom-tag')).to.exist;
      expect(screen.getByTestId('custom-tag')).to.have.class('custom-tag');
    });

    it('Should use passed className', () => {
      renderTagsList({
        className: 'test-class',
      });

      expect(screen.getByTestId('ring-tags-list')).to.have.class('test-class');
    });
  });
});
