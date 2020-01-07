import { expect } from 'chai'

import { identify, couriers, track } from '../src'

describe('Colis Privé', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('00000000000000000')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('COLIS_PRIVE')
      expect(id)
        .to.have.property('rest')
        .that.not.include('COLIS_PRIVE')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('COLIS_PRIVE')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('COLIS_PRIVE')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', async function () {
    const number = 'PS0000124616' // EDIT TRACKING NUMBER HERE

    try {
      const parcel = await track('COLIS_PRIVE', number)

      expect(parcel)
        .to.have.property('id')
        .equals('COLIS_PRIVE')
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

  it('track - should fail tracking without tracking number', async function () {
    try {
      const parcel = await track('COLIS_PRIVE')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Input data missing')
    }
  })

  it('track - should fail tracking an invalid tracking number', async function () {
    try {
      const parcel = await track('COLIS_PRIVE', '123')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })
})
