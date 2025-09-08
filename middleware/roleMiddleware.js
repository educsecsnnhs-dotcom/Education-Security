// middleware/roleMiddleware.js
function requireAnyRole(...allowed) {
return (req, res, next) => {
const roles = (req.user && req.user.roles) || [];
const ok = roles.some(r => allowed.includes(r));
if (!ok) return res.status(403).json({ error: 'Forbidden: insufficient role' });
next();
};
}


module.exports = { requireAnyRole };
