export const TOP_ALL = -1;

const defaultOptions = {
  searchMax: 20,
  searchSideThreshold: 100,
  queryFormatter: query => `${query} or ${query}*`
};

/**
 * HubSource designed to speed search requests for small installations.
 * If there is less than "searchSideThreshold" items, it uses clientside filtering
 * cached results to rapidly increase search speed. Useful for autocompletions and
 * select data source.
 */
export default class HubSource {
  constructor(auth, relativeUrl, options) {
    this.auth = auth;
    this.relativeUrl = relativeUrl;
    this.options = Object.assign({}, defaultOptions, options);


    this.storedData = null;
    this.isClientSideSearch = null;
    this.filterFn = null;
  }

  makeRequest(params) {
    return this.auth.requestToken()
      .then(token => this.auth.getApi(this.relativeUrl, token, params));
  }

  makeCachedRequest(params) {
    if (this.storedData) {
      return Promise.resolve(this.storedData);
    }
    return this.makeRequest(params)
      .then(res => {
        this.storedData = res;
        return res;
      });
  }

  static mergeParams(params, toMerge) {
    return Object.assign({}, params, toMerge);
  }

  checkIsClientSideSearch(res) {
    return res.total <= this.options.searchSideThreshold;
  }

  getDefaultFilterFn(query) {
    return it => it.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  formatQuery(query) {
    return query ? this.options.queryFormatter(query) : '';
  }

  static validateInputParams(params) {
    if (params.top) {
      throw new Error('HubSource: params.top should not be filled, configure "options.searchMax" instead');
    }
    if (params.query) {
      throw new Error('HubSource: params.query should not be filled, configure "options.queryFormatter" instead');
    }
  }

  processResults(res) {
    const items = res[this.relativeUrl] || [];

    if (this.isClientSideSearch) {
      return items.filter(it => this.filterFn(it)).slice(0, this.options.searchMax);
    }
    return items;
  }

  sideDetectionRequest(params, query) {
    return this.makeCachedRequest(HubSource.mergeParams(params, {$top: this.options.searchSideThreshold}))
      .then(res => {
        this.isClientSideSearch = this.checkIsClientSideSearch(res);

        if (!this.isClientSideSearch) {
          return this.doServerSideSearch(params, query);
        }

        return res;
      });
  }

  doClientSideSearch(params) {
    return this.makeCachedRequest(HubSource.mergeParams(params, {$top: TOP_ALL}));
  }

  doServerSideSearch(params, query) {
    return this.makeRequest(HubSource.mergeParams(params, {
      query: this.formatQuery(query),
      $top: this.options.searchMax
    }));
  }

  getValueFromSuitableSource(query, params) {
    if (this.isClientSideSearch === null) {
      return this.sideDetectionRequest(params, query);
    }

    if (this.isClientSideSearch) {
      return this.doClientSideSearch(params);
    }

    return this.doServerSideSearch(params, query);
  }

  get(query, params, filterFn) {
    HubSource.validateInputParams(params);

    this.filterFn = filterFn || this.getDefaultFilterFn(query);

    return this.getValueFromSuitableSource(query, params)
      .then(res => this.processResults(res));
  }
}
