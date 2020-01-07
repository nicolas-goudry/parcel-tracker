import CHRONOPOST, { metadata as chronopostMetadata } from './chronopost'
import COLIS_PRIVE, { metadata as colisPriveMetadata } from './colis_prive'
import DHL, { metadata as dhlMetadata } from './dhl'
import DPD, { metadata as dpdMetadata } from './dpd'
import FEDEX, { metadata as fedexMetadata } from './fedex'
import GLS, { metadata as glsMetadata } from './gls'

export const metadata = {
  [chronopostMetadata.id]: chronopostMetadata,
  [colisPriveMetadata.id]: colisPriveMetadata,
  [dhlMetadata.id]: dhlMetadata,
  [dpdMetadata.id]: dpdMetadata,
  [fedexMetadata.id]: fedexMetadata,
  [glsMetadata.id]: glsMetadata
}

export default {
  CHRONOPOST,
  COLIS_PRIVE,
  DHL,
  DPD,
  FEDEX,
  GLS
}
