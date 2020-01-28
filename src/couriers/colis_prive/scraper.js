import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = function colisPriveScraper (data) {
  if (!data) {
    throw errors.noData
  }

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  if (parsedData('.tableHistoriqueColis').length === 0) {
    throw errors.notFound
  }

  return parsedData('.tableHistoriqueColis tr.bandeauText')
}

export default scrape
