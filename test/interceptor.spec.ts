import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helpers'

describe('interceptors', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a request interceptor', () => {
    const instance = axios.create()

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.test = 'hello  world'
      return config
    })

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('hello  world')
    })
  })

  test('should a requeset interceptor that a new config object', () => {
    const instance = axios.create()

    instance.interceptors.request.use(() => {
      return {
        url: '/baz',
        method: 'post'
      }
    })

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
      expect(request.url).toBe('/baz')
    })
  })

  test('should add a request interceptor that returns a promsie', done => {
    const instance = axios.create()

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })

    instance('/foo')

    setTimeout(() => {
      getAjaxRequest().then(request => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  test('should add mutilple request interceptors', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test1 = '1'
      return config
    })

    instance.interceptors.request.use(config => {
      config.headers.test2 = '2'
      return config
    })

    instance.interceptors.request.use(config => {
      config.headers.test3 = '3'
      return config
    })

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test1).toBe('1')
      expect(request.requestHeaders.test2).toBe('2')
      expect(request.requestHeaders.test3).toBe('3')
    })
  })

  test('should add a response interceptor', done => {
    let respose: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + ' - modified by interceptor'
      return data
    })

    instance('/foo').then(data => {
      respose = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(respose.data).toBe('OK - modified by interceptor')
      done()
    }, 100)
  })

  test('should add a response interceptor that returns a new data object', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(() => {
      return {
        data: 'baz',
        headers: null,
        status: 500,
        request: null,
        statusText: 'ERROR',
        config: {}
      }
    })

    instance('/foo').then(res => (response = res))

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('baz')
      expect(response.headers).toBeNull()
      expect(response.status).toBe(500)
      expect(response.statusText).toBe('ERROR')
      expect(response.request).toBeNull()
      expect(response.config).toEqual({})

      done()
    }, 100)
  })

  test('should add a response interceptor that returns a promise', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      return new Promise(resolve => {
        // do something async
        setTimeout(() => {
          data.data = 'you have been promised!'
          resolve(data)
        }, 10)
      })
    })

    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100)
    })
  })

  test('should add multiple response interceptors', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('OK123')
      done()
    }, 100)
  })

  test('should allow removing interceptors', done => {
    let response: AxiosResponse
    let intercept
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    intercept = instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(5)

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK13')
        done()
      }, 100)
    })
  })
})
