import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = function tntScraper (data) {
  if (!data) {
    throw errors.input
  }

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  if (parsedData('.result__content .roster').length > 0) {
    return parsedData('.result__content .roster[class*=tnt]')
  } else {
    const pkg = data['tracker.output']
    const consignments = pkg && pkg.consignment

    if (consignments && consignments.length) {
      consignments.sort((a, b) => +new Date(b.originDate) - +new Date(a.originDate))

      if (consignments[0].events && consignments[0].events.length) {
        return pkg.consignment[0]
      }
    }
  }

  throw errors.notFound
}

export default scrape
