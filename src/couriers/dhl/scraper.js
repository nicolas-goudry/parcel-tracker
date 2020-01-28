import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function dhlScraper (data) {
  if (!data) {
    throw errors.noData
  }

  if (get(data, 'meta.error') || data.errors) {
    throw errors.notFound
  }

  let pkg = get(data, 'results[0]')

  if (pkg && pkg.checkpoints) {
    return pkg
  } else {
    pkg = get(data, 'data.mailItems[0]')

    if (pkg && pkg.events) {
      return pkg
    }
  }

  throw errors.notFound
}

export default scrape
