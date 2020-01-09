import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'TNT',
  label: 'TNT',
  matcher: [
    /\b(\d{9})\b/i, // 012345678
    /\b(\d{16})\b/i // 0123456789012345
  ]
}

const fetchParams = (number) => [{
  method: 'get',
  url: `https://www.tnt.com/api/v3/shipment?searchType=CON&locale=fr_FR&con=${number}`,
  responseType: 'json'
}, {
  method: 'get',
  url: `https://www.tnt.fr/public/suivi_colis/recherche/visubontransport.do?radiochoixrecherche=BT&radiochoixtypeexpedition=NAT&bonTransport=${number}`,
  responseType: 'text'
}]

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
