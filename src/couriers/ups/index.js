import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'UPS',
  label: 'UPS',
  matcher: [
    /\b(\w\d{10})\b/i, // A0123456789
    /\b(\d{26})\b/i, // 01234567890123456789012345
    /\b(\d{18})\b/i, // 012345678901234567
    /\b(\d{9})\b/i, // 012345678
    /\b(1Z\w{16})\b/i // 1Z0123456789ABCDEF
  ]
}

const fetchParams = (number) => ({
  method: 'post',
  url: 'https://www.ups.com/track/api/Track/GetStatus?loc=fr_FR',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    Locale: 'fr_FR',
    TrackingNumber: [number]
  },
  responseType: 'json'
})

const track = async (number) => {
  const response = await axios(fetchParams(number))

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps: format(scrape(response.data))
  }
}

export default track
