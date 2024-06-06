import React, {Component} from 'react';


import Pager from './pager';

function getDataFromUrl(name: string, defaultValue: number) {
  const params = new URLSearchParams(location.search);
  const value = params.get(name);
  return value ? parseInt(value, 10) : defaultValue;
}

function hrefGenerator(linkPageNumber: number, pageSize?: number) {
  const params = new URLSearchParams(location.search);
  params.set('page', String(linkPageNumber));
  if (pageSize) {
    params.set('pageSize', String(linkPageNumber));
  }
  return `${location.pathname}?${params}`;
}

export default {
  title: 'Components/Pager',

  parameters: {
    notes: 'Displays a pager.',
    screenshots: {captureSelector: '*[data-test~=ring-pager]'}
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

basic.storyName = 'basic';

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

customFrameSize.storyName = 'custom frame size';
customFrameSize.parameters = {screenshots: {skip: true}};

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

customFrameSize2.storyName = 'custom frame size #2';
customFrameSize2.parameters = {screenshots: {skip: true}};

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

customFrameSize3.storyName = 'custom frame size #3';
customFrameSize3.parameters = {screenshots: {skip: true}};

export const pageSizeSelector = () => {
  class PagerDemo extends Component {
    state = {
      total: 100,
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

pageSizeSelector.storyName = 'page size selector';

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

openTotal.storyName = 'open total';

export const openTotalAndHistorySupport = () => {
  interface PagerDemoState {
    total: number
    currentPage: number
    pageSize: number
  }

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

    handlePageChange(
      update: Partial<PagerDemoState> | ((prevState: PagerDemoState) => Partial<PagerDemoState>)
    ) {
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

openTotalAndHistorySupport.storyName = 'open total and history support';
openTotalAndHistorySupport.parameters = {screenshots: {skip: true}};

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

reloadOnCurrentPageChange.storyName = 'reload on current page change';
reloadOnCurrentPageChange.parameters = {screenshots: {skip: true}};
