import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function laPosteScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  if (data.returnCode !== 200) {
    log('courier error: returnCode not 200')

    throw errors.notFound
  }

  log('searching for parcel data')

  if (get(data, 'shipment.event.length')) {
    log('returning parcel data')

    return data.shipment.event
  }

  log('no parcel data found')

  throw errors.notFound
}

export default scrape
