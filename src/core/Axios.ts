import { AxiosPromise, AxiosRequestConfig, Method } from "../type";
import dispatchRequest from "./dispatchRequest";

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthoutData('get', url, config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthoutData('delete', url, config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthoutData('head', url, config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthoutData('options', url, config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthData('post', url,data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWidthData('patch', url, data, config)
    }
    

    _requestMethodWidthoutData(method: Method, url: string, config?: AxiosRequestConfig) {
        return this.request(
            Object.assign(config || {}, {
                method,
                url
            })
        )
    }

    _requestMethodWidthData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request(
          Object.assign(config || {}, {
            method,
            url,
            data
          })
        )
    }
}
