import { expect } from 'chai'

import { identify, couriers, track } from '../src'

describe('GLS', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('AB01234D'),
      identify('01234567890123'),
      identify('0123456789'),
      identify('01234567890123456789'),
      identify('7D012345678D2')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('GLS')
      expect(id)
        .to.have.property('rest')
        .that.not.include('GLS')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('123'), identify('ABCD3G')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('GLS')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('GLS')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', async function () {
    const number = 'ZWKU9U2E' // EDIT TRACKING NUMBER HERE

    try {
      const parcel = await track('GLS', number)

      expect(parcel)
        .to.have.property('id')
        .equals('GLS')
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
    const number = 'XXXX0X0X'

    try {
      const parcel = await track('GLS', number)

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })

  it('track - should fail tracking without tracking number', async function () {
    try {
      const parcel = await track('GLS')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Input data missing')
    }
  })

  it('track - should fail tracking an invalid tracking number', async function () {
    try {
      const parcel = await track('GLS', '4683271')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })
})
