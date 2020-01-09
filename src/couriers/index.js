import CHRONOPOST, { metadata as chronopostMetadata } from './chronopost'
import COLIS_PRIVE, { metadata as colisPriveMetadata } from './colis_prive'
import DHL, { metadata as dhlMetadata } from './dhl'
import DPD, { metadata as dpdMetadata } from './dpd'
import FEDEX, { metadata as fedexMetadata } from './fedex'
import GLS, { metadata as glsMetadata } from './gls'
import MONDIAL_RELAY, { metadata as mondialRelayMetadata } from './mondial_relay'
import TNT, { metadata as tntMetadata } from './tnt'
import UPS, { metadata as upsMetadata } from './ups'

export const metadata = {
  [chronopostMetadata.id]: chronopostMetadata,
  [colisPriveMetadata.id]: colisPriveMetadata,
  [dhlMetadata.id]: dhlMetadata,
  [dpdMetadata.id]: dpdMetadata,
  [fedexMetadata.id]: fedexMetadata,
  [glsMetadata.id]: glsMetadata,
  [mondialRelayMetadata.id]: mondialRelayMetadata,
  [tntMetadata.id]: tntMetadata,
  [upsMetadata.id]: upsMetadata
}

export default {
  CHRONOPOST,
  COLIS_PRIVE,
  DHL,
  DPD,
  FEDEX,
  GLS,
  MONDIAL_RELAY,
  TNT,
  UPS
}
