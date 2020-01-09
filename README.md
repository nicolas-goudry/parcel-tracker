[standard:img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard:url]: http://standardjs.com
[mocha]: https://mochajs.org
[chai]: https://chaijs.com
[parcel]: https://parceljs.org
[babel]: https://babeljs.io
[chaiAsPromised]: https://www.chaijs.com/plugins/chai-as-promised
[semver]: http://semver.org
[tags]: https://github.com/nicolas-goudry/parcel-tracker/tags

# Parcel Tracker [![Standard - JavaScript Style Guide][standard:img]][standard:url]

Parcel Tracker is a Javascript library which can track parcels from numerous couriers. It can also guess courier from a tracking number.

Supported couriers are :
* Chronopost
* Colis Privé
* DHL
* DPD
* Fedex
* GLS
* Mondial Relay

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Building

We use [`parcel`][parcel] in order to build project. It uses [`babel`][babel] under the hood.

### Installing

Build, then grab `lib/parcel-tracker.js` and add it to your project directory.

Then, here’s how you can use Parcel Tracker :

```js
import { identify, track } from './parcel-tracker.js'

const number = 'XJ006848316JF'
const couriers = identify(number)
// Object with 2 keys :
// - candidates: contains most probable couriers matching number
// - rest: contains other supported couriers
// { candidates: [], rest: [] }

(async () => {
  // We process couriers keys (first 'candidates', then 'rest')
  for (const key in couriers) {
    // For each key, we try to track number with listed couriers
    for (const courier of couriers[key]) {
      try {
        const parcel = await track(courier, number)

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

### 

## Versioning

We use [SemVer][semver] for versioning. For the versions available, see the [tags on this repository][tags]. 

---
Copyright © 2020 Nicolas Goudry – All rights reserved
