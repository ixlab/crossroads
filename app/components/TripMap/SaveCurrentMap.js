// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import SaveIcon from "react-icons/lib/fa/star";
import LockIcon from "react-icons/lib/fa/lock";

// custom imports
import { OVERLAY_STATUS } from "utils/constants";
import { svgToCanvas, enableZoom, disableZoom } from "utils";

export default class SaveCurrentMap extends Component {
   static propTypes = {
      map: PropTypes.object.isRequired,
      overlaySlider: PropTypes.object.isRequired
   };

   constructor(props) {
      super(props);

      this.state = {
         status: OVERLAY_STATUS.INACTIVE,
         showingPopover: false
      };
   }

   saveCurrentMap() {
      this.setState({ status: OVERLAY_STATUS.LOADING });

      this.props.overlaySlider.updateFromMap().then(data => {
         this.props.map.dragging.disable();
         disableZoom(this.props.map);
         this.setState({
            status: OVERLAY_STATUS.ACTIVE,
            showingPopover: true
         });
      });
   }

   unlockOverlay() {
      this.props.map.dragging.enable();
      enableZoom(this.props.map);
      this.setState({ status: OVERLAY_STATUS.INACTIVE, showingPopover: false });
      this.props.overlaySlider.clear();
   }

   toggleOverlay() {
      switch (this.state.status) {
         case OVERLAY_STATUS.INACTIVE:
            this.saveCurrentMap();
         case OVERLAY_STATUS.ACTIVE:
            this.unlockOverlay();
         case OVERLAY_STATUS.LOADING:
            return;
      }
   }

   getContent() {
      switch (this.state.status) {
         case OVERLAY_STATUS.INACTIVE:
            return <SaveIcon className="dark-icon" size={21} />;
         case OVERLAY_STATUS.LOADING:
            return <div className="loader" />;
         case OVERLAY_STATUS.ACTIVE:
            return <LockIcon className="dark-icon" size={21} />;
      }
   }

   hidePopover() {
      this.setState({ showingPopover: false });
   }

   render() {
      if (this.state.status === OVERLAY_STATUS.ACTIVE) {
         this.props.map.dragging.disable();
      }

      return (
         <div className="save-current-map-wrapper">
            {this.state.showingPopover && (
               <div
                  className="save-current-map-popup"
                  onClick={this.hidePopover.bind(this)}
               >
                  Scrolling and zooming are now disabled. Click to reset overlay
                  and unlock.
               </div>
            )}
            <div
               className="save-current-map"
               onClick={this.toggleOverlay.bind(this)}
            >
               {this.getContent()}
            </div>
         </div>
      );
   }
}
