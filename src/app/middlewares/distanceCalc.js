const distanceCalc = async (coord1, coord2) => {
  "use strict";
  var deg2rad = function (deg) { return deg * (Math.PI / 180); },
      R = 6371,
      dLat = deg2rad(coord2.lat - coord1.lat),
      dLng = deg2rad(coord2.lng - coord1.lng),
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(deg2rad(coord1.lat))
          * Math.cos(deg2rad(coord1.lat))
          * Math.sin(dLng / 2) * Math.sin(dLng / 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return ((R * c *1000).toFixed());
}

module.exports = distanceCalc;