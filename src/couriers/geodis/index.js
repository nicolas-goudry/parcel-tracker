import axios from 'axios'
import request from 'request-promise'
import { sha256 } from 'js-sha256'

import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'GEODIS',
  label: 'Geodis',
  matcher: [
    /\b(\d{15})\b/i // 000000000000000
  ]
}

const selectedLanguage = 'fr'
const appKey = '21aed7a2f03d45ab9cbcd61cd7a2461d'
const fetchUrl = 'https://espace-client.geodis.com/services/api/destinataire/recherche-envoi'
const appId = '$DESTINATAIRE'

const generateGeodisServiceHeader = (url, body) => {
  const now = new Date().getTime()
  const route = url.substr(url.indexOf('api'), url.length)
  const sha = sha256(appKey + ';' + appId + ';' + now + ';' + selectedLanguage + route + JSON.stringify(body))

  return appId + ';' + now + ';' + selectedLanguage + ';' + sha
}

const fetchParams = async (number) => {
  const [trackingNumber, zipCode] = number.split(':')

  if (!zipCode) {
    throw errors.zipCode
  }

  // We make a useless request to get CSRF token
  const butterRequest = await request.get({
    url: 'https://espace-client.geodis.com/services/destinataires',
    resolveWithFullResponse: true,
    strictSSL: true
  })
  const [xsrf, nsc] = butterRequest.headers['set-cookie'].map((val) => val.split(';')[0])

  if (xsrf && nsc) {
    const data = {
      noEnvoi: trackingNumber,
      codePostal: zipCode
    }

    return {
      method: 'post',
      url: fetchUrl,
      headers: {
        Cookie: `${xsrf}; ${nsc}`,
        'X-XSRF-TOKEN': xsrf.split('=')[1],
        'X-GEODIS-Service': generateGeodisServiceHeader(fetchUrl, data)
      },
      data,
      responseType: 'json'
    }
  }

  throw Error('Could not get auth cookie')
}

const track = async (number) => {
  const params = await fetchParams(number)

  if (!params) {
    throw errors.notFound
  }

  console.log(1, 'Query parameters are')
  console.log()
  console.log(JSON.stringify(params, null, 2))
  console.log()

  let response

  try {
    response = await axios(params)
    console.log(2, 'Got HTTP response')
    console.log()
    console.log(JSON.stringify(response.data, null, 2))
    console.log()
  } catch (err) {
    console.error(3, 'Got HTTP error')
    console.error()
    console.error(JSON.stringify(err, null, 2))
    console.error()
  }

  return {
    ...metadata,
    number,
    steps: format(scrape(response.data))
  }
}

export default track
