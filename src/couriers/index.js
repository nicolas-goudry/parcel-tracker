import CHRONOPOST, { metadata as chronopostMetadata } from './chronopost'
import COLIS_PRIVE, { metadata as colisPriveMetadata } from './colis_prive'

export const metadata = {
  [chronopostMetadata.id]: chronopostMetadata,
  [colisPriveMetadata.id]: colisPriveMetadata,
}

export default {
  CHRONOPOST,
  COLIS_PRIVE,
}
