import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSlice";
import MapControls from "./MapControls";
import MapScale from "./MapScale";
import locations from "../../data/locations.json";

const MapComponent = ({}): JSX.Element => {
  const mapState = useAppSelector((state) => state.map);
  const dispatch = useAppDispatch();

  function dispatchMapState(val: any) {
    dispatch(updateMapState(val));
  }

  const cityLevel = new TileLayer({
    data: [
      "https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://d.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    ],
    maxRequests: 20,
    pickable: true,
    minZoom: 0,
    maxZoom: 15,
    tileSize: 256,
    // zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      }: any = props.tile;

      return [
        new BitmapLayer(props, {
          data: null as any,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  const places = new ScatterplotLayer({
    id: "places",
    data: locations,
    pickable: true,
    stroked: true,
    filled: true,
    getElevation: 30,
    getPosition: (d: any) => [
      d.residence_x_coordinates,
      d.residence_y_coordinates,
    ],
    opacity: 0.3,
    radiusMinPixels: mapState.zoom * 0.5,
    radiusMaxPixels: mapState.zoom * 5,
    getRadius: (d) => Math.sqrt(parseInt(d.male) + parseInt(d.female)),
    lineWidthMinPixels: 1,
    getFillColor: (d) => [3, 190, 3],
    getLineColor: (d) => [2, 20, 30],
    // hover buffer around object
    pickingRadius: 50,

    // prevent Z-fighting in tilted view
    parameters: {
      depthTest: false,
    },
  });

  const layers = [cityLevel, places];
  return (
    <div onContextMenu={(evt) => evt.preventDefault()}>
      <MapControls />
      <MapScale definitionLayer={cityLevel} />
      <DeckGL
        viewState={mapState}
        onViewStateChange={(e: any) => dispatchMapState(e.viewState)}
        controller={true}
        layers={layers}
        //getTooltip={({ object }) => object && `${treatMonasteryName(object.name, object.communities)}` }
        getCursor={({ isDragging }) => (isDragging ? "arrow" : "arrow")}
      />
    </div>
  );
};

export default MapComponent;
