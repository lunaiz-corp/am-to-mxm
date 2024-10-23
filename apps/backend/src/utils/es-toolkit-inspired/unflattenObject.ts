/* eslint-disable import/prefer-default-export, @typescript-eslint/no-explicit-any */
function unflattenObjectImpl(flatObject: Record<string, any>): object {
  const result: any = {};

  Object.keys(flatObject).forEach((flatKey) => {
    const keys = flatKey.split('__');
    let current = result;

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        current[key] = flatObject[flatKey];
      } else {
        if (!current[key]) {
          current[key] = Number.isNaN(Number(keys[i + 1])) ? {} : [];
        }
        current = current[key];
      }
    }
  });

  return result;
}

export function unflattenObject(object: object): Record<string, any> {
  return unflattenObjectImpl(object);
}
