import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  const pkg = data.trackDetails && data.trackDetails[0]

  if (pkg && pkg.shipmentProgressActivities) {
    return pkg.shipmentProgressActivities
  }

  throw errors.notFound
}

export default scrape
