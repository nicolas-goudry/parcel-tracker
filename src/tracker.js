import couriers from './couriers'
import errors from './utils/errors'

const track = async (courier = {}, number) => {
  if (Object.keys(couriers).indexOf(courier) === -1) {
    throw errors.invalidCourier
  }

  if (!number) {
    throw errors.input
  }

  return couriers[courier](number)
}

export default track
