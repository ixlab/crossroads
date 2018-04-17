// external imports
import L from "leaflet";
import gifshot from "gifshot";

// custom imports
import {
   accentColor,
   fontName,
   lightColor
} from "!!sass-variable-loader!scss-variables";
import { svgToCanvas, cssDimensionToInt } from "./general-utils";

// HELPER FUNCTIONS
function _isDataURL(url) {
   var dataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
   return !!url.match(dataURLRegex);
}

function _addCacheString(url) {
   // If it's a data URL we don't want to touch this.
   if (_isDataURL(url) || url.indexOf("mapbox.com/styles/v1") !== -1) {
      return url;
   }
   return url + (url.match(/\?/) ? "&" : "?") + "cache=" + cacheBusterDate;
}

// MODULE FUNCTIONS
/**
 * Handles downloading a tile layer; based off of this (leaflet
 * plugin)[https://github.com/mapbox/leaflet-image/blob/gh-pages/leaflet-image.js]
 * @param  {map}      map      - the leaflet map in question
 * @param  {layer}    layer    - the leaflet tile layer
 * @param  {function} callback - the completion handler
 */
function handleTileLayer(map, layer) {
   return new Promise((resolve, reject) => {
      const isCanvasLayer =
         L.TileLayer.Canvas && layer instanceof L.TileLayer.Canvas;
      const canvas = document.createElement("canvas");
      const dimensions = map.getSize();

      canvas.width = dimensions.x;
      canvas.height = dimensions.y;

      const ctx = canvas.getContext("2d");
      const bounds = map.getPixelBounds();
      const zoom = map.getZoom();
      const tileSize = layer.options.tileSize;

      if (zoom > layer.options.maxZoom || zoom < layer.options.minZoom)
         return reject({ error: "invalid zoom" });

      const tileBounds = L.bounds(
         bounds.min.divideBy(tileSize)._floor(),
         bounds.max.divideBy(tileSize)._floor()
      );
      const tiles = [];
      const tileQueue = [];

      for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++)
         for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++)
            tiles.push(new L.Point(i, j));

      tiles.forEach(tilePoint => {
         const originalTilePoint = tilePoint.clone();

         if (layer._adjustTilePoint) layer._adjustTilePoint(tilePoint);

         const tilePos = originalTilePoint
            .scaleBy(new L.Point(tileSize, tileSize))
            .subtract(bounds.min);

         if (tilePoint.y >= 0) {
            if (isCanvasLayer) {
               const tile = layer._tiles[tilePoint.x + ":" + tilePoint.y];
               const promise = _canvasTile(tile, tilePos, tileSize);
               tileQueue.push(promise);
            } else {
               const url = _addCacheString(layer.getTileUrl(tilePoint));
               const promise = _loadTile(url, tilePos, tileSize);
               tileQueue.push(promise);
            }
         }
      });

      Promise.all(tileQueue).then(_tileQueueFinish);

      function _canvasTile(img, pos, size) {
         return new Promise((resolve, reject) => resolve({ img, pos, size }));
      }

      function _loadTile(url, pos, size) {
         return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "";
            img.onload = () => resolve({ img, pos, size });
            img.onerror = e => {
               reject({
                  error: e,
                  data: { url, pos, size }
               });
            };
            img.src = url;
         });
      }

      function _tileQueueFinish(data) {
         data.forEach(d => {
            if (d.error) {
               const failed = ({ url, pos, size }) =>
                  _loadTile(url, pos, size).then(d => {
                     if (!d.error) {
                        ctx.drawImage(
                           d.img,
                           Math.floor(d.pos.x),
                           Math.floor(d.pos.y),
                           d.size,
                           d.size
                        );
                     } else {
                        failed({ url, pos, size });
                     }
                  });

               failed(d.data);
            } else {
               ctx.drawImage(
                  d.img,
                  Math.floor(d.pos.x),
                  Math.floor(d.pos.y),
                  d.size,
                  d.size
               );
            }
         });
         resolve({ canvas: canvas });
      }
   });
}

