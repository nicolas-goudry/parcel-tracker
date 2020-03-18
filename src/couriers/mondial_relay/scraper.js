import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = function mondialRelayScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  log('parsing html data for processing')

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  log('searching for parcel data')

  if (parsedData('#suivie_mon_colis .infos-account').length === 0) {
    log('no parcel data found')

    throw errors.notFound
  }

  log('returning parcel data')

  return parsedData('#suivie_mon_colis .infos-account .detail-infos > .step-suivi')
}

export default scrape
