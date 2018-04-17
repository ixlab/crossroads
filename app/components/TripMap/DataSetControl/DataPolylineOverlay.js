// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import ColorPicker from "components/ColorPicker";

// custom modules
import { randomColor } from "utils";
import DataOverlayBlock from "./DataOverlayBlock";

export default class DataPolylineOverlay extends Component {
   static propTypes = {
      tableName: PropTypes.string,
      polylineColumn: PropTypes.string,
      map: PropTypes.object
   };

   getPolylines() {
      const { tableName, polylineColumn } = this.props;
      return window.db.exec(`
			SELECT ${polylineColumn}
				FROM ${tableName};
		`)[0].values;
   }

   componentWillMount() {
      this.layerGroup = L.layerGroup();
      this.getPolylines().forEach(([polyline]) => {
         L.polyline(JSON.parse(polyline), {
            color: this.state.color,
            opacity: "0.5"
         }).addTo(this.layerGroup);
      });
      this.props.map.addLayer(this.layerGroup);
   }

   componentWillUnmount() {
      this.layerGroup.eachLayer(l => this.layerGroup.removeLayer(l));
   }

   constructor(props) {
      super(props);

      this.state = {
         color: randomColor()
      };
   }

   colorChanged(color) {
      this.setState({ color });
      this.layerGroup.eachLayer(l => l.setStyle({ color }));
   }

   render() {
      return (
         <DataOverlayBlock
            className="DataPolylineOverlay"
            header={`${this.props.tableName} polyline`}
            color={this.state.color}
         >
            <ColorPicker
               initialColor={this.state.color}
               colorChanged={this.colorChanged.bind(this)}
            />
         </DataOverlayBlock>
      );
   }
}
