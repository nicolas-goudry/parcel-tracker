import errors from '../../utils/errors'

const scrape = (data) => {
  if (!data) {
    throw errors.input
  }

  const pkg = data.TrackPackagesResponse &&
    data.TrackPackagesResponse.packageList &&
    data.TrackPackagesResponse.packageList[0]

  if (pkg.isInvalid) {
    throw errors.notFound
  }

  const err = pkg && pkg.errorList && pkg.errorList[0] && pkg.errorList[0].code !== ''

  if (err) {
    throw Error(pkg.errorList[0].message)
  }

  if (pkg && pkg.scanEventList) {
    return pkg
  }

  throw errors.notFound
}

export default scrape
