import moment from 'moment'

/**
 * Convert date string to timestamp
 * @param {String} datetime Date to format
 * @param {String} dateFormat String representing date format
 * @param {String} locale Locale to use
 * @returns {Number} Date as timestamp
 */
export const parseDatetime = (datetime, format, locale = 'fr') => +moment(datetime, format, locale)
