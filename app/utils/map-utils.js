// external modules
import L from "leaflet";

// custom modules
import { hexToRgb } from "./general-utils";

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

/**
 * makes a simple leaflet icon from a hex color code
 * @param  {string} color - a hex color code
 * @return {object}       - a leaflet icon
 */
function makeSimpleIcon(color) {
   const { r, g, b } = hexToRgb(color);
   return L.icon({
      iconUrl: makeIcon("", {
         fontColor: `rgb(${r}, ${g}, ${b})`,
         markerColor: `rgba(${r}, ${g}, ${b}, 0.20)`,
         strokeColor: `rgb(${r}, ${g}, ${b})`
      }),
      iconSize: [15, 15]
   });
}

module.exports = {
   makeIcon,
   makeSimpleIcon
};
