// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom modules
import DataTextOverlay from "./DataTextOverlay";
import DataPointsOverlay from "./DataPointsOverlay";
import DataPolylineOverlay from "./DataPolylineOverlay";
import DataPolygonOverlay from "./DataPolygonOverlay";

export default class DataOverlayManager extends Component {
   static propTypes = {
      map: PropTypes.object.isRequired,
      tableName: PropTypes.string.isRequired,
      overlayData: PropTypes.object
   };

   static defaultProps = {
      overlayData: {}
   };

   constructor(props) {
      super(props);
   }

   render() {
      const {
         tableName,
         overlayData: { time, points, polylines, polygons }
      } = this.props;

      return (
         <div className="DataOverlayManager">
            {/* Miscellaneous time variant data */}
            {time &&
               time.otherColumns && (
                  <div className="DataOverlayManager__OtherColumns">
                     <DataTextOverlay tableName={tableName} {...time} />
                  </div>
               )}

            {/* Points to be plotted */}
            {points && (
               <div className="DataOverlayManager__Points">
                  <DataPointsOverlay
                     tableName={tableName}
                     map={this.props.map}
                     {...points}
                  />
               </div>
            )}

            {/* Polylines to be drawn */}
            {polylines && (
               <div className="DataOverlayManager__Polylines">
                  <DataPolylineOverlay
                     tableName={tableName}
                     map={this.props.map}
                     {...polylines}
                  />
               </div>
            )}

            {/* Polygons to be drawn */}
            {polygons && (
               <div className="DataOverlayManager__Polygons">
                  <DataPolygonOverlay
                     tableName={tableName}
                     map={this.props.map}
                     {...polygons}
                  />
               </div>
            )}
         </div>
      );
   }
}
