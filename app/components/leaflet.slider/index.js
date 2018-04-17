// external imports
import { FeatureGroup } from "leaflet";
import throttle from "lodash.throttle";

// custom modules
import { downloadUtils } from "utils";

const defaultOptions = {};

const CLASSNAMES = {
   SLIDER: "leaflet-slider",
   HANDLE: "leaflet-slider-handle",
   CONTENT: "leaflet-slider-content",
   IMAGE: "leaflet-slider-content--image"
};

export default class LeafletSlider extends FeatureGroup {
   constructor(options = defaultOptions) {
      super();
      this.options = { ...defaultOptions, ...options };
   }

   addEventHandlers() {
      let isResizing = false;

      // keep track of the previous dragging state. This ensures
      // that once the user has stopped dragging the slider, it will
      // revert to the previous state, not just enable dragging again
      let prevDraggingEnabled = this.map.dragging.enabled();

      // disable dragging the map when over the resizing handle
      this.resizeHandle.addEventListener("mouseover", e => {
         prevDraggingEnabled = this.map.dragging.enabled();
         this.map.dragging.disable();
      });

      // enable dragging the when when no longer over the resizing
      // handle
      this.resizeHandle.addEventListener("mouseleave", e => {
         if (prevDraggingEnabled) {
            this.map.dragging.enable();
         }
      });

      // flag that resizing is occuring upon clicking down
      // on the resizing handler
      this.resizeHandle.addEventListener("mousedown", e => {
         e.stopPropagation();
         isResizing = true;
      });

      // reset the slider and handle on double clicking the handle
      this.resizeHandle.addEventListener("dblclick", e => {
         e.stopPropagation();
         this.sliderDiv.style.right = `${this.map.getSize().x}px`;
         this.resizeHandle.style.left = "0";
      });

      // if the window gets resized, reset the sliders position
      window.addEventListener("resize", e => {
         this.sliderDiv.style.right = `${this.map.getSize().x}px`;
         this.resizeHandle.style.left = "0";
      });

      // if resizing is occuring, update the panel and handle as the mouse moves
      document.addEventListener("mousemove", e => {
         if (isResizing) {
            this.sliderDiv.style.right = `${this.map.getSize().x -
               e.clientX}px`;
            this.resizeHandle.style.left = `${e.clientX}px`;
         }
      });

      // flag resizing as complete when the mouse click is released
      document.addEventListener("mouseup", e => {
         isResizing = false;
      });

      // don't allow text to be selected if the handle is being dragged
      document.body.onselectstart = e => {
         return !isResizing;
      };
   }

   /**
    * Updates the content of the overlay based on the contents
    * of one or more canvas elements
    * @param  {array/object} canvas - can either be an array of canvas objects or a single object
    * @return {promise}               a promise that resolves once the data has been updated
    */
   updateFromMap() {
      return new Promise((resolve, reject) => {
         const canvases = Array.from(
            document.querySelectorAll(".leaflet-overlay-pane canvas")
         );
         const svgs = document.querySelectorAll(".leaflet-overlay-pane svg");

         downloadUtils
            .getCurrentMap(this.map, canvases, svgs)
            .then(frame => {
               // clear the previous contents
               this.clear();

               // create a new canvas
               const { x: width, y: height } = this.map.getSize();
               const final = document.createElement("canvas");
               final.className = CLASSNAMES.IMAGE;
               final.width = width;
               final.height = height;
               const ctx = final.getContext("2d");
               ctx.drawImage(frame, 0, 0);

               // update the contents
               this.contentDiv.append(final);

               resolve({ success: true });
            })
            .catch(e => {
               reject({ success: false, error: e });
            });
      });
   }

   /**
    * Clears the current contents of the slider
    */
   clear() {
      const content = this.contentDiv.querySelectorAll(`.${CLASSNAMES.IMAGE}`);
      if (content && content.length) content.forEach(el => el.remove());
      this.sliderDiv.style.right = `${this.map.getSize().x}px`;
      this.resizeHandle.style.left = "0";
   }

   onAdd(map) {
      // save a reference to the map
      this.map = map;

      // instantiate the slider element
      this.sliderDiv = document.createElement("div");
      this.sliderDiv.className = CLASSNAMES.SLIDER;
      this.sliderDiv.style.right = `${this.map.getSize().x}px`;

      // instantiate the content element
      this.contentDiv = document.createElement("div");
      this.contentDiv.className = CLASSNAMES.CONTENT;

      // add the resizing handle
      this.resizeHandle = document.createElement("div");
      this.resizeHandle.className = CLASSNAMES.HANDLE;

      // add the event handlers
      this.addEventHandlers();

      // add elements to the slider div
      this.sliderDiv.append(this.contentDiv);
      this.sliderDiv.append(this.resizeHandle);

      // add the slider element to the map
      map._container.append(this.sliderDiv);
   }
}
