import cheerio from 'cheerio'

import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  if (typeof data === 'string') {
    const parsedData = cheerio.load(data, { ignoreWhitespace: true })

    if (parsedData('table#tableTrace tr[id^=ligneTableTrace]').length === 0) {
      throw errors.notFound
    }

    return parsedData('table#tableTrace tr[id^=ligneTableTrace]')
  } else {
    const pkg = data && data.parcellifecycleResponse && data.parcellifecycleResponse.parcelLifeCycleData

    if (pkg && pkg.scanInfo) {
      return pkg.scanInfo
    }
  }

  throw errors.notFound
}

export default scrape
