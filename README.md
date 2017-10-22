# biblys-cloud

## Install

    git clone git@github.com:iwazaru/biblys-cloud.git
    cd biblys-cloud
    npm install
    cp config.dist.js config.js
  
## Running

    npm start

## Todo

* Save payments in database
* Generate complete invoices
* List all invoices for a customer
* Tests!

## Changelog

### DEV 
* Add Axys support
* Allow customers to only see their invoices
* Add an admin role that can see all invoices

### 1.1.0 (2017-10-21)
* Add Biblys logo in payment popup
* Enable responsive layout
* Add timestamps field to Invoice model
* Add security HTTP headers
* Fix using custom port in config file

### 1.0.0 (2017-10-21)
* First release