function makeGIF(images, width = 500, height = 500) {
   return new Promise((resolve, reject) => {
      gifshot.createGIF(
         {
            gifWidth: width,
            gifHeight: height,
            images: images,
            interval: 0.5,
            numFrames: images.length,
            frameDuration: 1,
            sampleInterval: 10,
            numWorkers: 2
         },
         function({ error, image: gif }) {
            if (error) reject(error);
            else resolve(gif);
         }
      );
   });
}

function downloadFromBlob(blob, title = "download", ext = "jpg") {
   return new Promise((resolve, reject) => {
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `${title}.${ext}`;
      a.onclick = () =>
         setTimeout(() => {
            window.URL.revokeObjectURL(a.href);
         }, 1500);
      a.click();
      resolve(true);
   });
}

function downloadFromCanvas(canvas, title = "download", ext = "jpg") {
   return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
         downloadFromBlob(blob, title, ext).then(() => {
            resolve(true);
         });
      });
   });
}

function generateWatermark(date, width, height) {
   const canvas = document.createElement("canvas");
   const watermarkWidth = 350;
   const watermarkHeight = date ? 90 : 50;

   canvas.height = height;
   canvas.width = width;

   const ctx = canvas.getContext("2d");

   // watermark background
   ctx.beginPath();
   ctx.fillStyle = lightColor;
   ctx.rect(width - watermarkWidth, 0, watermarkWidth, watermarkHeight);
   ctx.fill();

   // watermark branding
   const text = "made with crossroads";
   ctx.font = `25px ${fontName}`;
   const { width: textWidth } = ctx.measureText(text);
   ctx.fillStyle = accentColor;
   ctx.fillText(text, width - (watermarkWidth / 2 + textWidth / 2), 30);

   // watermark date
   if (date) {
      ctx.font = `25px ${fontName}`;
      const { width: dateWidth } = ctx.measureText(date);
      ctx.fillStyle = accentColor;
      ctx.fillText(date, width - (watermarkWidth / 2 + dateWidth / 2), 70);
   }

   return canvas;
}

function barCanvas(width, height, fill, max) {
   const canvas = document.createElement("canvas");

   canvas.height = height;
   canvas.width = width;

   const ctx = canvas.getContext("2d");

   ctx.beginPath();
   ctx.fillStyle = accentColor;
   ctx.rect(0, height - 25, width * (fill / max), height / 20);
   ctx.fill();

   return canvas;
}

function getCurrentMap(map, canvases, svgs) {
   return new Promise((resolve, reject) => {
      const { x: width, y: height } = map.getSize();

      const generateFrame = ({ canvas: mapCanvas }) => {
         // prepare the canvas for the frame (a single frame in the final gif,
         // will include all heatmaps currently display, a progress bar, watermark
         // with a date, and map tiles)
         const frame = document.createElement("canvas");
         frame.width = width;
         frame.height = height;
         const frameCtx = frame.getContext("2d");

         // change the composition operation to overlay when adding the heatmaps
         // so they blend the same way as the css mix-blend-mode (also overlay)
         frameCtx.globalCompositeOperation = "overlay";
         canvases.forEach(canvas =>
            frameCtx.drawImage(canvas, 0, 0, width, height)
         );

         // change the compisition operation so that the map layer appears
         // below the blended heatmaps
         frameCtx.globalCompositeOperation = "destination-over";
         frameCtx.drawImage(mapCanvas, 0, 0);

         // change the composition operation so that the svgs, progress bar, and watermark
         // appear over top eveything else
         frameCtx.globalCompositeOperation = "source-over";

         if (svgs.length) {
            const svgPromises = [];
            svgs.forEach(svg => svgPromises.push(svgToCanvas(svg)));
            Promise.all(svgPromises).then(svgCanvases => {
               svgCanvases.forEach(svgCanvas => {
                  frameCtx.drawImage(svgCanvas, 0, 0);
               });
               resolve(frame);
            });
         } else {
            resolve(frame);
         }
      };

      map.eachLayer(l => {
         if (l instanceof L.TileLayer)
            handleTileLayer(map, l).then(generateFrame);
      });
   });
}

module.exports = {
   handleTileLayer,
   makeGIF,
   downloadFromBlob,
   downloadFromCanvas,
   barCanvas,
   generateWatermark,
   getCurrentMap
};
