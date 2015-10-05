
const TOP_ALL = -1;

const defaultOptions = {
  searchMax: 20,
  cacheExpireTime: 60/*sec*/ * 1000,
  searchSideThreshold: 100
};

class HubSourceCache {
  constructor(expireTime) {
    this.expireTime = expireTime;
    this.validUntil = 0;
    this.value = null;
  }

  valid() {
    return Date.now() > this.validUntil;
  }

  setValue(value) {
    this.value = value;
    this.validUntil = Date.now() + this.expireTime;
  }

  getValue() {
    return this.value;
  }
}


/**
 * HubSource designed to speed search requests for small installations.
 * If there is less items then searchSideThreshold, it uses clientside filtering
 * cached results to rapidly increase search speed. Useful for autocompletions and
 * select data source.
 */
export default class HubSource {
  constructor(auth, relativeUrl, options) {
    this.auth = auth;
    this.relativeUrl = relativeUrl;
    this.options = Object.assign({}, defaultOptions, options);


    this.cache = new HubSourceCache(this.options.expireTime);
    this.isClientSideSearch = null;
    this.filterFn = null;
  }

  makeRequest(params) {
    return this.auth.requestToken()
      .then(token => this.auth.getApi(this.relativeUrl, token, params));
  }

  makeCachedRequest(params) {
    if (this.cache.valid()) {
      return this.makeRequest(params)
        .then(res => {
          this.cache.setValue(res);
          return res;
        });
    }
    return Promise.resolve(this.cache.getValue());
  }

  static mergeParams(params, toMerge) {
    return Object.assign({}, params, toMerge);
  }

  checkIsClientSideSearch(res) {
    return res.total <= this.options.searchSideThreshold;
  }

  getDefaultFilterFn(query) {
    return (it) => it.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  processResults(res) {
    let items = res[this.relativeUrl];

    if (this.isClientSideSearch) {
      return items.filter(it => this.filterFn(it)).slice(0, this.options.searchMax);
    }
    return items;
  }

  sideDetectionRequest(params) {
    return this.makeCachedRequest(HubSource.mergeParams(params, {$top: this.options.searchSideThreshold}))
      .then(res => {
        this.isClientSideSearch = this.checkIsClientSideSearch(res);
        return res;
      })
      .then(res => this.processResults(res));
  }

  doClientSideSearch(params) {
    return this.makeCachedRequest(HubSource.mergeParams(params, {$top: TOP_ALL}))
      .then(res => this.processResults(res));
  }

  doServerSideSearch(params) {
    return this.makeRequest(HubSource.mergeParams(params, {$top: this.options.searchMax}))
      .then(res => this.processResults(res));
  }

  get(query, params, filterFn) {

    this.filterFn = filterFn || this.getDefaultFilterFn(query);

    if (this.isClientSideSearch === null) {
      return this.sideDetectionRequest(params);
    }

    if (this.isClientSideSearch) {
      return this.doClientSideSearch(params);
    }

    return this.doServerSideSearch(params);
  }
}
