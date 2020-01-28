import Joi from '@hapi/joi'

const joi = Joi.extend((joi) => {
  return {
    type: 'regex',
    base: joi.any(),
    messages: {
      'regex.base': '"{{#label}}" must be an instance of RegExp'
    },
    validate (value, helpers) {
      if (!(value instanceof RegExp)) {
        return { value, errors: helpers.error('regex.base') }
      }
    }
  }
})

const rules = {
  id: joi
    .string()
    .pattern(/^[A-Z_]+$/)
    .required()
    .label('Courier identifier'),
  name: joi
    .string()
    .required()
    .label('Courier name'),
  matchers: joi
    .array()
    .items(
      joi
        .regex()
        .required()
        .label('Courier matcher value')
    )
    .single()
    .required()
    .label('Courier matchers'),
  number: joi
    .string()
    .required()
    .label('Tracking number')
}

export default rules
