import joi from '@hapi/joi'

const stepRule = joi
  .object()
  .keys({
    status: joi
      .string()
      .required()
      .label('Step status'),
    location: joi
      .string()
      .allow(null)
      .required()
      .label('Step location'),
    datetime: joi
      .date()
      .timestamp('javascript')
      .required()
      .label('Step datetime')
  })
  .label('Parcel step')

const rules = {
  number: joi
    .string()
    .required()
    .label('Parcel number'),
  courier: joi
    .string()
    .required()
    .label('Parcel courier'),
  step: stepRule,
  steps: joi
    .array()
    .items(stepRule)
    .required()
    .label('Parcel steps')
}

export default rules
