import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  if (data.codeErreur === 'err.envoi.non.trouve') {
    throw errors.notFound
  }

  if (data.codeErreur) {
    throw Error(`[${data.codeErreur}] ${data.texteErreur}`)
  }

  const pkg = data.result

  if (pkg && pkg.historiquesExpedition && pkg.historiquesExpedition.length) {
    return pkg
  }

  throw errors.notFound
}

export default scrape
