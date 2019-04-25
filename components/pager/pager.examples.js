/* eslint-disable max-len */
import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Pager from './pager';

storiesOf('Components|Pager', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class PagerDemo extends Component {
      state = {
        total: 750,
        currentPage: 1
      }

      render() {
        const {total, currentPage} = this.state;
        return (
          <Pager
            total={total}
            currentPage={currentPage}
            disablePageSizeSelector
            onPageChange={newCurrentPage => this.setState({currentPage: newCurrentPage})}
          />
        );
      }
    }

    return <PagerDemo/>;
  }).
  add('custom frame size', () => {
    class PagerDemo extends Component {
      state = {
        total: 750,
        currentPage: 1
      }

      render() {
        const {total, currentPage} = this.state;
        return (
          <Pager
            total={total}
            currentPage={currentPage}
            visiblePagesLimit={3}
            disablePageSizeSelector
            onPageChange={newCurrentPage => this.setState({currentPage: newCurrentPage})}
          />
        );
      }
    }

    return <PagerDemo/>;
  }).
  add('custom frame size #2', () => {
    class PagerDemo extends Component {
      state = {
        total: 250,
        currentPage: 1
      }

      render() {
        const {total, currentPage} = this.state;
        return (
          <Pager
            total={total}
            currentPage={currentPage}
            visiblePagesLimit={5}
            disablePageSizeSelector
            onPageChange={newCurrentPage => this.setState({currentPage: newCurrentPage})}
          />
        );
      }
    }

    return <PagerDemo/>;
  }).
  add('custom frame size #3', () => {
    class PagerDemo extends Component {
      state = {
        total: 400,
        currentPage: 1
      }

      render() {
        const {total, currentPage} = this.state;
        return (
          <Pager
            total={total}
            currentPage={currentPage}
            visiblePagesLimit={5}
            disablePageSizeSelector
            onPageChange={newCurrentPage => this.setState({currentPage: newCurrentPage})}
          />
        );
      }
    }

    return <PagerDemo/>;
  }).
  add('page size selector', () => {
    class PagerDemo extends Component {
      state = {
        total: 300,
        currentPage: 1,
        pageSize: 50
      }

      render() {
        const {total, currentPage, pageSize} = this.state;
        return (
          <Pager
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={newCurrentPage => this.setState({currentPage: newCurrentPage})}
            onPageSizeChange={newPageSize => this.setState({pageSize: newPageSize})}
          />
        );
      }
    }

    return <PagerDemo/>;
  });
