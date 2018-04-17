// external modules
import React, { Component, PropTypes } from "react";
import InfoIcon from "react-icons/lib/fa/info-circle";
import { Doughnut as DoughnutChart, Bar as BarChart } from "react-chartjs-2";

// custom modules
import Control from "components/Control";
import IconPopover from "components/IconPopover";
import { advancedSettingsActions } from "actions";
import tripsData from "trips-data";
import {
   accentColor,
   landuseColor,
   parkingColor
} from "!!sass-variable-loader!scss-variables";

export default class LatencyControl extends Component {
   static propTypes = {
      speculationActive: PropTypes.bool.isRequired
   };

   static defaultProps = {
      speculationActive: false
   };

   constructor(props) {
      super(props);
      this.state = {
         network: true,
         api: true,
         dbLatency: true
      };
   }

   componentDidMount() {
      tripsData.onChange(() => {
         this.forceUpdate();
      });
   }

   toggleCheckbox(key) {
      this.setState({ [key]: !this.state[key] });
   }

   render() {
      const data = tripsData.latencyManager.getNonSpeculationHistogram({
         ...this.state
      });

      const doughnutData = [
         Math.round(tripsData.latencyManager.getAvgAPILatency()),
         Math.round(tripsData.latencyManager.getAvgNetworkLatency()),
         Math.round(tripsData.latencyManager.getAvgDBLatency())
      ];
      const doughnutColors = [accentColor, landuseColor, parkingColor];

      return (
         <Control.Sub
            className="LatencyControl"
            title="Latency"
            icon={<InfoIcon />}
            helpText="The latency refers to the amount of time it takes for a query to be returned from the database. Using these controls and changing the sampling rate will affect latency. Figures are in milliseconds."
         >
            {/* Overall Average Latency */}
            <DoughnutChart
               data={{
                  labels: ["API", "Network", "DB"],
                  datasets: [
                     {
                        backgroundColor: doughnutColors,
                        data: doughnutData
                     }
                  ]
               }}
               options={{
                  legend: { display: false },
                  cutoutPercentage: 70,
                  rotation: -Math.PI,
                  circumference: Math.PI,
                  layout: { padding: 25 }
               }}
            />

            {/* Query Speed Histogram */}
            <div className="LatencyHistogram">
               <div className="LatencyHistogram__Graph">
                  <BarChart
                     data={{
                        labels: tripsData.latencyManager.getHistogramLabels(),
                        datasets: [
                           {
                              label: "Query Latency",
                              backgroundColor: accentColor,
                              data
                           }
                        ]
                     }}
                     options={{
                        scales: {
                           yAxes: [
                              {
                                 display: true,
                                 stacked: true,
                                 ticks: {
                                    min: 0,
                                    max: Math.max(10, Math.max(...data))
                                 }
                              }
                           ]
                        }
                     }}
                  />
               </div>

               <div className="LatencyHistogram__Legend">
                  <div className="Input--Checkbox">
                     <input
                        id="NetworkCheckbox"
                        name="NetworkCheckbox"
                        type="checkbox"
                        checked={this.state.network}
                        onChange={() => this.toggleCheckbox("network")}
                     />
                     <label htmlFor="NetworkCheckbox">&nbsp;Network</label>
                  </div>

                  <div className="Input--Checkbox">
                     <input
                        id="APICheckbox"
                        name="APICheckbox"
                        type="checkbox"
                        checked={this.state.api}
                        onChange={() => this.toggleCheckbox("api")}
                     />
                     <label htmlFor="APICheckbox">&nbsp;API</label>
                  </div>

                  <div className="Input--Checkbox">
                     <input
                        id="SesameCheckbox"
                        name="SesameCheckbox"
                        type="checkbox"
                        checked={this.state.dbLatency}
                        onChange={() => this.toggleCheckbox("dbLatency")}
                     />
                     <label htmlFor="SesameCheckbox">&nbsp;DB</label>
                  </div>
               </div>
            </div>
         </Control.Sub>
      );
   }
}
