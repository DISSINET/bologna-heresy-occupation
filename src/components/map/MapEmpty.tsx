import DeckGL from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations-none.json";
import getResidenceNames from "../../utils/getResidenceName";
import InputGroup from "react-bootstrap/InputGroup";
import createSVGIcon from "../../utils/makePieChart";
import countPeople from "../../utils/countPeople";

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
  const structureShows = useAppSelector((state) => state.main.structureShows);
  const rel = useAppSelector((state) => state.main.rel);
  const occ = useAppSelector((state) => state.main.occ);

  function getHiglight(d: any): number {
    if (selectedLocation["residence_id"] == d.residence_id) {
      return 3;
    }
    return 1;
  }

  function getRadius(d: any): number {
    if (sizeShows === "pos") {
      let dep = pos.dep ? parseInt(d.dep) : 0;
      let nondep = pos.nondep ? parseInt(d.non_dep) : 0;
      return (dep + nondep) * 0.8;
    } else {
      let male = sex.male ? parseInt(d.male) : 0;
      let female = sex.female ? parseInt(d.female) : 0;
      return (male + female) * 0.8;
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
        createSVGIcon(
          d,
          getRadius,
          getHiglight,
          structureShows,
          rel,
          occ,
          sizeShows,
          sex,
          pos
        )
      ),
      width: getRadius(d),
      height: getRadius(d),
    }),
    getSize: (d) => getRadius(d),

    onClick: (object) => object && dispatchSelectedLocation(object.object),

    // prevent Z-fighting in tilted view
    parameters: {
      depthTest: false,
    },
    // like useEffect <function>:<value change that triggers rerun>
    updateTriggers: {
      getSize: [pos, sex, sizeShows],
      getIcon: [
        selectedLocation,
        occ,
        rel,
        structureShows,
        pos,
        sex,
        sizeShows,
      ],
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
          padding: "5px",
          paddingLeft: "15px",
        }}
      >
        <InputGroup>
          <InputGroup.Text className="boxShadowThin">
            <b>Unknown/non-geocoded location</b>
          </InputGroup.Text>
          <InputGroup.Text className="boxShadowThin">
            <small>
              {countPeople(
                structureShows,
                locations,
                rel,
                occ,
                sizeShows,
                sex,
                pos
              )}{" "}
              people
            </small>
          </InputGroup.Text>
        </InputGroup>
      </div>
      <DeckGL
        viewState={mapState}
        controller={true}
        layers={layers}
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
