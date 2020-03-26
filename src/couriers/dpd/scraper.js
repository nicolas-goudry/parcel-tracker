import cheerio from 'cheerio'

import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function dpdScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  if (typeof data === 'string') {
    log('parsing html data for processing')

    const parsedData = cheerio.load(data, { ignoreWhitespace: true })

    log('searching for parcel data')

    if (parsedData('table#tableTrace tr[id^=ligneTableTrace]').length === 0) {
      log('no parcel data found')

      throw errors.notFound
    }

    log('returning parcel data')

    return parsedData('table#tableTrace tr[id^=ligneTableTrace]')
  } else {
    log('searching for parcel data')

    const pkg = get(
      data,
      'parcellifecycleResponse.parcelLifeCycleData.scanInfo'
    )

    if (pkg) {
      log('returning parcel data')

      return pkg
    }

    log('no parcel data found')
  }

  throw errors.notFound
}

export default scrape
