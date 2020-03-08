module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {

            return next();
        }
        return res.redirect('/signin');
    },
    isLogged(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.rango !== "5") {
                return next();
            } else {
                console.log(req.originalUrl)
                req.flash('error', `Requiere tener permisos especiales para entrar a esta ubicacion, comunicate con la persona encargada`);
                return res.redirect('/tablero');
            }
        }
        return res.redirect('/signin');
    },
    Admins(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.admin == "1") {
                return next();
            } else {
                console.log(req.originalUrl)
                req.flash('error', `Requiere tener permisos especiales para entrar a esta ubicacion, comunicate con la persona encargada`);
                return res.redirect('/tablero');
            }
        }
        return res.redirect('/signin');
    }
};