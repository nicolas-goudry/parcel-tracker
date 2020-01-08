import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'DPD',
  label: 'DPD',
  matcher: [
    /\b(\d{14,16})\b/i // 00000000000000, 000000000000000, 0000000000000000
  ]
}

const fetchParams = (number) => [
  {
    method: 'get',
    url: `https://tracking.dpd.de/rest/plc/fr_FR/${number}`,
    responseType: 'json'
  },
  {
    method: 'get',
    url: `http://www.dpd.fr/trace/${number}`,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
    },
    responseType: 'text'
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
    throw error
  }

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps
  }
}

export default track
