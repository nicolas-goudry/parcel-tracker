[standard:img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard:url]: http://standardjs.com
[mocha]: https://mochajs.org
[chai]: https://chaijs.com
[parcel]: https://parceljs.org
[babel]: https://babeljs.io
[chaiAsPromised]: https://www.chaijs.com/plugins/chai-as-promised
[semver]: http://semver.org
[tags]: https://github.com/nicolas-goudry/parcel-tracker/releases

# parcel-tracker [![Standard - JavaScript Style Guide][standard:img]][standard:url]

parcel-tracker is a Javascript library which can track parcels from numerous couriers. It can also guess courier from a tracking number.

Supported couriers are :
* Chronopost
* Colis Privé
* DHL
* DPD
* Fedex
* GLS
* La Poste (Colissimo + Courier Suivi)
* Mondial Relay
* TNT
* UPS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Building

We use [`parcel`][parcel] in order to build project. It uses [`babel`][babel] under the hood.

### Installing

parcel-tracker is hosted on a private npm registry. You need an account on this registry in order to add it as a dependency to your project. You may ask author for an access.

```shell
$ npm i -S parcel-tracker --registry http://ec2-35-171-163-20.compute-1.amazonaws.com/
```

### Usage

Here is an example on how you *could* implement a sequential auto-tracking feature:

```js
const { identify, couriers } = require('parcel-tracker')

const number = 'XJ006848316JF'
const candidates = identify(number)
// Object with 2 keys :
// - candidates: contains most probable couriers matching number
// - rest: contains other supported couriers
// { candidates: [], rest: [] }

;(async () => {
  // We process couriers keys (first 'candidates', then 'rest')
  for (const key in candidates) {
    console.log('Processing', key)

    // For each key, we try to track number with listed couriers
    for (const courier of candidates[key]) {
      process.stdout.write(`  - ${couriers[courier].name}`)

      try {
        const parcel = await couriers[courier].track(number)

        process.stdout.write(' \x1b[32mSUCCEED\x1b[0m\n')

        return parcel
        // Object with 4 keys :
        // - id: courier id (CHRONOPOST, FEDEX, DHL, UPS, etc...)
        // - label: courier name (Chronopost, Fedex, DHL, UPS, etc...)
        // - number: parcel number
        // - steps: parcel steps in shape of { datetime, location, status }
      } catch (err) {
        process.stdout.write(` \x1b[31mFAILED (${err.message})\x1b[0m\n`)
      }
    }
  }
})().then((res) => {
  if (res) {
    console.log('\n', JSON.stringify(res, null, 2))
  } else {
    console.error(number, 'NOT FOUND')
  }
})
```

## Running the tests

We use [`mocha`][mocha] as test runner and [`chai`][chai] for assertions (with [`chai-as-promised`][chaiAsPromised]).

To run tests, simply run :

```shell
npm test
```

### Coding style

We use [standard code style][standard:url].

## Versioning

We use [SemVer][semver] for versioning. For the releases available, see the [releases on this repository][tags]. 

---
Copyright © 2020 Nicolas Goudry – All rights reserved
