import get from 'lodash.get'

import errors from '../../utils/errors'

const scrape = function laPosteScraper (data) {
  if (!data) {
    throw errors.noData
  }

  if (data.returnCode !== 200) {
    throw errors.notFound
  }

  if (get(data, 'shipment.event.length')) {
    return data.shipment.event
  }

  throw errors.notFound
}

export default scrape
