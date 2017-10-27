# biblys-cloud

## Install

    git clone git@github.com:iwazaru/biblys-cloud.git
    cd biblys-cloud
    npm install
    cp config.dist.js config.js

## Running in production

    npm start

## Running in development

    npm run dev

## Todo

* Reuse saved cards
* Generate complete invoices
* Allow customers to see all their invoices
* Support tickets
* Tests for middlewares
* Webpack

## Changelog

### 1.5.0 (2017-10-27)
* Add an admin page to create a new customer
* Add an admin page that lists all customers
* Add an admin page that lists all payments
* Add a delete option for invoices
* Save Stripe customer ID on payment

### 1.4.0 (2017-10-25)
* Add an admin page to create a new invoice
* Add an admin page that lists all invoices
* Revamp login system without Axys widget
* Add tests

### 1.3.0 (2017-10-24)
* Display login invite when accessing invoice page while unlogged
* Display transfer info on invoice page if available
* Add admin dashboard
* Add nodemon as a depency and `npm run dev` script

### 1.2.0 (2017-10-22)
* Add Axys support
* Allow customers to only see their invoices
* Add an admin role that can see all invoices
* Save each payment individually in database

### 1.1.0 (2017-10-21)
* Add Biblys logo in payment popup
* Enable responsive layout
* Add timestamps field to Invoice model
* Add security HTTP headers
* Fix using custom port in config file

### 1.0.0 (2017-10-21)
* First release
