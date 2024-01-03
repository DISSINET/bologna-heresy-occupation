import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations-none.json";
import getResidenceNames from "../../utils/getResidenceName";
import PieChartLayer from "../../maplib/PieChartLayer";
import InputGroup from "react-bootstrap/InputGroup";

const MapComponentEmpty = ({}): JSX.Element => {
  const mapState = {
    longitude: 0,
    latitude: 0,
    zoom: 13,
    pitch: 0,
    bearing: 0,
    minZoom: 13,
    maxZoom: 15,
    transitionDuration: 500,
  };

  const dispatch = useAppDispatch();

  function dispatchSelectedLocation(loc: any) {
    dispatch(selectLocation(loc));
  }
  const selectedLocation = useAppSelector(
    (state) => state.main.selectedLocation
  );
  const sizeShows = useAppSelector((state) => state.main.sizeShows);
  const sex = useAppSelector((state) => state.main.sex);
  const pos = useAppSelector((state) => state.main.pos);

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

  function getRadius(d: any): number {
    if (sizeShows === "pos") {
      let dep = pos.dep ? parseInt(d.dep) : 0;
      let nondep = pos.nondep ? parseInt(d.non_dep) : 0;
      return (dep + nondep) * 2.3;
    } else {
      let male = sex.male ? parseInt(d.male) : 0;
      let female = sex.female ? parseInt(d.female) : 0;
      return (male + female) * 2.3;
    }
  }

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
    radiusScale: 1.5,
    getRadius: (d) => getRadius(d),
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
      getRadius: [pos, sex, sizeShows],
    },
  });

  const layers = [plcs];
  return (
    <div onContextMenu={(evt) => evt.preventDefault()}>
      <div
        className="mt-2"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 1000,
          padding: "5px",
          paddingLeft: "15px",
        }}
      >
        <InputGroup>
          <InputGroup.Text className="boxShadowThin">
            <b>Unspecified location</b>
          </InputGroup.Text>
          <InputGroup.Text className="boxShadowThin">
            <small>238 people</small>
          </InputGroup.Text>
        </InputGroup>
      </div>
      <DeckGL
        viewState={mapState}
        controller={true}
        layers={layers}
        getTooltip={({ object }) =>
          object && `${getResidenceNames(object.residence_id).join("\n")}`
        }
        getCursor={({ isDragging }) => (isDragging ? "arrow" : "arrow")}
        style={{
          top: "50%",
          height: "50%",
          width: "25%",
          left: "50%",
        }}
      />
    </div>
  );
};

export default MapComponentEmpty;
