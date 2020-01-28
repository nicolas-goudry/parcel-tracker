import errors from '../../utils/errors'

const scrape = function dhlScraper (data) {
  if (!data) {
    throw errors.noData
  }

  if ((data.meta && data.meta.error) || data.errors) {
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
