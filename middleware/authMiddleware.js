const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Look for the VIP Pass in the request header
    const token = req.header('Authorization');

    // 2. If there is no token, kick them out
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // 3. The token usually comes as "Bearer <token_string>". We just want the string.
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        // 4. Verify the token using your secret key
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // 5. Attach the decoded user ID to the request so the route can use it
        req.user = verified; 
        
        // 6. Let them through to the actual route
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token." });
    }
};