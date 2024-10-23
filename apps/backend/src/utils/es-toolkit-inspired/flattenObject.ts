/* eslint-disable no-continue, import/prefer-default-export, @typescript-eslint/no-explicit-any */
import { isPlainObject } from 'es-toolkit/predicate';

/**
 * Flattens a nested object into a single level object with dot-separated keys.
 *
 * @param {object} object - The object to flatten.
 * @returns {Record<string, any>} - The flattened object.
 *
 * @example
 * const nestedObject = {
 *   a: {
 *     b: {
 *       c: 1
 *     }
 *   },
 *   d: [2, 3]
 * };
 *
 * const flattened = flattenObject(nestedObject);
 * console.log(flattened);
 * // Output:
 * // {
 * //   'a.b.c': 1,
 * //   'd.0': 2,
 * //   'd.1': 3
 * // }
 */

function flattenObjectImpl(object: object, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = (object as any)[key];

    const prefixedKey = prefix ? `${prefix}__${key}` : key;

    if (isPlainObject(value) && Object.keys(value).length > 0) {
      Object.assign(result, flattenObjectImpl(value, prefixedKey));
      continue;
    }

    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        result[`${prefixedKey}__${index}`] = value[index];
      }
      continue;
    }

    result[prefixedKey] = value;
  }

  return result;
}

export function flattenObject(object: object): Record<string, any> {
  return flattenObjectImpl(object);
}
