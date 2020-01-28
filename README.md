[standard:img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard:url]: http://standardjs.com
[mocha]: https://mochajs.org
[chai]: https://chaijs.com
[parcel]: https://parceljs.org
[babel]: https://babeljs.io
[chaiAsPromised]: https://www.chaijs.com/plugins/chai-as-promised
[semver]: http://semver.org
[tags]: https://github.com/nicolas-goudry/parcel-tracker/releases

# Parcel Tracker [![Standard - JavaScript Style Guide][standard:img]][standard:url]

Parcel Tracker is a Javascript library which can track parcels from numerous couriers. It can also guess courier from a tracking number.

Supported couriers are :
* Chronopost
* Colis Privé
* Colissimo
* DHL
* DPD
* Fedex
* GLS
* Mondial Relay
* TNT
* UPS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Building

We use [`parcel`][parcel] in order to build project. It uses [`babel`][babel] under the hood.

### Installing

Install Parcel Tracker as a dependency to your project :

```shell
$ npm i -S git@github.com:nicolas-goudry/parcel-tracker.git
```

Then, here’s how you can use Parcel Tracker :

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
    // For each key, we try to track number with listed couriers
    for (const courier of candidates[key]) {
      try {
        const parcel = await couriers[courier].track(number, { chrono: false })

        return parcel
        // Object with 4 keys :
        // - id: courier id (CHRONOPOST, FEDEX, DHL, UPS, etc...)
        // - label: courier name (Chronopost, Fedex, DHL, UPS, etc...)
        // - number: parcel number
        // - steps: parcel steps in shape of { datetime, location, status }
      } catch (err) {
        console.error(err)
      }
    }
  }
})()
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
