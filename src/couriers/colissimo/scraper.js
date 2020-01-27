import errors from '../../utils/errors'

const scrape = function colissimoScrapper (data) {
  if (!data) {
    throw errors.noData
  }

  if (data.returnCode !== 200) {
    throw errors.notFound
  }

  if (data.shipment && data.shipment.event && data.shipment.event.length) {
    return data.shipment.event
  }

  throw errors.notFound
}

export default scrape
