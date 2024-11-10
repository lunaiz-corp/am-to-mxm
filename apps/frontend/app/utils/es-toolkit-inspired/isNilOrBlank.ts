/* eslint-disable import/prefer-default-export */
import { isNil } from 'es-toolkit/predicate';

function isNilOrBlankImpl(value: string): boolean {
  return isNil(value) || value.trim() === '';
}

export function isNilOrBlank(value: string): boolean {
  return isNilOrBlankImpl(value);
}
