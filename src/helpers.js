import d3 from "d3";
import { zoomAction } from "./zoom";

export function buildPaletteScale(values, colorRange = ["#fde2ce", "#f7a05f"]) {
  const scaleDomain = d3.extent(values);

  return d3.scale
    .linear()
    .domain(scaleDomain)
    .range(colorRange);
}

export function addMapEvents(datamap) {
  const regions = datamap.svg.selectAll(".datamaps-subunit");

  regions.on("mouseenter", onMouseChange.call(this, "mouseenter"));
  regions.on("mouseleave", onMouseChange.call(this, "mouseleave"));

  if (!this.props.disableRegionClicks) {
    regions.on("click", onMouseClick.bind(this));
  }
}

function onMouseClick(geo) {
  if (
    this.state.highlighted ||
    !this.props.dataset ||
    !this.props.dataset[geo.id]
  ) {
    return;
  }
  const c = this.datamap.path.centroid(geo);

  const coordinates = [
      -2 * c[0] + this.mapWidth / 2,
      -2 * c[1] + this.mapHeight / 2
    ],
    newScale = 2;

  this.setState({ highlighted: geo.id });

  zoomAction.call(
    this,
    { coordinates, newScale },
    { transition: true, scaleUpdate: true }
  );
}

function onMouseChange(eventType) {
  const self = this;
  return function(geo) {
    const mapChangeAttrs = { eventType, geo };

    mapChange.call(self, mapChangeAttrs);
  };
}

function mapChange({ eventType, geo }) {
  const props = {
    mouseleave: {
      active: {},
      inactive: {
        "fill-opacity": "1"
      }
    },
    mouseenter: {
      active: {
        fill: "#E67420"
      },
      inactive: {
        "fill-opacity": "0.1"
      }
    }
  };

  if (!this.props.dataset || !this.props.dataset[geo.id]) {
    return;
  }

  const styles = props[eventType];

  const { dataset } = this.props;
  const { dataArray } = this.state;

  const selection = d3.selectAll(
    dataArray.map(({ id }) =>
      this.datamap.svg.select(`.datamaps-subunit.${id}`).node()
    )
  );

  selection
    .style(
      "fill",
      function(obj) {
        obj.state = obj.id === geo.id ? "active" : "inactive";
        return styles[obj.state].fill || dataset[obj.id].fillColor;
      },
      "important"
    )
    .style("fill-opacity", function(obj) {
      return styles[obj.state]["fill-opacity"];
    });
}
