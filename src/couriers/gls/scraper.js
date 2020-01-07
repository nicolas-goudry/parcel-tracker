import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  const pkg = data.tuStatus && data.tuStatus[0]

  if (pkg && pkg.history && pkg.history.length) {
    return pkg.history
  }

  throw errors.notFound
}

export default scrape
