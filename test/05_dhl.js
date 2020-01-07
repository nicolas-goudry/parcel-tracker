import { expect } from 'chai'

import { identify, couriers, track } from '../src'

describe('DHL', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('0000000000'), identify('XXXX00000000000000000000')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('DHL')
      expect(id)
        .to.have.property('rest')
        .that.not.include('DHL')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('AC00000B')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('DHL')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('DHL')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', async function () {
    const number = '8207336244' // EDIT TRACKING NUMBER HERE

    try {
      const parcel = await track('DHL', number)

      expect(parcel)
        .to.have.property('id')
        .equals('DHL')
      expect(parcel)
        .to.have.property('number')
        .equals(number)
      expect(parcel)
        .to.have.property('steps')
        .instanceOf(Array).that.is.not.empty
    } catch (err) {
      console.log(err)
      expect(err).to.not.be.an.instanceOf(Error)
    }
  })

  it('track - should fail tracking without tracking number', async function () {
    try {
      const parcel = await track('DHL')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Input data missing')
    }
  })

  it('track - should fail tracking an invalid tracking number', async function () {
    try {
      const parcel = await track('DHL', '123')

      console.log(parcel)

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })
})
