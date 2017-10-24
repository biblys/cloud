'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

chai.should();
chai.use(chaiHttp);

after(function(done) {
  server.close();
  done();
});

describe('GET /invoices/xxx', function() {
  it('should return 404 for non existing invoice');
  it('should return 401 for unlogged user');
  it('should return 403 for unauthorized user');
  it('should display invoice for authorized user');
});
