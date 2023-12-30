import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSliceBologna";
import MapControlsBologna from "./MapControlsBologna";
import MapScaleBologna from "./MapScaleBologna";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations.json";
import getResidenceNames from "../../utils/getResidenceName";

const MapComponentBologna = ({}): JSX.Element => {
  const mapState = useAppSelector((state) => state.bologna);
  const dispatch = useAppDispatch();

  function dispatchMapState(val: any) {
    dispatch(updateMapState(val));
  }
  function dispatchSelectedLocation(loc: any) {
    dispatch(selectLocation(loc));
  }

  const city = new TileLayer({
    data: [
      "https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      "https://d.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    ],
    /*
    data: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    ],
    data: ["https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"],
    */
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

  const plcs = new ScatterplotLayer({
    id: "plcs",
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
    //getRadius: (d) => parseInt(d.female) * 100,
    lineWidthMinPixels: 1,
    getFillColor: (d) => [3, 190, 3],
    getLineColor: (d) => [2, 20, 30],
    // hover buffer around object
    pickingRadius: 50,
    //onHover: TODO set shadow or something

    onClick: (object) => object && dispatchSelectedLocation(object.object),

    // prevent Z-fighting in tilted view
    parameters: {
      depthTest: false,
    },
  });

  const layers = [city, plcs];
  return (
    <div onContextMenu={(evt) => evt.preventDefault()}>
      <MapControlsBologna />
      <DeckGL
        viewState={mapState}
        onViewStateChange={(e: any) => dispatchMapState(e.viewState)}
        controller={true}
        layers={layers}
        getTooltip={({ object }) =>
          object && `${getResidenceNames(object.residence_id).join("\n")}`
        }
        getCursor={({ isDragging }) => (isDragging ? "arrow" : "arrow")}
        style={{
          top: "50%",
          height: "50%",
          width: "50%",
        }}
      />
      <MapScaleBologna definitionLayer={city} top={"95%"} />
    </div>
  );
};

export default MapComponentBologna;
