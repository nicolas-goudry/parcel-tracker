import { expect } from 'chai'

import { identify, track } from '../src'

describe('DPD', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('00000000000000'), identify('000000000000000'), identify('0000000000000000')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('DPD')
      expect(id)
        .to.have.property('rest')
        .that.not.include('DPD')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('AC00000B'), identify('XPU0005283')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('DPD')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('DPD')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', async function () {
    const number = '15976884309292' // EDIT TRACKING NUMBER HERE

    try {
      const parcel = await track('DPD', number)

      expect(parcel)
        .to.have.property('id')
        .equals('DPD')
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
    const number = '000000000000000'

    try {
      const parcel = await track('DPD', number)

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })

  it('track - should fail tracking without tracking number', async function () {
    try {
      const parcel = await track('DPD')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Input data missing')
    }
  })

  it('track - should fail tracking an invalid tracking number', async function () {
    try {
      const parcel = await track('DPD', '123')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Tracking data not found')
    }
  })
})
