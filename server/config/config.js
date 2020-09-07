// heroku config --to list all variables
// heroku config:set SEED = 'seed-pdn' -- to config a variable in heroku


// =============================================
//      port config
process.env.PORT = process.env.PORT || 3000;
// =============================================


// =============================================
//      tiempo de expiración del token
process.env.CADUCIDAD = 60 * 60 * 24 * 365;
// =============================================


// =============================================
//      seed de autenticación
process.env.SEED = process.env.SEED || 'seed-dev';
// =============================================


// =============================================
//      Google
process.env.CLIENTID = process.env.CLIENTID || '88969911991-dkvjv9v26viejosqvuvfa09kklata96r.apps.googleusercontent.com';
// =============================================