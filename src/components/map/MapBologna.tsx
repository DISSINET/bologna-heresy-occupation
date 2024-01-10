import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSliceBologna";
import MapControlsBologna from "./MapControlsBologna";
import MapScaleBologna from "./MapScaleBologna";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations.json";
import getResidenceNames from "../../utils/getResidenceName";
import PieChartLayer from "../../maplib/PieChartLayer";
import { InputGroup } from "react-bootstrap";
import { Occupations } from "../../dicts/occupations";
import { Religions } from "../../dicts/religion";
import { PieChartData } from "../../types";

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
  function buidPieChartData(d: any) {
    // non zero object entries
    const fn = (obj: any) =>
      Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== 0));

    let data: PieChartData = {};
    if (structureShows === "rel") {
      data = {
        cathar: d.cathar_milieu,
        apostolic: d.apostolic_milieu,
        other: d.other_heterodoxy,
        unknown: d.undef_heresy,
      };
    }
    if (structureShows === "occ") {
      data = {
        church: d.church,
        craft: d.craft,
        diss: d.diss,
        free: d.free,
        man: d.man,
        qual: d.qual,
        merch: d.merch,
        offi: d.offi,
        serv: d.serv,
        sp: d.sp,
        unknown: d.undef_occ,
      };
    }
    data = fn(data);
    return data;
  }

  function createSVGIcon(idx: any, d: any) {
    let size = getRadius(d);
    let line = getHiglight(d);
    const data = buidPieChartData(d);
    const circleLength = Math.PI * ((size / 4) * 2);
    const totalValue = Object.values(data).reduce((a: any, b: any) => a + b, 0);
    let spaceLeft = circleLength;

    let circles = Object.keys(data).map((key: any) => {
      let color;
      if (structureShows === "occ") {
        color = occ[key]
          ? Occupations.filter((e) => e.id == key)[0].color
          : "none";
      }

      if (structureShows === "rel") {
        color = rel[key]
          ? Religions.filter((e) => e.id == key)[0].color
          : "none";
      }
      let output = `<circle cx="${size / 2}" cy="${size / 2}" r="${
        size / 4
      }" fill="none" stroke="${color}" stroke-width="${
        size / 2
      }" stroke-dasharray="${spaceLeft} ${circleLength}"/>`;

      spaceLeft -= (data[key] / totalValue) * circleLength;
      return output;
    });

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${circles}
      <circle cx="${size / 2}" cy="${size / 2}" r="${
      size / 2 - line
    }" fill="none" stroke="darkgoldenrod" stroke-width="${line}"/>
    </svg>
  `;
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
      url: svgToDataURL(createSVGIcon(index, d)),
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
            <small>238 people</small>
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
