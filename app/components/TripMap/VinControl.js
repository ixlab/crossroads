// external modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

// custom modules
import SmartSelect from "components/SmartSelect";
import Control from "components/Control";
import { vehicleActions, constraintActions } from "actions";

class VinControl extends Component {
   componentWillMount() {
      axios.get("/api/reference-data/vehicles").then(
         ({ data: { vehicles } }) => {
            this.props.updateAllVehicles(vehicles);
         },
         err => console.error(err)
      );
   }

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Control.Main className="VinControl" title="Vehicle Restriction">
            {!this.props.vehicles.all.length ? (
               <div className="loader" />
            ) : (
               <SmartSelect
                  options={this.props.vehicles.all.map(x => x.vin)}
                  selections={this.props.constraints.vins}
                  onChange={this.props.updateSelectedVehicles.bind(this)}
                  placeholder="No Vehicle Restriction"
               />
            )}
            <div className="btn-group">
               <div
                  className="btn no-margin-right text-center"
                  disabled={!this.props.constraints.vins.length}
                  onClick={this.props.clearSelectedVehicles.bind(this)}
               >
                  Clear Restriction
               </div>
            </div>
         </Control.Main>
      );
   }
}

export default connect(
   ({ vehicles, constraints }) => ({ vehicles, constraints }),
   {
      updateAllVehicles: vehicleActions.updateAll,
      updateSelectedVehicles: constraintActions.vehicles.update,
      clearSelectedVehicles: constraintActions.vehicles.clear
   }
)(VinControl);
