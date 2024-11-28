import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.status(403).send('Token required');
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
