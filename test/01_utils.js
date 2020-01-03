import { expect } from 'chai'

import { parseDatetime } from '../src/utils/datetime'

describe('Utilities', function () {
  describe('datetime', function () {
    it('should parse valid datetime', function () {
      expect(+parseDatetime('3/1/2020 3:2', 'D/M/YYYY H:m')).to.equal(1578016920000)
    })

    it('should parse valid datetime with locale', function() {
      expect(+parseDatetime('vendredi 3 janvier 2020 04:48:02', 'dddd D MMMM YYYY HH:mm:ss', 'fr')).to.equal(
        1578023282000
      )
    })

    it('should fail to parse invalid datetime', function() {
      expect(+parseDatetime('03/01/2020 00:00:00', 'dddd D MMMM YYYY HH:mm:ss')).to.be.NaN
    })

    it('should fail to parse valid datetime with wrong locale', function() {
      expect(+parseDatetime('vendredi 3 janvier 2020 04:48:02', 'dddd D MMMM YYYY HH:mm:ss', 'en')).to.be.NaN
    })
  })
})
