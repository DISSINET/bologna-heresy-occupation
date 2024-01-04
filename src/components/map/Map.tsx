import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, GeoJsonLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSlice";
import MapControls from "./MapControls";
import MapScale from "./MapScale";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations-out.json";
import bolbox from "../../data/bologna.json";
import getResidenceNames from "../../utils/getResidenceName";
import PieChartLayer from "../../maplib/PieChartLayer";
import InputGroup from "react-bootstrap/InputGroup";

const MapComponent = ({}): JSX.Element => {
  const mapState = useAppSelector((state) => state.map);
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
  const sizeShows = useAppSelector((state) => state.main.sizeShows);
  const sex = useAppSelector((state) => state.main.sex);
  const pos = useAppSelector((state) => state.main.pos);

  const cityLevel = new TileLayer({
    data: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
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

  function getHiglight(d: any): number {
    if (selectedLocation["residence_id"] == d.residence_id) {
      return mapState.zoom * 10;
    }
    return mapState.zoom * 3;
  }

  function countValues() {
    let sum = 0;
    locations.forEach((l) => {
      sum = sum + l.male + l.female;
    });
    return sum;
  }

  function getRadius(d: any): number {
    if (sizeShows === "pos") {
      let dep = pos.dep ? parseInt(d.dep) : 0;
      let nondep = pos.nondep ? parseInt(d.non_dep) : 0;
      return (dep + nondep) * 10;
    } else {
      let male = sex.male ? parseInt(d.male) : 0;
      let female = sex.female ? parseInt(d.female) : 0;
      return (male + female) * 10;
    }
  }

  const places = new PieChartLayer({
    id: "places",
    data: locations,
    pickable: true,
    stroked: true,
    filled: true,
    getPosition: (d: any) => [
      d.residence_x_coordinates,
      d.residence_y_coordinates,
    ],
    opacity: 0.3,
    radiusScale: 100,
    getRadius: (d) => getRadius(d),
    getLineWidth: (d) => getHiglight(d),
    getFillColor: (d) => [200, 50, 200],
    getLineColor: (d) => [2, 20, 30],
    lineWidthScale: 20,
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
      getRadius: [pos, sex, sizeShows],
    },
  });

  const bolognabox = new GeoJsonLayer({
    id: "bolognabox",
    bolbox,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: "circle",
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    getPointRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
  });

  const layers = [cityLevel, places, bolognabox];
  return (
    <div onContextMenu={(evt) => evt.preventDefault()}>
      <MapControls />
      <div
        className="mt-2"
        style={{
          position: "absolute",
          left: "50px",
          zIndex: 1000,
        }}
      >
        <InputGroup>
          <InputGroup.Text className="boxShadow">
            <b>Locations outside Bologna</b>
          </InputGroup.Text>
          <InputGroup.Text className="boxShadow">
            <small>{countValues()} people</small>
          </InputGroup.Text>
        </InputGroup>
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
          height: "50%",
        }}
      />
      <MapScale definitionLayer={cityLevel} top={"45%"} />
    </div>
  );
};

export default MapComponent;
