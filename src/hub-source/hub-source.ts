import Auth from '../auth/auth';
import HTTP from '../http/http';

export interface Item {
  name: string;
}

export type Response<I extends Item, U extends string> = Partial<Record<U, I[]>> & {
  total: number;
};

export interface HubSourceOptions {
  searchMax: number;
  searchSideThreshold: number;
  queryFormatter: (query: string) => string;
}

const defaultOptions: HubSourceOptions = {
  searchMax: 20,
  searchSideThreshold: 100,
  queryFormatter: query => `${query} or ${query}*`,
};

/**
 * HubSource is designed to speed up search requests for small installations.
 * If there are less than "searchSideThreshold" items, it uses client-side filtering
 * of cached results to greatly increase search speed. Useful for completion and
 * select data source.
 */
export default class HubSource<I extends Item, U extends string> {
  static TOP_ALL = -1;
  http: HTTP;
  relativeUrl: U;
  options: HubSourceOptions;
  storedData: Response<I, U> | null;
  isClientSideSearch: boolean | null;
  filterFn: (item: I) => boolean;

  constructor(auth: Auth, relativeUrl: U, options?: Partial<HubSourceOptions>) {
    this.http = auth.http;
    this.relativeUrl = relativeUrl;
    this.options = Object.assign({}, defaultOptions, options);

    this.storedData = null;
    this.isClientSideSearch = null;
    this.filterFn = () => true;
  }

  makeRequest<T = unknown>(queryParams?: Record<string, unknown>) {
    return this.http.get<T>(this.relativeUrl, {query: queryParams});
  }

  async makeCachedRequest(params?: Record<string, unknown>) {
    if (this.storedData) {
      return this.storedData;
    }
    const res = await this.makeRequest<NonNullable<typeof this.storedData>>(params);
    this.storedData = res;
    return res;
  }

  static mergeParams(params?: Record<string, unknown>, toMerge?: Record<string, unknown>) {
    return Object.assign({}, params, toMerge);
  }

  checkIsClientSideSearch(res: Response<I, U>) {
    return res.total <= this.options.searchSideThreshold;
  }

  getDefaultFilterFn(query?: string) {
    if (!query) {
      return () => true;
    }
    return (it: I) => it.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  formatQuery(query?: string) {
    return query ? this.options.queryFormatter(query) : '';
  }

  static validateInputParams(params: Record<string, unknown>) {
    if (params.top) {
      throw new Error('HubSource: params.top should not be filled, configure "options.searchMax" instead');
    }
    if (params.query) {
      throw new Error('HubSource: params.query should not be filled, configure "options.queryFormatter" instead');
    }
  }

  processResults(res: Response<I, U>) {
    const items: I[] = res[this.relativeUrl] || [];

    if (this.isClientSideSearch) {
      return items.filter(it => this.filterFn(it)).slice(0, this.options.searchMax);
    }
    return items;
  }

  async sideDetectionRequest(params?: Record<string, unknown>, query?: string) {
    const res = await this.makeCachedRequest(
      HubSource.mergeParams(params, {
        $top: this.options.searchSideThreshold,
      }),
    );
    this.isClientSideSearch = this.checkIsClientSideSearch(res);

    if (!this.isClientSideSearch) {
      return this.doServerSideSearch(params, query);
    }

    return res;
  }

  doClientSideSearch(params?: Record<string, unknown>) {
    return this.makeCachedRequest(
      HubSource.mergeParams(params, {
        $top: (this.constructor as typeof HubSource).TOP_ALL,
      }),
    );
  }

  doServerSideSearch(params?: Record<string, unknown>, query?: string) {
    return this.makeRequest(
      HubSource.mergeParams(params, {
        query: this.formatQuery(query),
        $top: this.options.searchMax,
      }),
    );
  }

  getValueFromSuitableSource(query?: string, params?: Record<string, unknown>) {
    if (this.isClientSideSearch === null) {
      return this.sideDetectionRequest(params, query) as Promise<NonNullable<typeof this.storedData>>;
    }

    if (this.isClientSideSearch) {
      return this.doClientSideSearch(params) as Promise<NonNullable<typeof this.storedData>>;
    }

    return this.doServerSideSearch(params, query) as Promise<NonNullable<typeof this.storedData>>;
  }

  async get(query: string, params: Record<string, unknown>, filterFn?: (item: I) => boolean) {
    HubSource.validateInputParams(params);

    this.filterFn = filterFn || this.getDefaultFilterFn(query);

    const res = await this.getValueFromSuitableSource(query, params);
    return this.processResults(res);
  }
}
