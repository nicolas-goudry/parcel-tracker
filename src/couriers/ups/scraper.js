import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function upsScraper (data) {
  if (!data) {
    throw errors.noData
  }

  const pkg = get(data, 'trackDetails[0].shipmentProgressActivities')

  if (pkg) {
    return pkg
  }

  throw errors.notFound
}

export default scrape
