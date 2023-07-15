import axios from '../src/index'
import { getAjaxRequest } from './helpers'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
      axios.defaults.xsrfCookieName + '=;expires=' + new Date(Date.now() - 86400000).toUTCString()
  })

  test('should not set xsrf if cookie is null', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfCookieName!]).toBeUndefined()
    })
  })

  test('should set xsrf header if cookie is set', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('123456')
    })
  })

  test('should not set xsrf header for cross origin', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('http://example.com/')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header for cross origin when withCredentials', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('http://example.com/', {
      withCredentials: true
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('123456')
    })
  })
})
