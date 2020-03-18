import createDebugger from 'debug'

import * as couriers from './couriers'

const couriersNumberMatchers = {}

for (const courierKey of Object.keys(couriers)) {
  const courier = couriers[courierKey]

  couriersNumberMatchers[courier.id] = courier.matchers
}

const identify = (number, log = createDebugger('parcel-tracker:identifier')) => {
  log(`try to identify ${number}`)

  const candidates = new Set()
  const rest = new Set()

  for (const courierNumberMatcherKey of Object.keys(couriersNumberMatchers)) {
    log(`testing ${courierNumberMatcherKey}...`)

    for (const courierNumberMatcher of couriersNumberMatchers[courierNumberMatcherKey]) {
      if (courierNumberMatcher.test(number)) {
        log(`${courierNumberMatcher} => MATCH`)

        candidates.add(courierNumberMatcherKey)
      } else {
        log(`${courierNumberMatcher} => NO MATCH`)
      }
    }

    if (!candidates.has(courierNumberMatcherKey)) {
      log(`${courierNumberMatcherKey} doesn’t match ${number} pattern, adding to rest`)

      rest.add(courierNumberMatcherKey)
    } else {
      log(`${courierNumberMatcherKey} matches ${number} pattern, adding to candidates`)
    }
  }

  const result = {
    candidates: [...candidates],
    rest: [...rest]
  }

  log(`identification results of ${number} are`)
  log(result)

  return result
}

export default identify
