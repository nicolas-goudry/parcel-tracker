import joi from '@hapi/joi'

import rules from './validation'

/**
 * Function to make a sort function from a given ordering
 *
 * @param {Number} order Sort “direction”
 *
 * @returns {Function}
 */
const sortFn = function makeSortFnFromOrder (order) {
  return function sortFn ({ datetime: a }, { datetime: b }) {
    return a < b ? order : a > b ? -order : 0
  }
}

/**
 * This class defines Parcel model and functions
 */
export default class Parcel {
  /**
   * Creates a parcel from given parameters
   *
   * @param {!String} number Tracking number
   * @param {!String} courier Courier name
   * @param {!Array.{status: !String, location: ?String, datetime: !Number}} steps Array of steps
   * @param {?{chrono: ?Boolean}} options Constructor options
   * @param {?Boolean} options.chrono If true, parcel steps will be sorted from oldest to newest
   *
   * @throws {ValidationError} Joi validation error
   * @see https://hapi.dev/family/joi/api/?v=16.1.8#validationerror
   *
   * @returns {Parcel}
   */
  constructor (number, courier, steps, { chrono = true } = { chrono: true }) {
    this.number = joi.attempt(number, rules.number)
    this.courier = joi.attempt(courier, rules.courier)
    this.steps = joi.attempt(steps, rules.steps)

    joi.assert(
      chrono,
      joi
        .bool()
        .required()
        .label('Chrono flag')
    )

    // We bind first argument of `addStep` relatively to `options.chrono` value
    this.addStep = this.addStep.bind(this, chrono ? -1 : 1)

    return this
  }

  /**
   * Add step to Parcel instance
   *
   * @param {!Number} order Sort order
   * @param {!{status: !String, location: ?String, datetime: !Number}} step Step data to add
   *
   * @throws {ValidationError} Joi validation error
   * @see https://hapi.dev/family/joi/api/?v=16.1.8#validationerror
   *
   * @returns {Parcel}
   */
  addStep (order, { status, datetime, location = null }) {
    this.steps.push(joi.attempt({ status, datetime, location }, rules.step))

    this.steps = this.steps.sort(sortFn(order))

    return this
  }
}
