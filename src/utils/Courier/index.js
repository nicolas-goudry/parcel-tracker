import joi from '@hapi/joi'
import createDebugger from 'debug'

import rules from './validation'

/**
 * This class defines Courier model and functions
 */
export default class Courier {
  /**
   * Creates a courier from given parameters
   *
   * @param {!String} id
   * @param {!String} name
   * @param {!Array<!RegExp>} matchers Regular expressions of courier’s tracking number patterns
   *
   * @throws {ValidationError} Joi validation error
   * @see https://hapi.dev/family/joi/api/?v=16.1.8#validationerror
   *
   * @returns {Courier}
   */
  constructor (id, name, matchers) {
    this.id = joi.attempt(id, rules.id)
    this.name = joi.attempt(name, rules.name)
    this.matchers = joi.attempt(matchers, rules.matchers)

    return this
  }

  /**
   * Must be override by each instance.
   * Should be called by overriding function to validate `number`
   *
   * @param {!String} number Tracking number to track
   *
   * @throws {ValidationError} Joi validation error
   * @see https://hapi.dev/family/joi/api/?v=16.1.8#validationerror
   */
  track (
    number,
    log = createDebugger(`parcel-tracker:${this.id.toLowerCase()}`)
  ) {
    this.log = log

    this.log('validate tracking number')

    joi.assert(number, rules.number)
  }
}
