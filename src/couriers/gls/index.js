import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'GLS',
  label: 'GLS',
  matcher: [
    /\b(\w{7}[A-Z])\b/i, // AB01234D
    /\b(\d{14,15})\b/i, // 01234567890123 or 012345678901234
    /\b(\d{10,12})\b/i, // 0123456789 or 01234567890 or 012345678901
    /\b(\d{20})\b/i, // 01234567890123456789
    /\b(\w{2}\d{9}\w{2})\b/i // 7D012345678D2
  ]
}

const fetchParams = (number) => ({
  method: 'get',
  url: `https://gls-group.eu/app/service/open/rest/FR/fr/rstt001?match=${number}`,
  responseType: 'json'
})

const track = async (number) => {
  let response

  try {
    response = await axios(fetchParams(number))
  } catch (err) {
    if (err.response && err.response.status === 404 && err.response.data) {
      throw errors.notFound
    }

    throw err
  }

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps: format(scrape(response.data))
  }
}

export default track
