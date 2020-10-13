/**
 * Test cass for the Vehicle API end points.
 */
import 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import Server from '../server';

describe('List of vehicle returned', () => {
  it('List of vehicle returned', async () => {
    const url = `/api/v1/vehicle`;

    const r = await request(Server).get(url).expect('Content-Type', /json/);

    expect(r.body).to.be.an('array').that.has.property('length').greaterThan(0);
    expect(r.body[0]).to.be.an('object').that.has.property('id').equal(1);
    expect(r.body[0])
      .to.be.an('object')
      .that.has.property('licensePlate')
      .equal('111-111');
  });

  it('Vehicle positions returned', async () => {
    const stepNo = 5;
    const url = `/api/v1/vehicle/1?step_no=${stepNo}`;

    const r = await request(Server).get(url).expect('Content-Type', /json/);

    expect(r.body).to.be.an('array').that.has.property('length').equal(stepNo);
    expect(r.body[0])
      .to.be.an('object')
      .that.has.property('vehicleId')
      .equal(1);
    expect(r.body[0]).to.be.an('object').that.has.property('lat');
    expect(r.body[0]).to.be.an('object').that.has.property('lng');
  });
});
