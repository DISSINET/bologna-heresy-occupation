import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { updateMapState } from "./MapSlice";
import MapControls from "./MapControls";
import MapScale from "./MapScale";
import { selectLocation } from "./../MainSlice";
import locations from "../../data/locations-out.json";
import bolbox from "../../data/bologna.json";
import getResidenceNames from "../../utils/getResidenceName";
import InputGroup from "react-bootstrap/InputGroup";
import { Occupations } from "../../dicts/occupations";
import { Religions } from "../../dicts/religion";
import { PieChartData } from "../../types";

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
  const structureShows = useAppSelector((state) => state.main.structureShows);
  const rel = useAppSelector((state) => state.main.rel);
  const occ = useAppSelector((state) => state.main.occ);

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
      return 3;
    }
    return 1;
  }

  function countPeople() {
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
      return Math.log10(dep + nondep + 1) * 40;
    } else {
      let male = sex.male ? parseInt(d.male) : 0;
      let female = sex.female ? parseInt(d.female) : 0;
      // logarithmic scale, +1 to show
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
        cathar: parseInt(d.cathar_milieu),
        apostolic: parseInt(d.apostolic_milieu),
        other: parseInt(d.other_heterodoxy),
        unknown: parseInt(d.undef_heresy),
      };
    }
    if (structureShows === "occ") {
      data = {
        church: parseInt(d.church),
        craft: parseInt(d.craft),
        diss: parseInt(d.diss),
        free: parseInt(d.free),
        man: parseInt(d.man),
        qual: parseInt(d.qual),
        merch: parseInt(d.merch),
        offi: parseInt(d.offi),
        serv: parseInt(d.serv),
        sp: parseInt(d.sp),
        unknown: parseInt(d.undef_occ),
      };
    }
    data = fn(data);
    return data;
  }

  function createSVGIcon(idx: any, d: any) {
    let size = getRadius(d);
    let line = getHiglight(d);
    const data = buidPieChartData(d);

    const totalValue = Object.values(data).reduce((a: any, b: any) => a + b, 0);
    let center = (size + 6) / 2;
    let radius = size / 2;
    let startAngle = 0;
    let endAngle = 0;

    let circles = Object.keys(data).map(
      (key: any, index: number, elements: string[]) => {
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

        const sliceAngle = (data[key] / totalValue) * 360;
        const largeArcFlag = sliceAngle > 180 ? 1 : 0;

        startAngle = endAngle;
        endAngle = startAngle + sliceAngle;

        const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
        const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
        const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
        const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);

        const pathData = [
          `M ${center},${center}`,
          `L ${startX},${startY}`,
          `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
          "Z",
        ].join(" ");
        const out = `<path key="${index}" d="${pathData}" fill="${color} " />`;

        return out;
      }
    );

    return `
<svg width="${size + 6}" height="${size + 6}" viewBox="0 0 ${size + 6} ${
      size + 6
    }" xmlns="http://www.w3.org/2000/svg">
${circles}
  <circle cx="${(size + 6) / 2}" cy="${(size + 6) / 2}" r="${
      size / 2
    }" fill="none" stroke="sienna" stroke-width="${line}"/>
</svg>
`;
  }

  function svgToDataURL(svg: any) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const places = new IconLayer({
    id: "places",
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
            <small>{countPeople()} people</small>
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
