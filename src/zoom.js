import d3 from "d3";

export function setZoom(datamap) {
  const mapObject = datamap.svg.node().getBoundingClientRect();
  const { width, height } = mapObject;
  this.mapWidth = width;
  this.mapHeight = height;

  const xScale = d3.scale
    .linear()
    .domain([-width / 2, width / 2])
    .range([0, width]);

  const yScale = d3.scale
    .linear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);

  const zoom = d3.behavior
    .zoom()
    .x(xScale)
    .y(yScale)
    .scaleExtent([1, 4])
    .center([width / 2, height / 2])
    .size([width, height])
    .on("zoom", zoomHandler.bind(this));

  return zoom;
}

export function zoomHandler() {
  const coordinates = d3.event.translate,
    newScale = d3.event.scale;

  zoomAction.call(this, { coordinates, newScale });
}

export function zoomClickHandler(factor) {
  const originalScale = this.zoom.scale();
  const inputTranslate = this.zoom.translate();
  const newScale = this.zoom.scale() + factor;

  const coordinates = [
    inputTranslate[0] - ((newScale - originalScale) * this.mapWidth) / 2,
    inputTranslate[1] - ((newScale - originalScale) * this.mapHeight) / 2
  ];

  zoomAction.call(
    this,
    { coordinates, newScale },
    { transition: true, scaleUpdate: true, resetHighlighted: true }
  );
}

export function checkForZoomReset({ newTranslate, width, height }) {
  const resetTranslate = [];

  if (newTranslate[0] <= width.max) {
    resetTranslate[0] = width.max;
  } else if (newTranslate[0] === 0) {
    resetTranslate[0] = 0;
  } else {
    resetTranslate[0] = newTranslate[0];
  }

  if (newTranslate[1] <= height.max) {
    resetTranslate[1] = height.max;
  } else if (newTranslate[1] === 0) {
    resetTranslate[1] = 0;
  } else {
    resetTranslate[1] = newTranslate[1];
  }

  this.zoom.translate(resetTranslate);
}

export function zoomAction(
  { coordinates, newScale },
  { transition = false, scaleUpdate = false, resetHighlighted = false } = {}
) {
  console.log("zoomAction ", { coordinates, newScale });
  const width = { full: -this.mapWidth },
    height = { full: -this.mapHeight },
    newTranslate = [];

  width.max = width.full * (newScale - 1);
  height.max = height.full * (newScale - 1);

  newTranslate[0] = Math.min(0, Math.max(coordinates[0], width.max));
  newTranslate[1] = Math.min(0, Math.max(coordinates[1], height.max));

  if (scaleUpdate) {
    this.zoom.scale(newScale);
    this.setState({ scale: this.zoom.scale() });
  }

  const transformString = `translate(${newTranslate}) scale(${newScale})`;

  const selection = this.datamap.svg.selectAll("g");

  if (transition) {
    selection
      .transition()
      .duration(350)
      .attr("transform", transformString);
  } else {
    selection.attr("transform", transformString);
  }

  checkForZoomReset.call(this, {
    newTranslate,
    width,
    height
  });

  if (resetHighlighted) {
    this.setState({ highlighted: null });
  }
}
