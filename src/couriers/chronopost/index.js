import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  return {
    method: 'get',
    url: `http://quickservices.chronopost.fr/servletSuiviXML?langue=fr_FR&privacy=W&infosPlus=true&listeNumerosLT=${number}`
  }
}

class Chronopost extends Courier {
  async track (number, log) {
    super.track(number, log)

    this.log('performing http call to retrieve tracking data')

    const response = await axios(makeOpts(number)).catch((err) => {
      this.log('failed to retrieve tracking data')
      this.log(err)

      throw errors.internal.call(this, err)
    })

    this.log('data retrieved')

    const steps = await scrape(response.data, this.log)
    const parcel = Parcel({
      id: number,
      courier: this.id,
      steps: format(steps, this.log)
    })

    this.log('tracking result')
    this.log(parcel)

    return parcel
  }
}

const chronopost = new Chronopost('CHRONOPOST', 'Chronopost', [
  /\b(\w{2}\d{9}\w{2})\b/i, // XX000000000XX
  /\b(\w{2}\d{13})\b/i, // XX0000000000000
  /\b(\d{14}\w)\b/i // 00000000000000
])

export default chronopost
