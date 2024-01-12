import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSliceBologna";
import { selectLocation } from "./../MainSlice";
import MapControlsBologna from "./MapControlsBologna";
import MapScaleBologna from "./MapScaleBologna";
import locations from "../../data/locations.json";
import getResidenceNames from "../../utils/getResidenceName";
import { InputGroup } from "react-bootstrap";
import createSVGIcon from "../../utils/makePieChart";
import countPeople from "../../utils/countPeople";

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
  const sizeShows = useAppSelector((state) => state.main.sizeShows);
  const sex = useAppSelector((state) => state.main.sex);
  const pos = useAppSelector((state) => state.main.pos);
  const structureShows = useAppSelector((state) => state.main.structureShows);
  const rel = useAppSelector((state) => state.main.rel);
  const occ = useAppSelector((state) => state.main.occ);

  function getHiglight(d: any): number {
    if (selectedLocation["residence_id"] == d.residence_id) {
      return 3;
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
      return Math.log10(dep + nondep + 1) * 40;
    } else {
      let male = sex.male ? parseInt(d.male) : 0;
      let female = sex.female ? parseInt(d.female) : 0;
      return Math.log10(male + female + 1) * 40;
    }
  }

  function svgToDataURL(svg: any) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const plcs = new IconLayer({
    id: "plcs",
    data: locations,
    pickable: true,
    stroked: true,
    filled: true,
    getPosition: (d: any) => [
      d.residence_x_coordinates,
      d.residence_y_coordinates,
    ],
    opacity: 0.8,
    sizeScale: 1,
    getIcon: (d, { index }) => ({
      url: svgToDataURL(
        createSVGIcon(d, getRadius, getHiglight, structureShows, rel, occ)
      ),
      width: getRadius(d),
      height: getRadius(d),
    }),
    getSize: (d) => getRadius(d),
    // hover buffer around object
    //onHover: TODO set shadow or something

    onClick: (object) => object && dispatchSelectedLocation(object.object),

    // prevent Z-fighting in tilted view
    parameters: {
      depthTest: false,
    },
    // like useEffect <function>:<value change that triggers rerun>
    updateTriggers: {
      getSize: [pos, sex, sizeShows],
      getIcon: [selectedLocation, occ, rel, structureShows],
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
          padding: "5px",
        }}
      >
        <InputGroup>
          <InputGroup.Text className="boxShadow">
            <b>Bologna</b>
          </InputGroup.Text>
          <InputGroup.Text className="boxShadow">
            <small>
              {countPeople(structureShows, locations, rel, occ)} people
            </small>
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
