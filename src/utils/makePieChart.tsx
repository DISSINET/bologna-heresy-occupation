import { Occupations } from "../dicts/occupations";
import { Religions } from "../dicts/religion";
import { PieChartData } from "../types";

function buidPieChartData(d: any, structureShows: any) {
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

export default function createSVGIcon(
  d: any,
  getRadius: any,
  getHiglight: any,
  structureShows: string,
  rel: any,
  occ: any
) {
  let size = getRadius(d);
  let line = getHiglight(d);
  const data = buidPieChartData(d, structureShows);

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

      if (totalValue === 1) {
        return `<circle cx="${(size + 6) / 2}" cy="${(size + 6) / 2}" r="${
          size / 2
        }" fill="${color}" stroke-width="${size / 2}"/>`;
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
<circle cx="${(size + 6) / 2}" cy="${(size + 6) / 2}" r="${
    size / 2
  }" fill="white" stroke="none"/>
${circles}
  <circle cx="${(size + 6) / 2}" cy="${(size + 6) / 2}" r="${
    size / 2
  }" fill="none" stroke="sienna" stroke-width="${line}"/>
</svg>
`;
}
