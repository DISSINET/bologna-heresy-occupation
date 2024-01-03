import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSliceBologna";
import MapControlsBologna from "./MapControlsBologna";
import MapScaleBologna from "./MapScaleBologna";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations.json";
import getResidenceNames from "../../utils/getResidenceName";
import PieChartLayer from "../../maplib/PieChartLayer";

const MapComponentBologna = ({}): JSX.Element => {
  const mapState = useAppSelector((state) => state.bologna);
  const dispatch = useAppDispatch();

  function dispatchMapState(val: any) {
    dispatch(updateMapState(val));
  }
  function dispatchSelectedLocation(loc: any) {
    dispatch(selectLocation(loc));
  }
  const selectedLocation = useAppSelector(
    (state) => state.main.selectedLocation
  );

  function getHiglight(d: any): number {
    if (selectedLocation["residence_id"] == d.residence_id) {
      return mapState.zoom * 2;
    }
    return 1;
  }

  const city = new TileLayer({
    data: [
      "https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
      "https://b.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
      "https://c.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
      "https://d.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
    ],
    maxRequests: 20,
    pickable: true,
    minZoom: 0,
    maxZoom: 15,
    desaturate: 1,
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

  const plcs = new PieChartLayer({
    id: "plcs",
    data: locations,
    pickable: true,
    stroked: true,
    filled: true,
    getPosition: (d: any) => [
      d.residence_x_coordinates,
      d.residence_y_coordinates,
    ],
    opacity: 0.3,
    radiusMinPixels: 5,
    radiusScale: 1.2,
    getRadius: (d) => (parseInt(d.female) + parseInt(d.male)) * 10,
    getLineWidth: (d) => getHiglight(d),
    lineWidthMinPixels: 1,
    getFillColor: (d) => [200, 50, 200],
    getLineColor: (d) => [2, 20, 30],
    // hover buffer around object
    //onHover: TODO set shadow or something

    onClick: (object) => object && dispatchSelectedLocation(object.object),

    // prevent Z-fighting in tilted view
    parameters: {
      depthTest: false,
    },
    // like useEffect <function>:<value change that triggers rerun>
    updateTriggers: {
      getLineWidth: [selectedLocation],
    },
  });

  const layers = [city, plcs];
  return (
    <div onContextMenu={(evt) => evt.preventDefault()}>
      <MapControlsBologna />
      <div
        className="mt-2"
        style={{
          position: "absolute",
          left: "50px",
          top: "50%",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "5px",
        }}
      >
        <h5>
          <b>Bologna</b>
        </h5>
      </div>
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
