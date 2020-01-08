import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'FEDEX',
  label: 'Fedex',
  matcher: [
    /\b(\d{10})\b/i, // 0000000000
    /\b(\d{12})\b/i, // 000000000000
    /\b(\d{15})\b/i, // 000000000000000
    /\b(\d{22})\b/i // 0000000000000000000000
  ]
}

const fetchParams = (number) => {
  const params = new URLSearchParams()

  params.append(
    'data',
    `{"TrackPackagesRequest":{"appType":"WTRK","appDeviceType":"DESKTOP","uniqueKey":"","processingParameters":{},"trackingInfoList":[{"trackNumberInfo":{"trackingNumber":"${number}","trackingQualifier":"","trackingCarrier":""}}]}}`
  )
  params.append('action', 'trackpackages')
  params.append('locale', 'fr_FR')
  params.append('version', '1')
  params.append('format', 'json')

  return {
    method: 'post',
    url: 'https://www.fedex.com/trackingCal/track',
    data: params.toString(),
    responseType: 'json'
  }
}

const track = async (number) => {
  const response = await axios(fetchParams(number))

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps: format(scrape(response.data))
  }
}

export default track
