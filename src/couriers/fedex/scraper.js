import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function fedexScraper (data, log) {
  log('scraping data')

  if (!data) {
    log('no data to scrape')

    throw errors.noData
  }

  const pkg = get(data, 'TrackPackagesResponse.packageList[0]')

  log('searching for courier error')

  if (pkg && pkg.isInvalid) {
    log('courrier error: pkg is invalid')

    throw errors.notFound
  }

  const err = get(pkg, 'errorList[0].message')

  if (err) {
    log('courrier error:')
    log(err)

    throw errors.unknown(err, log)
  }

  log('searching for parcel data')

  if (pkg && pkg.scanEventList) {
    log('returning parcel data')

    return pkg.scanEventList
  }

  log('no parcel data found')

  throw errors.notFound
}

export default scrape
