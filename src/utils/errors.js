import invariant from 'tiny-invariant'

export default {
  notFound: Error('notFound'),
  noData: Error('noData'),
  zipCode: Error('zipCode'),
  unknown: function unknownError (err) {
    invariant(!err, `UNKNOWN ERROR\n\n${err}`)

    return Error('unknown')
  },
  internal: function internalError (err) {
    invariant(!err, `${this.id}: INTERNAL ERROR\n\n${err}`)

    return Error('internal')
  }
}
