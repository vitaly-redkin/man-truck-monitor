/**
 * Test cass for the Geo Location API end point.
 */
import 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import Server from '../server';
import { fixedEncodeURIComponent } from '../server/util/util';

// Test cases to run
let testCases = [
  {
    name: 'The Agency (London)',
    description: 'should get correct address and service area and other props',
    search: '111',
    address: 'The Agency (London)',
    status: 'OK',
    serviceArea: 'LONCENTRAL',
    postCode: 'W11 4LZ',
    fullAddress: '24 Pottery Ln, Notting Hill, London W11 4LZ, UK',
  },
  {
    name: 'chelsea, London',
    description: 'should get correct address and service area and other props',
    search: '222',
    address: 'chelsea, London',
    status: 'OK',
    serviceArea: 'LONSOUTHWEST',
    postCode: 'N/A',
    fullAddress: 'Chelsea, London, UK',
  },
  {
    name: 'chelsea, USA',
    description: 'should get address in USA and no service area',
    search: '333',
    address: 'Chelsea, USA',
    status: 'NOT_FOUND',
    postCode: '02150',
    fullAddress: 'Chelsea, MA 02150, USA',
  },
  {
    name: 'Incrrect address',
    description: 'should return an error',
    search: '444',
    address: 'q23ffetrg',
    status: 'ERROR',
  },
];
// Add the first test case as the last one to check the cache
testCases = [...testCases, testCases[0]];

// Run all test cases
testCases.forEach((tc) => {
  describe(tc.name, () => {
    it(tc.description, async () => {
      const url = `/api/v1/geolocation?search=${
        tc.search
      }&address=${fixedEncodeURIComponent(tc.address)}`;

      const r = await request(Server).get(url).expect('Content-Type', /json/);

      expect(r.body)
        .to.be.an('object')
        .that.has.property('status')
        .equal(tc.status);
      expect(r.body)
        .to.be.an('object')
        .that.has.property('search')
        .equal(tc.search);

      if (tc.status === 'ERROR') {
        expect(r.body).to.be.an('object').that.not.has.property('location');
      } else {
        const location = r.body.location;

        expect(location)
          .to.be.an('object')
          .that.has.property('postCode')
          .equal(tc.postCode);

        if (tc.fullAddress) {
          expect(location)
            .to.be.an('object')
            .that.has.property('address')
            .equal(tc.fullAddress);
        } else {
          expect(location).to.not.has.property('address');
        }

        if (tc.status === 'OK') {
          expect(location)
            .to.be.an('object')
            .that.has.property('serviceArea')
            .equal(tc.serviceArea);
        } else {
          expect(location).to.not.has.property('serviceArea');
        }
      }
    });
  });
});
