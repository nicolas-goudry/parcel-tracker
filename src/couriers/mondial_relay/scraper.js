import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  const parsedData = cheerio.load(data, { ignoreWhitespace: true })

  if (parsedData('#suivie_mon_colis .infos-account').length === 0) {
    throw errors.notFound
  }

  return parsedData('#suivie_mon_colis .infos-account .detail-infos > .step-suivi')
}

export default scrape
