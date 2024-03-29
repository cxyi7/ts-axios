import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancel: Cancel', () => {
  test('should returns correct result when message is specified', () => {
    const cancel = new Cancel('option has been canceled')
    expect(cancel.message).toBe('option has been canceled')
  })

  test('should returns true if value is a cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should returns false if value is not a cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
