const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');

module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/signin');
  },

  noExterno(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.externo) {
        //console.log(req)
        req.flash(
          'error',
          `Requiere tener permisos especiales para entrar a esta ubicacion, comunicate con la persona encargada`
        );
        return res.redirect('/links/reportes');
      } else {
        return next();
      }
    }
    return res.redirect('/signin');
  },

  isLogged(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.rango !== '5') {
        return next();
      } else {
        //console.log(req.originalUrl)
        req.flash(
          'error',
          `Requiere tener permisos especiales para entrar a esta ubicacion, comunicate con la persona encargada`
        );
        return res.redirect('/tablero');
      }
    }
    return res.redirect('/signin');
  },

  Admins(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.admin == '1') {
        return next();
      } else {
        //console.log(req.originalUrl)
        req.flash(
          'error',
          `Requiere tener permisos especiales para entrar a esta ubicacion, comunicate con la persona encargada`
        );
        return res.redirect('/tablero');
      }
    }
    return res.redirect('/signin');
  },

  verifyToken: async (req, res, next) => {
    // const company = req?.company;
    const token =
      req.headers['token'] ??
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjo1NDMyLCJpYXQiOjE3MDk3ODYxMjd9.-H9-wSQPMmCCW36Mo_reSymiEkIpdeCHJWnETUOHDRA';

    if (!token) res.status(401).json({ message: 'Sin Token!' });

    try {
      const decoded = await jwt.verify(token.toString(), JWT_SECRET);

      req.company = decoded?.code;

      //   const company = await Companies.getCompany({ code: decoded?.code });

      /* if (decoded?.code != company?.code)
            return res.status(401).json({ message: 'No autorizado! company diferente' }); */

      //   if (company) req.company = company;

      console.log({
        ...decoded,
        verify: 'token verificado',
        token: token
      });

      next();
    } catch (error) {
      console.log(error, 'jwt expired');
      res.status(401).json({ message: 'No authorizado! token' });
      return;
    }
  }
};
