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


// =============================================
//      Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    // =============================================


// =============================================
//      Base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = 'mongodb://localhost:27017/DB_PAGOS'
} else {
    process.env.URLDB = 'mongodb+srv://admin:50HgvAimB63WXEdm@cluster0.4ynpz.mongodb.net/DB_PAGOS'
}
// =============================================