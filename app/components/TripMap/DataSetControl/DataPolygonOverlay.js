// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import L from "leaflet";

// custom modules
import { randomColor } from "utils";
import DataOverlayBlock from "./DataOverlayBlock";
import ColorPicker from "components/ColorPicker";

export default class DataPolygonOverlay extends Component {
   static propTypes = {
      tableName: PropTypes.string,
      polygonColumn: PropTypes.string,
      map: PropTypes.object
   };

   getPolygons() {
      const { tableName, polygonColumn } = this.props;
      return window.db.exec(`
			SELECT ${polygonColumn}
				FROM ${tableName};
		`)[0].values;
   }

   componentWillMount() {
      this.layerGroup = L.layerGroup();
      this.getPolygons().forEach(([polygon]) => {
         L.polygon(JSON.parse(polygon), {
            color: this.state.color,
            weight: 2,
            fillOpacity: 0.15,
            opacity: 0.3
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
            className="DataPolygonOverlay"
            header={`${this.props.tableName} polygons`}
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
