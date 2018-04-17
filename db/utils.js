/**
 * Generates valid sql to create a postGIS polygon object
 * @param [] points - list of coordinates
 * @param latKey - key to retrieve latitude value form coordinate in points
 * @param lngKey - key to retrieve longitude value form coordinate in points
 * @param srid - determines spacial reference for a set of data, default on 4326 for most GPS data
 */
function getPostGISPolygon(points, latKey, lngKey, srid) {
   if (!points) return "";
   latKey = typeof latKey === "undefined" ? "lat" : latKey;
   lngKey = typeof lngKey === "undefined" ? "lng" : lngKey;
   srid = typeof srid === "undefined" ? 4326 : srid;
   if (points[0] != points[points.length - 1]) points.push(points[0]);
   var geofence = points
      .map(function(point) {
         return point[lngKey] + " " + point[latKey];
      })
      .join(", ");
   return `SRID=${srid};POLYGON((${geofence}))`;
}

/**
 * Generates valid sql to create a postGIS point object
 * @param lat - latitude
 * @param lng - longitude
 * @param srid - determines spacial reference for a set of data, default on 4326 for most GPS data
 */
function getPostGISPoint(lat, lng, srid) {
   srid = typeof srid === "undefined" ? 4326 : srid;
   return `SRID=${srid};POINT(${lng} ${lat})`;
}

module.exports = {
   getPostGISPolygon: getPostGISPolygon,
   getPostGISPoint: getPostGISPoint
};
