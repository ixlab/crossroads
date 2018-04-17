// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import L from "leaflet";
import MoreIcon from "react-icons/lib/fa/ellipsis-h";

// config
import mapConfig from "../../../config/map-config.json";

// custom modules
import { downloadUtils } from "utils";

const defaultTiles = L.tileLayer(
   `${mapConfig.defaultTiles}?access_token=${mapConfig.accessToken}`,
   {
      attribution: mapConfig.attribution,
      id: mapConfig.id,
      accessToken: mapConfig.accessToken,
      maxZoom: 18
   }
);
const darkTiles = L.tileLayer(
   `${mapConfig.darkTiles}?access_token=${mapConfig.accessToken}`,
   {
      attribution: mapConfig.attribution,
      id: mapConfig.id,
      accessToken: mapConfig.accessToken,
      maxZoom: 18
   }
);
const lightTiles = L.tileLayer(
   `${mapConfig.lightTiles}?access_token=${mapConfig.accessToken}`,
   {
      attribution: mapConfig.attribution,
      id: mapConfig.id,
      accessToken: mapConfig.accessToken,
      maxZoom: 18
   }
);

export default class MoreMenu extends Component {
   componentDidMount() {
      this.updateTileSet(this.state.activeTiles);
   }

   constructor(props) {
      super(props);

      this.state = {
         showMore: false,
         activeTiles: defaultTiles,
         isDownloadingMap: false
      };
   }

   // toggle more menu
   toggleMore() {
      if (!this.state.isDownloadingMap)
         this.setState({ showMore: !this.state.showMore });
   }

   /**
    * Update the leaflet tileset.
    * @param {string} tileSet - the tileset to be used
    */
   updateTileSet(tileSet) {
      this.props.map.removeLayer(this.state.activeTiles);
      this.props.map.addLayer(tileSet);
      this.setState({ activeTiles: tileSet });
   }

   downloadCurrentMap() {
      this.setState({ isDownloadingMap: true });

      const canvases = document.querySelectorAll(
         ".leaflet-overlay-pane canvas"
      );
      const svgs = document.querySelectorAll(".leaflet-overlay-pane svg");

      downloadUtils
         .getCurrentMap(this.props.map, canvases, svgs)
         .then(canvas => {
            downloadUtils
               .downloadFromCanvas(canvas, "current-map", "jpg")
               .then(() => {
                  this.setState({ isDownloadingMap: false });
               });
         });
   }

   render() {
      return (
         <div className="toggle-more" onClick={this.toggleMore.bind(this)}>
            {this.state.isDownloadingMap ? (
               <div className="loader" />
            ) : (
               <MoreIcon className="dark-icon" size={21} />
            )}
            {this.state.showMore && (
               <div className="more-menu">
                  <div className="menu-section">
                     <p className="section-title">General</p>
                     <div
                        className="more-item"
                        onClick={this.downloadCurrentMap.bind(this)}
                     >
                        Download Current Map
                     </div>
                  </div>
                  <div className="menu-section">
                     <p className="section-title">Appearance</p>
                     <div
                        className="more-item"
                        onClick={() => this.updateTileSet(defaultTiles)}
                     >
                        Detailed Tiles
                     </div>
                     <div
                        className="more-item"
                        onClick={() => this.updateTileSet(darkTiles)}
                     >
                        Dark Tiles
                     </div>
                     <div
                        className="more-item"
                        onClick={() => this.updateTileSet(lightTiles)}
                     >
                        Light Tiles
                     </div>
                  </div>
                  <div className="menu-section">
                     <p className="section-title">Data Sets</p>
                     <Link className="more-item" to="/data-upload">
                        Upload Data
                     </Link>
                     <Link className="more-item" to="/data-sets">
                        View Data Sets
                     </Link>
                  </div>
               </div>
            )}
         </div>
      );
   }
}

MoreMenu.propTypes = {
   map: PropTypes.object
};
