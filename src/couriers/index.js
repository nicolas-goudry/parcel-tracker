import CHRONOPOST, { metadata as chronopostMetadata } from './chronopost'
import COLIS_PRIVE, { metadata as colisPriveMetadata } from './colis_prive'
import DHL, { metadata as dhlMetadata } from './dhl'

export const metadata = {
  [chronopostMetadata.id]: chronopostMetadata,
  [colisPriveMetadata.id]: colisPriveMetadata,
  [dhlMetadata.id]: dhlMetadata
}

export default {
  CHRONOPOST,
  COLIS_PRIVE,
  DHL
}
