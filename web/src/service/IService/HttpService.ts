interface Response<T> {
  status: number;
  statusText: string;
  data: T;
}

interface Headers {
  [key: string]:
    | string
    | {
        [key: string]: string;
      };
  headers: {
    [key: string]: string;
  };
}

interface IGetOptions {
  headers?: {
    [key: string]: string;
  };
  params?: {
    [key: string]: string;
  };
}

export interface HttpService {
  get<T>(url: string, options?: IGetOptions): Promise<Response<T>>;
  post<T>(url: string, data: unknown, headers?: Headers): Promise<Response<T>>;
  put<T>(url: string, data: unknown, headers?: Headers): Promise<Response<T>>;
  patch<T>(url: string, data: unknown, headers?: Headers): Promise<Response<T>>;
  delete<T>(url: string, headers?: Headers): Promise<Response<T>>;
}
