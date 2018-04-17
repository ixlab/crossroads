// constant for the types of controls
const CONTROL = {
   SNAPSHOT: "SNAPSHOT",
   RANGE: "RANGE",
   INTERVAL: "INTERVAL",
   JOURNEY: "JOURNEY",
   GEOFENCE: "GEOFENCE",
   SQL_SNIPPET: "SQL_SNIPPET"
};

// constant for the map types
const MAP_TYPE = {
   HEATMAP: "HEATMAP",
   CLUSTERS: "CLUSTERS",
   GEOFENCE: "GEOFENCE",
   JOURNEY: "JOURNEY"
};

// constant for polygon classNames
const POLYGON_CLASS_NAMES = {
   INBOUND: "inbound-polygon",
   OUTBOUND: "outbound-polygon"
};

// placemarks icon to be used on the map
const placemarkIcon = L.icon({
   iconUrl: "/public/images/car.png",
   iconSize: [35, 35]
});

/**
 * creates a numerical icon to be fed into leaflet as a marker
 * @param {string} txt - the text to be displayed on the marker. best kept at 3 or less characters
 * @param {object} opts - options object containing keys for fontColor, markerColor, strokeColor, and lineWidth
 */
function makeIcon(txt, opts) {
   opts = {
      fontColor: "black",
      markerColor: "rgba(0, 0, 0, 0.65)",
      strokeColor: "black",
      lineWidth: 2.0,
      ...opts
   };

   const r = 35.0;
   const fsz = 28;
   const cvs = document.createElement("canvas");
   cvs.height = cvs.width = opts.lineWidth * 2 + r * 2;
   const ctx = cvs.getContext("2d");

   // background (in case of opactiy)
   ctx.beginPath();
   ctx.fillStyle = "white";
   ctx.arc(r + opts.lineWidth, r + opts.lineWidth, r, 0, Math.PI * 2, true);
   ctx.fill();

   // main circle
   ctx.beginPath();
   ctx.fillStyle = opts.markerColor;
   ctx.strokeStyle = opts.strokeColor;
   ctx.lineWidth = opts.lineWidth;
   ctx.arc(r + opts.lineWidth, r + opts.lineWidth, r, 0, Math.PI * 2, true);
   ctx.fill();
   ctx.stroke();

   // text
   ctx.fillStyle = opts.fontColor;
   ctx.font = `${fsz}px Titillium Web`;
   const tw = ctx.measureText(txt).width;
   ctx.fillText(txt, r + opts.lineWidth - tw / 2, r + opts.lineWidth + 10.0);
   return cvs.toDataURL();
}

module.exports = {
   CONTROL,
   MAP_TYPE,
   POLYGON_CLASS_NAMES,
   mapIcons: {
      placemarkIcon,
      makeIcon
   }
};
