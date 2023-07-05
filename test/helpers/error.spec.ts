import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/type'

describe('helpers:error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: {
        foo: 'baz'
      }
    }

    const error = createError('cool', config, 'SOMETING', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('cool')
    expect(error.config).toEqual(config)
    expect(error.code).toBe('SOMETING')
    expect(error.request).toEqual(request)
    expect(error.response).toEqual(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
