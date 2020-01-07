import { expect } from 'chai'

import { couriers, track } from '../src'

describe('All couriers', function () {
  it('metadata - should list all couriers', function () {
    expect(couriers)
      .to.have.nested.property('CHRONOPOST.id')
      .equal('CHRONOPOST')
    expect(couriers)
      .to.have.nested.property('COLIS_PRIVE.id')
      .equal('COLIS_PRIVE')
    expect(couriers)
      .to.have.nested.property('DHL.id')
      .equal('DHL')
    expect(Object.keys(couriers)).to.have.lengthOf(3)
  })

  it('track - should fail with no parameter', async function () {
    try {
      const parcel = await track()

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Invalid courier')
    }
  })

  it('track - should fail with unknown courier', async function () {
    try {
      const parcel = await track('XXX', '123')

      expect(parcel).to.be.undefined
    } catch (err) {
      expect(err)
        .to.be.an.instanceOf(Error)
        .and.have.property('message', 'Invalid courier')
    }
  })
})
