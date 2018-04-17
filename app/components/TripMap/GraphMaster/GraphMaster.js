// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom modules
import tripsData from "trips-data";
import GraphMasterToggle from "./GraphMasterToggle";
import Graph from "./Graph";
import { hexToRgba } from "utils";
import {
   parkingColor,
   includedColor,
   yellowColor
} from "!!sass-variable-loader!scss-variables";

export default class GraphMaster extends Component {
   constructor(props) {
      super(props);

      this.state = {
         active: false,
         data: {
            tod: [],
            tripDistance: [],
            tripTime: []
         },
         colors: {
            tod: parkingColor,
            tripDistance: includedColor,
            tripTime: yellowColor
         }
      };
   }

   componentDidMount() {
      tripsData.onChange(() => {
         this.setState({
            ...this.state,
            data: {
               tod: tripsData.groupDimenBy(tripsData.dimensions.time),
               tripDistance: tripsData.groupDimenBy(
                  tripsData.dimensions.tripDist,
                  td => {
                     return Math.floor(td / 2) * 2;
                  }
               ),
               tripTime: tripsData.groupDimenBy(
                  tripsData.dimensions.tripTime,
                  tt => {
                     if (tt < 60) {
                        return Math.floor(tt / 2) * 2;
                     } else {
                        return 61; // should have a label of 60+
                     }
                  }
               )
            }
         });
      });
   }

   toggleGraphMaster() {
      this.setState({ active: !this.state.active });
   }

   render() {
      return (
         <div className="GraphMaster">
            <GraphMasterToggle
               toggle={this.toggleGraphMaster.bind(this)}
               active={this.state.active}
            />
            {this.state.active &&
               this.state.data && (
                  <div className="GraphMaster__Content">
                     <Graph
                        data={this.state.data.tod}
                        xAttr="key"
                        yAttr="value"
                        title="Time of Day (hr)"
                        color={this.state.colors.tod}
                     />
                     <Graph
                        data={this.state.data.tripDistance}
                        xAttr="key"
                        yAttr="value"
                        title="Trip Distance (km)"
                        color={this.state.colors.tripDistance}
                     />
                     <Graph
                        data={this.state.data.tripTime}
                        xAttr="key"
                        yAttr="value"
                        title="Trip Time (min)"
                        color={this.state.colors.tripTime}
                     />
                  </div>
               )}
         </div>
      );
   }
}
