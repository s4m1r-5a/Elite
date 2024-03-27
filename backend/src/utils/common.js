const fs = require('fs');
const path = require('path');

// Función para validar emails
module.exports.validEmail = email =>
  /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/.test(
    email
  );

// Función de unidades de medidas
module.exports.units = ref =>
  [
    { tag: 'Metros', val: 'm' },
    { tag: 'Metros cuadrados', val: 'm²' },
    { tag: 'Metros cubicos', val: 'm³' },
    { tag: 'Centimetros cubicos', val: 'cm³' },
    { tag: 'Centimetros', val: 'cm' },
    { tag: 'Milimetros', val: 'mm' },
    { tag: 'Kilometros', val: 'km' },
    { tag: 'Litros', val: 'l' },
    { tag: 'Mililitros', val: 'ml' },
    { tag: 'Gramos', val: 'g' },
    { tag: 'Kilogramos', val: 'kg' },
    { tag: 'Miligramos', val: 'mg' },
    { tag: 'Libras', val: 'lb' },
    { tag: 'Onzas', val: 'oz' },
    { tag: 'Unidades', val: 'u' },
    { tag: 'Pares', val: 'par' },
    { tag: 'Cajas', val: 'c' },
    { tag: 'Bolsas', val: 'b' },
    { tag: 'Paquetes', val: 'p' },
    { tag: 'Rollos', val: 'r' },
    { tag: 'Galones', val: 'gl' },
    { tag: 'Barriles', val: 'b' },
    { tag: 'Toneladas', val: 't' },
    { tag: 'Miles', val: 'mi' },
    { tag: 'Yardas', val: 'yd' },
    { tag: 'Pies', val: 'ft' },
    { tag: 'Pulgadas', val: 'in' }
  ].map(e => (/tag|val/.test(ref) ? e[ref] : e));

// Función para crear archivos
module.exports.createFiles = (route, file, content) => {
  const filePath = path.join(__dirname, route, file);

  const folders = filePath.split('/');
  let currentPath = '.';
  folders.forEach((folder, index) => {
    if (index < folders.length - 1) {
      currentPath = path.join(currentPath, folder); // Utiliza path.join para construir las rutas de manera más segura
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
    }
  });

  fs.writeFileSync(filePath, content); // Utiliza filePath en lugar de path para escribir el archivo
};

// Función para procesar numeros de cuentas contables
module.exports.accountingAccountNumber = string => {
  string = string.replace(/^\D+/, '');
  let account = string.slice(0, 6);
  if (account.length < 6) account = string.slice(0, 4);
  if (account.length < 4) account = string.slice(0, 2);
  if (account.length === 0) account = null;

  return account;
};
