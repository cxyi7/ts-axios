import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helpers'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform JSON to string', () => {
    const data = {
      foo: 'baz'
    }
    axios.post('/foo', data)
    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"baz"}')
    })
  })

  test('should transform string to JSON', done => {
    let response: AxiosResponse

    axios('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo":"baz"}'
      })
    })

    setTimeout(() => {
      expect(typeof response.data).toBe('object')
      expect(response.data.foo).toBe('baz')
      done()
    }, 100)
  })

  test('should override default transform', () => {
    const data = {
      foo: 'baz'
    }
    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toEqual({ foo: 'baz' })
    })
  })

  test('should allow an Array of transformers', () => {
    const data = {
      foo: 'baz'
    }
    axios.post('/foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(
        data
      ) {
        return data.replace('baz', 'bar')
      })
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"bar"}')
    })
  })

  test('should allowing mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    axios('/foo', {
      transformRequest: (data, header) => {
        header['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
