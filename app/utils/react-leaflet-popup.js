/*
  found [here](https://github.com/geoworks/react-leaflet-popup)
*/

// external modules
import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";

// constants
const REACT_MODE_NONE = "REACT_MODE_NONE";
const REACT_MODE_ELEMENT = "REACT_MODE_ELEMENT";
const REACT_MODE_COMPONENT = "REACT_MODE_COMPONENT";
const REACT_RENDERED_EVENTNAME = "react-rendered";

const ReactLeafletPopup = L.Popup.extend({
   initialize(options, source) {
      L.Popup.prototype.initialize.call(this, options, source);

      if (
         this.options.reactElement &&
         React.isValidElement(this.options.reactElement)
      ) {
         this._reactMode = REACT_MODE_ELEMENT;
         this._reactElement = this.options.reactElement;
      } else if (this.options.reactComponent) {
         this._reactMode = REACT_MODE_COMPONENT;
         this._reactComponent = this.options.reactComponent;
         this._reactComponentProps = L.Util.extend(
            {
               leafletLayer: this._source
            },
            this.options.reactComponentProps
         );
      } else {
         this._reactMode = REACT_MODE_NONE;
      }
   },

   onRemove(map) {
      this._container.style.transition = "none";
      ReactDOM.unmountComponentAtNode(this._contentNode);
      L.Popup.prototype.onRemove.call(this, map);
   },

   getContent() {
      if (this._reactMode !== REACT_MODE_NONE) {
         throw new Error(
            "ReactLeafletPopup: can't get content of a react-rendered popup."
         );
      }
      return L.Popup.prototype.getContent.call(this);
   },

   setContent(content) {
      switch (this._reactMode) {
         case REACT_MODE_NONE:
            return L.Popup.prototype.setContent.call(this, content);

         case REACT_MODE_ELEMENT:
            if (!React.isValidElement(content)) {
               throw new Error(
                  "ReactLeafletPopup: Invalid content for ReactElement mode."
               );
            }
            this._reactElement = content;
            this.update();
            return this;

         case REACT_MODE_COMPONENT:
            if (typeof content === "object") {
               throw new Error(
                  "ReactLeafletPopup: Invalid content for ReactComponent mode."
               );
            }
            this._reactComponentProps = L.Util.extend(
               {
                  leafletLayer: this._source
               },
               content
            );
            this.update();
            return this;

         default:
            throw new Error(
               "ReactLeafletPopup: Invalid content for ReactComponent mode."
            );
      }
   },

   setData(data) {
      return this.setContent(data);
   },

   _updateContent() {
      switch (this._reactMode) {
         case REACT_MODE_NONE: {
            return L.Popup.prototype._updateContent.call(this);
         }

         case REACT_MODE_ELEMENT: {
            ReactDOM.render(this._reactElement, this._contentNode, () => {
               this.fire(REACT_RENDERED_EVENTNAME);
            });
            return this;
         }

         case REACT_MODE_COMPONENT: {
            const tmpReactElement = React.createElement(
               this._reactComponent,
               this._reactComponentProps
            );
            ReactDOM.render(tmpReactElement, this._contentNode, () => {
               this.fire(REACT_RENDERED_EVENTNAME);
            });
            return this;
            b;
         }

         default: {
            throw new Error(
               "ReactLeafletPopup: Error: unknown react rendering mode"
            );
         }
      }
   }
});

export default ReactLeafletPopup;
