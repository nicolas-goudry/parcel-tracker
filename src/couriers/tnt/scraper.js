import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = function tntScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  log('parsing html data for processing')

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  log('searching for parcel data')

  if (parsedData('.result__content .roster').length > 0) {
    log('returning parcel data')

    return parsedData('.result__content .roster[class*=tnt]')
  } else {
    const pkg = data['tracker.output']
    const consignments = pkg && pkg.consignment

    if (consignments && consignments.length) {
      consignments.sort(
        (a, b) => +new Date(b.originDate) - +new Date(a.originDate)
      )

      if (consignments[0].events && consignments[0].events.length) {
        log('returning parcel data')

        return pkg.consignment[0]
      }
    }
  }

  log('no parcel data found')

  throw errors.notFound
}

export default scrape
