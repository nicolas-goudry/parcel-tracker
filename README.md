[standard:img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard:url]: http://standardjs.com
[commitizen:img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen:url]: http://commitizen.github.io/cz-cli/
[actions:img]: https://github.com/nicolas-goudry/parcel-tracker/workflows/Node.js%20CI/badge.svg
[actions:url]: https://github.com/nicolas-goudry/parcel-tracker/actions
[parcel]: https://parceljs.org
[babel]: https://babeljs.io
[debug]: https://github.com/visionmedia/debug
[mocha]: https://mochajs.org
[chai]: https://chaijs.com
[chaiaspromised]: https://www.chaijs.com/plugins/chai-as-promised
[husky]: https://github.com/typicode/husky
[prettier]: https://prettier.io
[semver]: http://semver.org
[tags]: https://github.com/nicolas-goudry/parcel-tracker/releases
[.mocharc.json]: ./.mocharc.json
[.prettierrc]: ./.prettierrc

# parcel-tracker

[![Standard - JavaScript Style Guide][standard:img]][standard:url]
[![Commitizen friendly][commitizen:img]][commitizen:url]
[![Actions Status][actions:img]][actions:url]

parcel-tracker is a Javascript library which can track parcels from numerous couriers. It can also guess courier from a tracking number.

Supported couriers are :

- Chronopost
- Colis Privé
- DHL
- DPD
- Fedex
- GLS
- La Poste (Colissimo + Courier Suivi)
- Mondial Relay
- TNT
- UPS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Building

We use [`parcel`][parcel] in order to build project. It uses [`babel`][babel] under the hood.

### Installing

parcel-tracker is hosted on a private npm registry. You need an account on this registry in order to add it as a dependency to your project. You may ask the author for an access.

```shell
$ npm i -S parcel-tracker --registry http://ec2-35-171-163-20.compute-1.amazonaws.com/
```

### Usage

Here is an example on how you _could_ implement a sequential auto-tracking feature:

```js
const { identify, couriers } = require('parcel-tracker')

const number = 'YOUR_TRACKING_NUMBER_HERE'
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

#### Logging

By default, parcel-tracker uses [`debug`][debug]. You can define env variable `DEBUG` to `parcel-tracker:*` to enable it.

Optionaly, you could pass a logging function as a second argument to `track` and `identify`. This would override the use of `debug`.

#### TLS unsupported protocol issue

If you’re running on Node.js 12 and above, you might came up with following error:

`write EPROTO 139670746232704:error:1425F102:SSL routines:ssl_choose_client_version:unsupported protocol:[...]`

This is because default TLS settings are stricter on those versions of Node.js. TLS v1.2 is the default, but some sites don’t support it yet. In order to make them work, you need to provide following flag to Node.js : `--tls-min-v1.0`.

Tests are not affected, because this option is already provided to [Mocha configuration][.mocharc.json].

## Running the tests

We use [`mocha`][mocha] as test runner and [`chai`][chai] for assertions (with [`chai-as-promised`][chaiaspromised]).

To run tests, simply run :

```shell
$ npm test
```

## Miscellaneous

### Git workflow

Some hooks are defined with [`husky`][husky] :

- `prepare-commit-msg` : run commitizen => **see below**
- `pre-commit` : lint codebase
- `pre-push` : run tests

We use [`commitizen`][commitizen:url] to ensure proper commit format.

**Warning :** if you are using a git GUI (like GitKraken), you won’t be able to commit from those tools due to commitizen interactive commits. **You have to commit from CLI :**

```shell
$ git commit
```

### Code style

We use [standard code style][standard:url].

### Code formatting

We use [`prettier` code formatter][prettier] with a [custom configuration][.prettierrc].

### Versioning

We use [SemVer][semver] for versioning. For the releases available, see the [releases on this repository][tags].

---

Copyright © 2020 Nicolas Goudry – All rights reserved
