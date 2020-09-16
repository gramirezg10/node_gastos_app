const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '88969911991-dkvjv9v26viejosqvuvfa09kklata96r.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const checkGoogleToken = async(req, res, next) => {
    // let token = req.body.idToken;
    let token = req.get('idtoken');
    if (!token) token = req.body.idToken

    // console.log('token del middleware__________' + token);
    try {
        if (!token)
            return res.json({
                ok: false,
                msg: 'No hay token en la petición.'
            });
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '88969911991-h8aebdgml62llo5pn7uad6rf5a19jv6l.apps.googleusercontent.com',
                '88969911991-a7mbj2vcfalt16qll0hp2vcbp9oqrhrq.apps.googleusercontent.com'
            ]
        });
        const payload = ticket.getPayload();
        if (payload) {
            req.user = {
                name: payload['name'],
                email: payload['email']
            };
            next();
        } else return res.json({
            ok: false,
            msg: 'Token inválido.'
        });

    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'error en la validación del token.'
        });
    }
}

module.exports = checkGoogleToken;