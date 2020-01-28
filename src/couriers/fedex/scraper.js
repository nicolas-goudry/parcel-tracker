import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function fedexScraper (data) {
  if (!data) {
    throw errors.noData
  }

  const pkg = get(data, 'TrackPackagesResponse.packageList[0]')

  if (pkg && pkg.isInvalid) {
    throw errors.notFound
  }

  const err = get(pkg, 'errorList[0].message')

  if (err) {
    throw errors.unknown(err)
  }

  if (pkg && pkg.scanEventList) {
    return pkg.scanEventList
  }

  throw errors.notFound
}

export default scrape
