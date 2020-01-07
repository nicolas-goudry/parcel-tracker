import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  if (parsedData('.tableHistoriqueColis').length === 0) {
    throw errors.notFound
  }

  return parsedData('.tableHistoriqueColis tr.bandeauText')
}

export default scrape
