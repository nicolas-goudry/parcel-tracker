import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function upsScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  log('searching for parcel data')

  const pkg = get(data, 'trackDetails[0].shipmentProgressActivities')

  if (pkg) {
    log('returning parcel data')

    return pkg
  }

  log('no parcel data found')

  throw errors.notFound
}

export default scrape
