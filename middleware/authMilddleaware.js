const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (accessToken) {
        jwt.verify(accessToken, "masai", (err, decoded) => {
            if (decoded) {
                console.log(decoded)
                req.body.userId = decoded.userId
                req.body.username = decoded.username
                next();
            } else {
                res.json({ err :true,msg:"doesn't match"});
            }
        });
    } else {
        res.json({ msg: "Please login first." });
    }
};

module.exports = { auth };
