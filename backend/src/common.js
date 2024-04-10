function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('La geolocalización no es soportada por este navegador.');
  }
}

function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  alert('Latitud: ' + latitude + '\nLongitud: ' + longitude);
}

module.exports = { getLocation, showPosition };
