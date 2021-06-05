module.exports = (req, res, next) => {
    if (!req.session.user||req.session.user.level<1) {
        return res.redirect('/login');
    }
    next();
}