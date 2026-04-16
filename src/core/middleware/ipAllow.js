module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({
        status: false,
        code: 401,
        message: req.t("unauthenticated_user")
    })

    try {
        let validIps = ['::12', '127.0.0.1', '34.250.245.3', '52.16.123.4', '52.211.205.187']; // Put your IP whitelist in this array

        if (validIps.includes(req.connection.remoteAddress)) {
            // IP is ok, so go on
            console.log("IP ok");
            next();
        } else {
            // Invalid ip
            console.log("Bad IP: " + req.connection.remoteAddress);
            const err = new Error("Bad IP: " + req.connection.remoteAddress);
            next(err);
        }

        next();
    } catch (ex) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: req.t("invalid_token"),
        })
    }

}