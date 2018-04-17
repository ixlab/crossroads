// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// custom modules
import { overlayDataForTable } from "./data-set-utils";
import DataOverlayManager from "./DataOverlayManager";

class DataOverlayMaster extends Component {
   static propTypes = {
      map: PropTypes.object.isRequired
   };

   componentWillMount() {
      this.updateOverlays();
   }

   componentWillReceiveProps(nextProps) {
      // update the overlays if the selected data sets changes
      if (
         this.props.dataSets.sort().join(",") !==
         nextProps.dataSets.sort().join(",")
      )
         this.updateOverlays(nextProps.dataSets);
   }

   constructor(props) {
      super(props);

      this.state = {
         overlayData: {}
      };
   }

   updateOverlays(dataSets = this.props.dataSets) {
      let overlayData = {};
      dataSets.forEach(tableName => {
         overlayData[tableName] = overlayDataForTable(tableName);
      });
      this.setState({ overlayData });
   }

   render() {
      return (
         <div className="DataOverlayMaster">
            <div className="DataOverlayMaster__ManagerTray">
               <div className="DataOverlayMaster__ManagerTray--inner">
                  {Object.keys(this.state.overlayData).map(tableName => (
                     <DataOverlayManager
                        key={tableName}
                        map={this.props.map}
                        tableName={tableName}
                        overlayData={this.state.overlayData[tableName]}
                     />
                  ))}
               </div>
            </div>
         </div>
      );
   }
}

export default connect(({ constraints: { dataSets } }) => ({ dataSets }))(
   DataOverlayMaster
);
