export default {
  notFound: Error('notFound'),
  noData: Error('noData'),
  zipCode: Error('zipCode'),
  unknown: function unknownError (err, log) {
    if (process.env.NODE_ENV !== 'production') {
      log(`UNKNOWN ERROR\n\n${err}`)

      return Error(err.message)
    }

    return Error('unknown')
  },
  internal: function internalError (err) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(`${this.id}: INTERNAL ERROR\n\n${err}`)

      return Error(err.message)
    }

    return Error('internal')
  }
}
