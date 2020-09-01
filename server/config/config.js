// heroku config --to list all variables
// heroku config:set SEED = 'seed-pdn' -- to config a variable in heroku


// =============================================
//      port config
process.env.PORT = process.env.PORT || 3000;
// =============================================


// =============================================
//      tiempo de expiración del token
process.env.CADUCIDAD = 60 * 60 * 24 * 30;
// =============================================


// =============================================
//      seed de autenticación
process.env.SEED = process.env.SEED || 'seed-dev';
// =============================================


// =============================================
//      Google
process.env.CLIENTID = process.env.CLIENTID || '80412211933-3g84n75128gbgne9dda5fj6n1nqt9o25.apps.googleusercontent.com';
// =============================================