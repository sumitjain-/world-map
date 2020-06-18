import React from "react";
import Datamap from "datamaps";
import { Dot } from "./Dot";
import { zoomClickHandler } from "./zoom";
import { buildPaletteScale, mapDone } from "./helpers";
/*
TODOS
* Country click handler
* Country hover and tooltip handler
* Color palette stuff
**/

const mapStyles = {
  width: "100%",
  height: "300px"
};

export class MapContainer extends React.Component {
  static getDerivedStateFromProps(props, state) {
    return {
      dataArray: Object.keys(props.dataset).map(id => ({
        id,
        ...props.dataset[id]
      }))
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      highlighted: null
    };
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.drawMap();
  }

  componentDidUpdate() {
    this.drawMap();
  }

  drawMap = () => {
    if (!this.datamap) {
      this.datamap = new Datamap({
        element: this.mapRef.current,
        data: this.buildDataset(),
        fills: {
          defaultFill: "#f5f5f5"
        },
        scope: "world",
        geographyConfig: {
          borderColor: "#dedede",
          popupTemplate: () => null,
          highlightFillColor(geo) {
            return geo.fillColor || "#f5f5f5";
          }
        },
        done: mapDone.bind(this)
      });

      window.datamap = this.datamap;
    }
  };

  buildDataset = () => {
    const vals = Object.values(this.props.dataset);

    const palette = buildPaletteScale(
      vals.map(({ value }) => value),
      this.props.colorRange
    );

    vals.forEach(obj => {
      obj.fillColor = palette(obj.value);
    });

    return this.props.dataset;
  };

  render() {
    return (
      <div style={{ position: "relative" }}>
        <div ref={this.mapRef} className="map-container" style={mapStyles} />
        <Dot />
        <div
          className="buttons"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            onClick={() => {
              zoomClickHandler.call(this, 0.5);
            }}
            disabled={this.state.scale === 4}
            style={{ marginRight: 8 }}
          >
            +
          </button>
          <button
            onClick={() => {
              zoomClickHandler.call(this, -0.5);
            }}
            disabled={this.state.scale === 1}
          >
            -
          </button>
        </div>
      </div>
    );
  }
}
