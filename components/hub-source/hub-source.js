const defaultOptions = {
  searchMax: 20,
  searchSideThreshold: 100,
  queryFormatter: query => `${query} or ${query}*`
};

/**
 * HubSource is designed to speed up search requests for small installations.
 * If there are less than "searchSideThreshold" items, it uses client-side filtering
 * of cached results to greatly increase search speed. Useful for autocompletions and
 * select data source.
 */
export default class HubSource {
  static TOP_ALL = -1;

  constructor(auth, relativeUrl, options) {
    this.auth = auth;
    this.relativeUrl = relativeUrl;
    this.options = Object.assign({}, defaultOptions, options);


    this.storedData = null;
    this.isClientSideSearch = null;
    this.filterFn = null;
  }

  async makeRequest(params) {
    const token = await this.auth.requestToken();
    return this.auth.getApi(this.relativeUrl, token, params);
  }

  async makeCachedRequest(params) {
    if (this.storedData) {
      return this.storedData;
    }
    const res = await this.makeRequest(params);
    this.storedData = res;
    return res;
  }

  static mergeParams(params, toMerge) {
    return Object.assign({}, params, toMerge);
  }

  checkIsClientSideSearch(res) {
    return res.total <= this.options.searchSideThreshold;
  }

  getDefaultFilterFn(query) {
    if (!query) {
      return () => true;
    }
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
      return items.
        filter(it => this.filterFn(it)).
        slice(0, this.options.searchMax);
    }
    return items;
  }

  async sideDetectionRequest(params, query) {
    const res = await this.makeCachedRequest(HubSource.mergeParams(params, {
      $top: this.options.searchSideThreshold
    }));
    this.isClientSideSearch = this.checkIsClientSideSearch(res);

    if (!this.isClientSideSearch) {
      return this.doServerSideSearch(params, query);
    }

    return res;
  }

  doClientSideSearch(params) {
    return this.makeCachedRequest(HubSource.mergeParams(params, {$top: this.constructor.TOP_ALL}));
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

  async get(query, params, filterFn) {
    HubSource.validateInputParams(params);

    this.filterFn = filterFn || this.getDefaultFilterFn(query);

    const res = this.getValueFromSuitableSource(query, params);
    return this.processResults(res);
  }
}
