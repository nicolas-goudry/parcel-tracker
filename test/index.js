/* global it, describe */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const { couriers, identify } = require('../lib/parcel-tracker')

chai.use(chaiAsPromised)

const expect = chai.expect

const validNumbers = {
  CHRONOPOST: 'HT123581943JF',
  COLIS_PRIVE: '559700371762:34460',
  DHL: '3818154955',
  DPD: '05258975204244',
  FEDEX: '391019544600',
  GLS: '988912949343',
  LA_POSTE: 'CC883675172FR',
  MONDIAL_RELAY: '162503411201010',
  TNT: '750776312',
  UPS: '1Z999AA10123456784'
}

describe('All couriers', function () {
  it('should export all couriers', function () {
    expect(couriers).to.have.any.keys(
      'CHRONOPOST',
      'COLIS_PRIVE',
      'DHL',
      'DPD',
      'FEDEX',
      'GLS',
      'LA_POSTE',
      'MONDIAL_RELAY',
      'TNT',
      'UPS'
    )
  })

  it('should count 10 couriers', function () {
    expect(Object.keys(couriers)).to.have.lengthOf(10)
  })
})

describe('Chronopost', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('XX000000000XX'),
      identify('XX0000000000000'),
      identify('00000000000000A')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('CHRONOPOST')
      expect(id)
        .to.have.property('rest')
        .that.not.include('CHRONOPOST')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [
      identify('4683271'),
      identify('AC00000B'),
      identify('XPU0005283')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('CHRONOPOST')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('CHRONOPOST')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.CHRONOPOST

    return expect(couriers.CHRONOPOST.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'CHRONOPOST',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = 'XX0000000000000'

    return expect(couriers.CHRONOPOST.track(number)).to.be.rejectedWith(
      'notFound'
    )
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.CHRONOPOST.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.CHRONOPOST.track('123')).to.be.rejectedWith(
      'notFound'
    )
  })
})

describe('Colis Prive', function () {
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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.COLIS_PRIVE

    return expect(couriers.COLIS_PRIVE.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'COLIS_PRIVE',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '00000000000000000:12345'

    return expect(couriers.COLIS_PRIVE.track(number)).to.be.rejectedWith(
      'notFound'
    )
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.COLIS_PRIVE.track()).to.be.rejected
  })

  it('track - should fail tracking without zip code', function () {
    return expect(couriers.COLIS_PRIVE.track('123')).to.be.rejectedWith(
      'zipCode'
    )
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.COLIS_PRIVE.track('123:12345')).to.be.rejectedWith(
      'notFound'
    )
  })
})

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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.DHL

    return expect(couriers.DHL.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'DHL',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '0000000000'

    return expect(couriers.DHL.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.DHL.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.DHL.track('123')).to.be.rejectedWith('notFound')
  })
})

describe('DPD', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('00000000000000'),
      identify('000000000000000'),
      identify('0000000000000000')
    ]

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
    const ids = [
      identify('4683271'),
      identify('AC00000B'),
      identify('XPU0005283')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('DPD')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('DPD')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.DPD

    return expect(couriers.DPD.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'DPD',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '000000000000000'

    return expect(couriers.DPD.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.DPD.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.DPD.track('123')).to.be.rejectedWith('notFound')
  })
})

describe('Fedex', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('0000000000'),
      identify('000000000000'),
      identify('000000000000000'),
      identify('0000000000000000000000')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('FEDEX')
      expect(id)
        .to.have.property('rest')
        .that.not.include('FEDEX')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [
      identify('4683271'),
      identify('AC00000B'),
      identify('XPU0005283'),
      identify('ABCD')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('FEDEX')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('FEDEX')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.FEDEX

    return expect(couriers.FEDEX.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'FEDEX',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '0000000000000000000000'

    return expect(couriers.FEDEX.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.FEDEX.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.FEDEX.track('123')).to.be.rejectedWith('notFound')
  })
})

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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.GLS

    return expect(couriers.GLS.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'GLS',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = 'XXXX0X0X'

    return expect(couriers.GLS.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.GLS.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.GLS.track('4683271')).to.be.rejectedWith('notFound')
  })
})

describe('La Poste', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('0A012345678A9')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('LA_POSTE')
      expect(id)
        .to.have.property('rest')
        .that.not.include('LA_POSTE')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [
      identify('4683271'),
      identify('AC00000B'),
      identify('XPU0005283')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('LA_POSTE')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('LA_POSTE')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.LA_POSTE

    return expect(couriers.LA_POSTE.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'LA_POSTE',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should succeed routing tracking to Chronopost tracker with a Chronopost tracking number', function () {
    const number = 'XJ006848316JF'

    return expect(couriers.LA_POSTE.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'CHRONOPOST',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '0A012345678A9'

    return expect(couriers.LA_POSTE.track(number)).to.be.rejectedWith(
      'notFound'
    )
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.LA_POSTE.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.LA_POSTE.track('123')).to.be.rejectedWith('notFound')
  })
})

describe('Mondial Relay', function () {
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
        .that.includes('MONDIAL_RELAY')
      expect(id)
        .to.have.property('rest')
        .that.not.include('MONDIAL_RELAY')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('123'), identify('ABCD3G')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('MONDIAL_RELAY')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('MONDIAL_RELAY')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.MONDIAL_RELAY

    return expect(couriers.MONDIAL_RELAY.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'MONDIAL_RELAY',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '2583420434:12345'

    return expect(couriers.MONDIAL_RELAY.track(number)).to.be.rejectedWith(
      'notFound'
    )
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.MONDIAL_RELAY.track()).to.be.rejected
  })

  it('track - should fail tracking without zip code', function () {
    return expect(couriers.MONDIAL_RELAY.track('46832718')).to.be.rejectedWith(
      'zipCode'
    )
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(
      couriers.MONDIAL_RELAY.track('4683271:12345')
    ).to.be.rejectedWith('notFound')
  })
})

describe('TNT', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('012345678'), identify('0123456789012345')]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('TNT')
      expect(id)
        .to.have.property('rest')
        .that.not.include('TNT')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('123'), identify('ABCD3G')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('TNT')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('TNT')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.TNT

    return expect(couriers.TNT.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'TNT',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '012345678'

    return expect(couriers.TNT.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.TNT.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.TNT.track('4683271')).to.be.rejectedWith('notFound')
  })
})

describe('UPS', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('A0123456789'),
      identify('01234567890123456789012345'),
      identify('012345678901234567'),
      identify('012345678'),
      identify('1Z0123456789ABCDEF')
    ]

    for (const id of ids) {
      expect(id)
        .to.have.property('candidates')
        .that.includes('UPS')
      expect(id)
        .to.have.property('rest')
        .that.not.include('UPS')
    }
  })

  it('identify - should fail with not matching tracking number', function () {
    const ids = [identify('4683271'), identify('123'), identify('ABCD3G')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('UPS')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('UPS')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH WORKING TRACKING NUMBERS)', function () {
    const number = validNumbers.UPS

    return expect(couriers.UPS.track(number))
      .to.eventually.nested.include({
        'shipment.product': 'UPS',
        'shipment.idShip': number
      })
      .and.to.have.nested.property('shipment.event')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = 'A0123456789'

    return expect(couriers.UPS.track(number)).to.be.rejectedWith('notFound')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(couriers.UPS.track()).to.be.rejected
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(couriers.UPS.track('4683271')).to.be.rejectedWith('notFound')
  })
})
