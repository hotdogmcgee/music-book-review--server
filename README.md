psql -U bookmaster -d musicbooks -f ./seeds/seed.musicbooks_tables.sql

    // "migrate:production": "env SSL=true DATABASE_URL=$(heroku config:get DATABASE_URL) npm run migrate",