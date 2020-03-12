import joi from '@hapi/joi'

import rules from './validation'

/**
 * Creates a parcel from given parameters
 *
 * @param {Object} data Information about parcel
 * @param {!String} data.id Tracking number
 * @param {!String} data.courier Courier name
 * @param {!Array.{status: !String, location: ?String, datetime: !Number}} data.steps Parcel steps
 * @param {?String} data.lang Parcel steps language
 *
 * @throws {ValidationError} Joi validation error
 * @see https://hapi.dev/family/joi/api/?v=16.1.8#validationerror
 *
 * @returns {Object} Built parcel object
 */
const Parcel = (data, options) => {
  const _data = joi.attempt(
    data,
    joi.object().keys({
      lang: rules.lang,
      id: rules.number,
      courier: rules.courier,
      steps: rules.steps
    })
  )

  return {
    lang: _data.lang,
    scope: 'public',
    returnCode: 200,
    shipment: {
      idShip: _data.id,
      product: _data.courier,
      isFinal: false, // @TODO
      event: _data.steps.map((step, i) => ({
        order: _data.steps.length - i,
        date: step.datetime,
        location: step.location,
        label: step.status
      }))
    }
  }
}

export default Parcel
