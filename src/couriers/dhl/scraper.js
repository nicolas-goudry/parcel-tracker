import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function dhlScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  log('searching for courier error')

  const error = get(data, 'meta.error') || data.errors

  if (error) {
    log('courrier error:')
    log(error)

    throw errors.notFound
  }

  let pkg = get(data, 'results[0]')

  if (pkg && pkg.checkpoints) {
    log('no error found, returning parcel data')

    return pkg
  } else {
    log('no error found, searching for parcel data')

    pkg = get(data, 'data.mailItems[0]')

    if (pkg && pkg.events) {
      log('returning parcel data')

      return pkg
    }

    log('no parcel data found')
  }

  throw errors.notFound
}

export default scrape
