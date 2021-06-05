exports.get404 = (req, res, next) => {
    res.status(404).render('404', { "path": req.path});
};

exports.get500 = (error, req, res, next) => {
    console.error(error);
    res.status(500).render('500', { "path": req.path});
};

exports.get500_nolog = (req, res, next) => {
    res.status(500).render('500', { "path": "This server"});
}; 