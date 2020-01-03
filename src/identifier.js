import couriers, { metadata } from './couriers'

const couriersNumberMatchers = {}

for (const courier of Object.keys(couriers)) {
  couriersNumberMatchers[courier] = metadata[courier].matcher
}

const identify = (number) => {
  const candidates = new Set()
  const rest = new Set()

  for (const courierNumberMatcherKey of Object.keys(couriersNumberMatchers)) {
    for (const courierNumberMatcher of couriersNumberMatchers[courierNumberMatcherKey]) {
      if (courierNumberMatcher.test(number)) {
        candidates.add(courierNumberMatcherKey)
      }
    }

    if (!candidates.has(courierNumberMatcherKey)) {
      rest.add(courierNumberMatcherKey)
    }
  }

  const result = {
    candidates: [...candidates],
    rest: [...rest]
  }

  return result
}

export default identify
