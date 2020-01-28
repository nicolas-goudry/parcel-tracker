import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function glsScraper (data) {
  if (!data) {
    throw errors.noData
  }

  const pkg = get(data, 'tuStatus[0].history')

  if (pkg && pkg.length) {
    return pkg
  }

  throw errors.notFound
}

export default scrape
