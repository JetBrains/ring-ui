import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Pager from './pager';

function getDataFromUrl(name, defaultValue) {
  const params = new URLSearchParams(location.search);
  const value = params.get(name);
  return value ? parseInt(value, 10) : defaultValue;
}

function hrefGenerator(linkPageNumber, pageSize) {
  const params = new URLSearchParams(location.search);
  params.set('page', linkPageNumber);
  if (pageSize) {
    params.set('pageSize', pageSize);
  }
  return `${location.pathname}?${params}`;
}

export default {
  title: 'Components|Pager',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a pager.',
    hermione: {captureSelector: '*[data-test~=ring-pager]'}
  }
};

export const basic = () => {
  class PagerDemo extends Component {
    state = {
      total: 750,
      currentPage: 1
    };

    render() {
      const {total, currentPage} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          disablePageSizeSelector
          onPageChange={cp => this.setState({currentPage: cp})}
        />
      );
    }
  }

  return <PagerDemo/>;
};

basic.story = {
  name: 'basic'
};

export const customFrameSize = () => {
  class PagerDemo extends Component {
    state = {
      total: 750,
      currentPage: 1
    };

    render() {
      const {total, currentPage} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          visiblePagesLimit={3}
          disablePageSizeSelector
          onPageChange={cp => this.setState({currentPage: cp})}
        />
      );
    }
  }

  return <PagerDemo/>;
};

customFrameSize.story = {
  name: 'custom frame size',
  parameters: {hermione: {skip: true}}
};

export const customFrameSize2 = () => {
  class PagerDemo extends Component {
    state = {
      total: 250,
      currentPage: 1
    };

    render() {
      const {total, currentPage} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          visiblePagesLimit={5}
          disablePageSizeSelector
          onPageChange={cp => this.setState({currentPage: cp})}
        />
      );
    }
  }

  return <PagerDemo/>;
};

customFrameSize2.story = {
  name: 'custom frame size #2',
  parameters: {hermione: {skip: true}}
};

export const customFrameSize3 = () => {
  class PagerDemo extends Component {
    state = {
      total: 400,
      currentPage: 1
    };

    render() {
      const {total, currentPage} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          visiblePagesLimit={5}
          disablePageSizeSelector
          onPageChange={cp => this.setState({currentPage: cp})}
        />
      );
    }
  }

  return <PagerDemo/>;
};

customFrameSize3.story = {
  name: 'custom frame size #3',
  parameters: {hermione: {skip: true}}
};

export const pageSizeSelector = () => {
  class PagerDemo extends Component {
    state = {
      total: 300,
      currentPage: 1,
      pageSize: 50
    };

    render() {
      const {total, currentPage, pageSize} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={cp => this.setState({currentPage: cp})}
          onPageSizeChange={ps => this.setState({pageSize: ps})}
        />
      );
    }
  }

  return <PagerDemo/>;
};

pageSizeSelector.story = {
  name: 'page size selector'
};

export const openTotal = () => {
  class PagerDemo extends Component {
    state = {
      total: 10,
      currentPage: 1,
      pageSize: 10
    };

    render() {
      const {total, currentPage, pageSize} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          openTotal={total < 100}
          onPageChange={cp => this.setState({currentPage: cp})}
          onLoadPage={cp => this.setState({currentPage: cp, total: total + 10})}
          visiblePagesLimit={5}
          disablePageSizeSelector
        />
      );
    }
  }

  return <PagerDemo/>;
};

openTotal.story = {
  name: 'open total'
};

export const openTotalAndHistorySupport = () => {
  class PagerDemo extends Component {
    state = {
      total: 999,
      currentPage: getDataFromUrl('page', 1),
      pageSize: getDataFromUrl('pageSize', 20)
    };

    componentDidMount() {
      history.replaceState(
        this.state,
        '',
        hrefGenerator(this.state.currentPage, this.state.pageSize)
      );
      window.addEventListener('popstate', this.onPopstate);
    }

    componentWillUnmount() {
      window.removeEventListener('popstate', this.onPopstate);
    }

    onPopstate = () => {
      if (
        window.history.state &&
        window.history.state.currentPage &&
        window.history.state.pageSize
      ) {
        this.setState({
          pageSize: window.history.state.pageSize,
          currentPage: window.history.state.currentPage
        });
      }
    };

    handlePageChange(update) {
      this.setState(update, () =>
        history.pushState(
          this.state,
          '',
          hrefGenerator(this.state.currentPage, this.state.pageSize)
        )
      );
    }

    render() {
      const {total, currentPage, pageSize} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          hrefFunc={hrefGenerator}
          visiblePagesLimit={5}
          openTotal={total < 2000}
          onPageChange={cp => this.handlePageChange({currentPage: cp})}
          onPageSizeChange={ps => this.handlePageChange({currentPage: 1, pageSize: ps})}
          onLoadPage={cp =>
            this.handlePageChange(prevState => ({currentPage: cp, total: prevState.total + 500}))
          }
        />
      );
    }
  }

  return <PagerDemo/>;
};

openTotalAndHistorySupport.story = {
  name: 'open total and history support',
  parameters: {hermione: {skip: true}}
};

export const reloadOnCurrentPageChange = () => {
  class PagerDemo extends Component {
    state = {
      total: 120,
      currentPage: getDataFromUrl('page', 1),
      pageSize: getDataFromUrl('pageSize', 20)
    };

    render() {
      const {total, currentPage, pageSize} = this.state;
      return (
        <Pager
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          hrefFunc={hrefGenerator}
          visiblePagesLimit={5}
        />
      );
    }
  }

  return <PagerDemo/>;
};

reloadOnCurrentPageChange.story = {
  name: 'reload on current page change',
  parameters: {hermione: {skip: true}}
};
