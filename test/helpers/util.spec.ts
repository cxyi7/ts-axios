import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/util'

describe('helpers:util', () => {
  describe('isXXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
      expect(isPlainObject(null)).toBeFalsy()
    })

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
      expect(isFormData('')).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 1 }

      extend(a, b)
      expect(a.foo).toBe(1)
    })

    test('should extend properties', () => {
      const a = { foo: 1, bar: 2 }
      const b = { bar: 3 }
      const c = extend(a, b)

      expect(c.foo).toBe(1)
      expect(c.bar).toBe(3)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 1 }
      const c: any = { bar: 2 }
      deepMerge(a, b, c)

      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })

    test('should deepMerge properties', () => {
      const a = { foo: 1 }
      const b = { bar: 2 }
      const c = { foo: 3 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(3)
      expect(d.bar).toBe(2)
    })

    test('should deepMerge recursively', () => {
      const a = { foo: { bar: 1 } }
      const b = { foo: { baz: 2 }, bar: { quz: 3 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 1,
          baz: 2
        },
        bar: {
          quz: 3
        }
      })
    })

    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 1 } }
      const b = {}
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 1
        }
      })

      expect(c.foo).not.toBe(a.foo)
    })

    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 1 })).toEqual({ foo: 1 })
      expect(deepMerge({ foo: 1 }, undefined)).toEqual({ foo: 1 })

      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 1 })).toEqual({ foo: 1 })
      expect(deepMerge({ foo: 1 }, null)).toEqual({ foo: 1 })
    })
  })
})
