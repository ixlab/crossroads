// external modules
import React, { Component } from "react";

class SocketTest extends Component {
   componentWillMount() {
      this.socket.on("heatmap grid", heatmap => this.setState({ heatmap }));
   }

   constructor(props) {
      super(props);
      this.socket = io();

      this.state = { heatmap: [] };
   }

   sendData() {
      this.socket.emit("heatmap grid", {
         timestamps: [1448237701, 1448487601],
         round: 3
      });
   }

   render() {
      return (
         <div id="socket-test-wrapper">
            <h2 className="text-center">Socket Test</h2>
            <hr className="reg-spacer" />
            <h4>Data:</h4>
            <ul>
               {this.state.heatmap.map((item, key) => (
                  <li key={key}>
                     {item.lat}, {item.lng}, {item.intensity}
                  </li>
               ))}
            </ul>
            <button
               className="btn"
               type="button"
               onClick={this.sendData.bind(this)}
            >
               Send Data
            </button>
         </div>
      );
   }
}

export default SocketTest;
