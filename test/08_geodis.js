import { expect } from 'chai'

import { identify, couriers, track } from '../src'

describe('Geodis', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('000000000000000')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('GEODIS')
      expect(id)
        .to.have.property('rest')
        .that.not.include('GEODIS')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('GEODIS')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('GEODIS')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', async function () {
    const number = '00102693262391:83510' // EDIT TRACKING NUMBER HERE

    try {
      const parcel = await track('GEODIS', number)

      expect(parcel)
        .to.have.property('id')
        .equals('GEODIS')
      expect(parcel)
        .to.have.property('number')
        .equals(number)
      expect(parcel)
        .to.have.property('steps')
        .instanceOf(Array).that.is.not.empty
    } catch (err) {
      expect(err).to.not.be.an.instanceOf(Error)
    }
  })

  it('track - should fail tracking unexisting (but valid) tracking number', async function() {
    const number = '000000000000000:00000'

    try {
      const parcel = await track('GEODIS', number)

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })

  it('track - should fail tracking without tracking number', async function () {
    try {
      const parcel = await track('GEODIS')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Input data missing')
    }
  })

  it('track - should fail tracking an invalid tracking number', async function () {
    try {
      const parcel = await track('GEODIS', '123:00000')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })
})
