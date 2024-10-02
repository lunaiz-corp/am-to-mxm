/* eslint-disable import/prefer-default-export, no-console, arrow-body-style */

export const Logger = {
  debug: (message: string, object: unknown = '', style: string = '') => {
    console.debug(
      `%cDEBUG%c${message}`,
      Logger.genStyle('cyan'),
      `font-family: "Wanted Sans Variable", "SUIT Variable", "Pretendard Variable", sans-serif;${style}`,
      object,
    );
  },
  info: (message: string, object: unknown = '', style: string = '') => {
    console.info(
      `%cINFO%c${message}`,
      Logger.genStyle('white'),
      `font-family: "Wanted Sans Variable", "SUIT Variable", "Pretendard Variable", sans-serif;${style}`,
      object,
    );
  },
  warn: (message: string, object: unknown = '', style: string = '') => {
    console.warn(
      `%cWARN%c${message}`,
      Logger.genStyle('yellow'),
      `font-family: "Wanted Sans Variable", "SUIT Variable", "Pretendard Variable", sans-serif;${style}`,
      object,
    );
  },
  error: (message: string, object: unknown = '', style: string = '') => {
    console.error(
      `%cERROR%c${message}`,
      Logger.genStyle('red', 'white'),
      `font-family: "Wanted Sans Variable", "SUIT Variable", "Pretendard Variable", sans-serif;${style}`,
      object,
    );
  },
  genStyle: (bg: string, text: string = 'black') => {
    return `color: ${text}; background: ${bg}; padding: 1px 3px; border-radius: 2px; margin-right: 5px;`;
  },
};
