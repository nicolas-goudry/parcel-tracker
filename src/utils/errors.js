import invariant from 'tiny-invariant'

export default {
  notFound: Error('notFound'),
  noData: Error('noData'),
  zipCode: Error('zipCode'),
  internalInvariant: function internalInvariantError (err) {
    invariant(!err, `${this.id}: INTERNAL ERROR\n\n${err}`)

    throw Error('internal')
  }
}
