/* global it, describe */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const { couriers, identify, track } = require('../lib/parcel-tracker')

chai.use(chaiAsPromised)

const expect = chai.expect

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
    expect(couriers)
      .to.have.nested.property('DPD.id')
      .equal('DPD')
    expect(couriers)
      .to.have.nested.property('FEDEX.id')
      .equal('FEDEX')
    expect(couriers)
      .to.have.nested.property('GLS.id')
      .equal('GLS')
    expect(couriers)
      .to.have.nested.property('MONDIAL_RELAY.id')
      .equal('MONDIAL_RELAY')
    expect(Object.keys(couriers)).to.have.lengthOf(7)
  })

  it('track - should fail with no parameter', function () {
    return expect(track()).to.be.rejectedWith('Invalid courier')
  })

  it('track - should fail with unknown courier', function () {
    return expect(track('XXX', '123')).to.be.rejectedWith('Invalid courier')
  })
})

describe('Chronopost', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [identify('XX000000000XX'), identify('XX0000000000000'), identify('00000000000000A')]

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
    const ids = [identify('4683271'), identify('AC00000B'), identify('XPU0005283')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('CHRONOPOST')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('CHRONOPOST')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = 'XJ006848316JF' // EDIT TRACKING NUMBER HERE

    return expect(track('CHRONOPOST', number))
      .to.eventually.nested.include({
        id: 'CHRONOPOST',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = 'XX0000000000000'

    return expect(track('CHRONOPOST', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('CHRONOPOST')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('CHRONOPOST', '123')).to.be.rejectedWith('Tracking data not found')
  })
})

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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = 'PS0000124616' // EDIT TRACKING NUMBER HERE

    return expect(track('COLIS_PRIVE', number))
      .to.eventually.nested.include({
        id: 'COLIS_PRIVE',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '00000000000000000'

    return expect(track('COLIS_PRIVE', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('COLIS_PRIVE')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('COLIS_PRIVE', '123')).to.be.rejectedWith('Tracking data not found')
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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = '8207336244' // EDIT TRACKING NUMBER HERE

    return expect(track('DHL', number))
      .to.eventually.nested.include({
        id: 'DHL',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '0000000000'

    return expect(track('DHL', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('DHL')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('DHL', '123')).to.be.rejectedWith('Tracking data not found')
  })
})

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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = '15976884309292' // EDIT TRACKING NUMBER HERE

    return expect(track('DPD', number))
      .to.eventually.nested.include({
        id: 'DPD',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '000000000000000'

    return expect(track('DPD', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('DPD')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('DPD', '123')).to.be.rejectedWith('Tracking data not found')
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
    const ids = [identify('4683271'), identify('AC00000B'), identify('XPU0005283'), identify('ABCD')]

    for (const id of ids) {
      expect(id)
        .to.have.property('rest')
        .that.include('FEDEX')
      expect(id)
        .to.have.property('candidates')
        .that.not.include('FEDEX')
    }
  })

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = '61299994616052093824' // EDIT TRACKING NUMBER HERE

    return expect(track('FEDEX', number))
      .to.eventually.nested.include({
        id: 'FEDEX',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '0000000000000000000000'

    return expect(track('FEDEX', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('FEDEX')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('FEDEX', '123')).to.be.rejectedWith('Tracking data not found')
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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = 'ZWKU9U2E' // EDIT TRACKING NUMBER HERE

    return expect(track('GLS', number))
      .to.eventually.nested.include({
        id: 'GLS',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = 'XXXX0X0X'

    return expect(track('GLS', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('GLS')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('GLS', '4683271')).to.be.rejectedWith('Tracking data not found')
  })
})

describe('MONDIAL_RELAY', function () {
  it('identify - should succeed with matching tracking number', function () {
    const ids = [
      identify('01234567'),
      identify('0123456789'),
      identify('012345678901')
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

  it('track - should succeed tracking a valid tracking number (PLEASE EDIT TEST FILE WITH A WORKING TRACKING NUMBER)', function () {
    const number = '1234567890:12345' // EDIT TRACKING NUMBER HERE

    return expect(track('MONDIAL_RELAY', number))
      .to.eventually.nested.include({
        id: 'MONDIAL_RELAY',
        number
      })
      .and.to.have.property('steps')
      .instanceOf(Array).that.is.not.empty
  })

  it('track - should fail tracking unexisting (but valid) tracking number', function () {
    const number = '2583420434:12345'

    return expect(track('MONDIAL_RELAY', number)).to.be.rejectedWith('Tracking data not found')
  })

  it('track - should fail tracking without tracking number', function () {
    return expect(track('MONDIAL_RELAY')).to.be.rejectedWith('Input data missing')
  })

  it('track - should fail tracking without zip code', function () {
    return expect(track('MONDIAL_RELAY', '4683271')).to.be.rejectedWith('Zip code missing')
  })

  it('track - should fail tracking an invalid tracking number', function () {
    return expect(track('MONDIAL_RELAY', '4683271:12345')).to.be.rejectedWith('Tracking data not found')
  })
})
