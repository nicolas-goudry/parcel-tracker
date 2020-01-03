import axios from 'axios'

import format from './formatter'
import scrape from './scraper'

export const metadata = {
  id: 'CHRONOPOST',
  label: 'Chronopost',
  matcher: [
    /\b(\w{2}\d{9}\w{2})\b/i, // XX000000000XX
    /\b(\w{2}\d{13})\b/i, // XX0000000000000
    /\b(\d{14}\w)\b/i // 00000000000000
  ]
}

const fetchParams = (number) => ({
  method: 'get',
  url: `http://quickservices.chronopost.fr/servletSuiviXML?langue=fr_FR&privacy=W&infosPlus=true&listeNumerosLT=${number}`
})

const track = async (number) => {
  const response = await axios(fetchParams(number))
  const rawSteps = await scrape(response.data)

  return {
    ...metadata,
    number,
    steps: format(rawSteps)
  }
}

export default track
