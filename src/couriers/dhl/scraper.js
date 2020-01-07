import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  if (data.meta && data.meta.error) {
    throw errors.notFound
  } else if (data.errors) {
    throw errors.notFound
  }

  if (data.results && data.results[0]) {
    const pkg = data.results[0]

    if (pkg && pkg.checkpoints) {
      return pkg
    }
  } else if (data.data.mailItems && data.data.mailItems[0]) {
    const pkg = data.data.mailItems[0]

    if (pkg && pkg.events) {
      return pkg
    }
  }

  throw errors.notFound
}

export default scrape
