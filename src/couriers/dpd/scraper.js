import cheerio from 'cheerio'

import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function dpdScraper (data) {
  if (!data) {
    throw errors.noData
  }

  if (typeof data === 'string') {
    const parsedData = cheerio.load(data, { ignoreWhitespace: true })

    if (parsedData('table#tableTrace tr[id^=ligneTableTrace]').length === 0) {
      throw errors.notFound
    }

    return parsedData('table#tableTrace tr[id^=ligneTableTrace]')
  } else {
    const pkg = get(data, 'parcellifecycleResponse.parcelLifeCycleData.scanInfo')

    if (pkg) {
      return pkg
    }
  }

  throw errors.notFound
}

export default scrape
