const express = require('express');
const router = express.Router();
const execSync = require('child_process').execSync;

router.post('/navegar', async (req, res) => {
    const { movil, nombre, email } = req.body;
    var nomb = nombre.replace(" ", "%20");

    var newLink = 'https://iux.com.co/x/venta.php?suscp=1&movil='+movil+'&nombre='+nomb+'&email='+email;
    console.log(req.body); 
            var msg = 'casperjs cedula.js ' + newLink;
            console.log(msg);
            const stdout = execSync(msg);            
            req.flash('success', 'Link Saved Successfully');            
            console.log(`stdout: ${stdout}`);
            //res.redirect('/');
  });

module.exports = router;