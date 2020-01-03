import axios from 'axios'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'COLIS_PRIVE',
  label: 'Colis Privé',
  matcher: [
    /\b(\d{17})\b/i // 00000000000000000
  ]
}

const fetchParams = (number) => ({
  method: 'get',
  url: `https://www.colisprive.com/moncolis/pages/detailColis.aspx?numColis=PS0000124616${number}`,
  responseType: 'text'
})

const track = async (number) => {
  const response = await axios(fetchParams(number))

  return {
    ...metadata,
    number,
    steps: format(scrape(response.data))
  }
}

export default track
