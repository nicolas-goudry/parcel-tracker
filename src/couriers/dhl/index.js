import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'DHL',
  label: 'DHL',
  matcher: [
    /\b(\d{10})\b/i, // 0000000000
    /\b(\w{4}\d{20})\b/i // XXXX00000000000000000000
  ]
}

const fetchParams = (number) => [
  {
    method: 'get',
    url: `https://www.logistics.dhl/shipmentTracking?countryCode=FR&languageCode=fr&AWB=${number}`,
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      'Accept-Language': 'fr-FR'
    },
    responseType: 'json'
  },
  {
    method: 'get',
    url: `https://www.logistics.dhl/v1/mailitems/track?number=${number}`,
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      'Accept-Language': 'fr-FR'
    },
    responseType: 'json'
  }
]

const track = async (number) => {
  let steps
  let error

  for (const opts of fetchParams(number)) {
    try {
      const response = await axios(opts)

      steps = format(scrape(response.data))

      break
    } catch (err) {
      error = err
    }
  }

  if (error && !steps) {
    if (
      error.response &&
      error.response.status === 400
    ) {
      throw errors.notFound
    }

    throw error
  }

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps
  }
}

export default track
