# biblys-cloud

## Install

1. Install dependencies: `yarn`
2. Create config file from template: `cp .env.template .env`
3. Fill configuration options in `.env`

## Run using docker

Create and `.env` file from `env.template`, fill options and:

```console
docker run -d -p 3000:8080 \
  --env-file=.env \
  --restart=unless-stopped \
  --name cloud \
  biblys/cloud
```

## Run in development

    yarn dev

## Configure Stripe Checkout webhook

1. Create a new webhook in
   [Stripe dashboard](https://dashboard.stripe.com/test/webhooks) pointing
   to https://{host}/payments/stripe-webhook
2. Get Stripe endpoint secret key from dashboard and save it as
   `STRIPE_ENDPOINT_SECRET` env variable

## Run tests / coverage

    yarn test
    yarn coverage

## Run migrations

    yarn run migrate 1.11.0

## Todo

- Replace mongodb with MySQL
- Allow to save cards (again)
- Delete saved cards
- Allow customers to see all their invoices
- Support tickets
- Tests for middlewares
- Favicon
- Home page
- Save customer address and prefill invoice customerAddress

## Changelog

### 1.13.3 (2019-12-19)

- Upgraded all dependencies

### 1.13.2 (2019-11-25)

- Fix invoice link in payments list
- Updated dependencies

### 1.13.1 (2019-10-01)

- Throw error if Stripe keys are missing in env configuration
- Fix CSP error on invoice page
- Enable CSP in dev mode

### 1.13.0 (2019-09-16)

/!\ Deployment: configure Stripe webhook

- Revamp card payment to use Stripe Checkout new version

### 1.12.3 (2019-08-01)

- Update dependencies to fix lodash security vulnerability

### 1.12.2 (2019-06-10)

- Update dependencies
- Fix React deprecation warning

### 1.12.1 (2019-02-04)

- Fix filtering payments by year

### 1.12.0 (2018-12-18)

- Add transfer payment option when `IBAN` env variable is set
- Add payments year filter functionnality

### 1.11.0 (2017-01-13)

- Manually add payment & mark order as saved
- Add 'create' button on every admin list pages

### 1.10.1 (2017-12-30)

- Fix print button showing on invoice page for print media
- Fix missing edit button on invoices list page

### 1.10.0 (2017-12-29)

- Generate complete invoices
- Add an admin page to edit customers
- Sort invoices and payments by date
- Add a print button on invoice page

### 1.9.1 (2017-12-19)

- Fix displaying Stripe errors

### 1.9.0 (2017-12-16)

- Use Stripe Elements to add a new card
- Display version number in footer

### 1.8.1 (2017-12-09)

- Prevent Stripe to charge twice if user double-click Pay button

### 1.8.0 (2017-12-01)

- Add new card to existing Stripe customer instead of creating a new one
- Add a delete button for customers
- Show associated customer in users list

### 1.7.0 (2017-11-24)

- Allow customers to use cards saved with Stripe
- Replace `config.js` file with `.env` for configuration
- Remove unused fields from Customer model
- Update users properties from Axys on connection
- Add a payment page that lists Stripe saved cards

### 1.6.0 (2017-11-11)

- Use User model to identify visitor instead of Customer
- Add an admin page to edit a customer
- Add admin pages to create, list and edit users
- Associate current user with payments

### 1.5.0 (2017-10-27)

- Add an admin page to create a new customer
- Add an admin page that lists all customers
- Add an admin page that lists all payments
- Add a delete option for invoices
- Save Stripe customer ID on payment

### 1.4.0 (2017-10-25)

- Add an admin page to create a new invoice
- Add an admin page that lists all invoices
- Revamp login system without Axys widget
- Add tests

### 1.3.0 (2017-10-24)

- Display login invite when accessing invoice page while unlogged
- Display transfer info on invoice page if available
- Add admin dashboard
- Add nodemon as a depency and `npm run dev` script

### 1.2.0 (2017-10-22)

- Add Axys support
- Allow customers to only see their invoices
- Add an admin role that can see all invoices
- Save each payment individually in database

### 1.1.0 (2017-10-21)

- Add Biblys logo in payment popup
- Enable responsive layout
- Add timestamps field to Invoice model
- Add security HTTP headers
- Fix using custom port in config file

### 1.0.0 (2017-10-21)

- First release
