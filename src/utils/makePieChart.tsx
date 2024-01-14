import { Occupations } from "../dicts/occupations";
import { Religions } from "../dicts/religion";
import { PieChartData } from "../types";

function buidPieChartData(
  d: any,
  structureShows: any,
  sizeShows: any,
  sex: any,
  pos: any
) {
  // non zero object entries
  const fn = (obj: any) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== 0));

  //sex: { male: true, female: true },
  //pos: { dep: true, nondep: true },

  let data: PieChartData = {};

  if (structureShows === "rel") {
    if (sizeShows === "pos") {
      if (pos.dep && pos.nondep) {
        data = {
          undef_heresy: parseInt(d.undef_heresy),
          cathar_milieu: parseInt(d.cathar_milieu),
          apostolic_milieu: parseInt(d.apostolic_milieu),
          other_heterodoxy: parseInt(d.other_heterodoxy),
        };
      } else {
        if (pos.dep) {
          data = {
            undef_heresy: parseInt(d["d_undef_heresy"]),
            cathar_milieu: parseInt(d["d_cathar_milieu"]),
            apostolic_milieu: parseInt(d["d_apostolic_milieu"]),
            other_heterodoxy: parseInt(d["d_other_heterodoxy"]),
          };
        }

        if (pos.nondep) {
          data = {
            undef_heresy: parseInt(d["n_undef_heresy"]),
            cathar_milieu: parseInt(d["n_cathar_milieu"]),
            apostolic_milieu: parseInt(d["n_apostolic_milieu"]),
            other_heterodoxy: parseInt(d["n_other_heterodoxy"]),
          };
        }
      }
    }

    if (sizeShows === "sex") {
      if (sex.male && sex.female) {
        data = {
          undef_heresy: parseInt(d.undef_heresy),
          cathar_milieu: parseInt(d.cathar_milieu),
          apostolic_milieu: parseInt(d.apostolic_milieu),
          other_heterodoxy: parseInt(d.other_heterodoxy),
        };
      } else {
        if (sex.male) {
          data = {
            undef_heresy: parseInt(d["m_undef_heresy"]),
            cathar_milieu: parseInt(d["m_cathar_milieu"]),
            apostolic_milieu: parseInt(d["m_apostolic_milieu"]),
            other_heterodoxy: parseInt(d["m_other_heterodoxy"]),
          };
        }
        if (sex.female) {
          data = {
            undef_heresy: parseInt(d["f_undef_heresy"]),
            cathar_milieu: parseInt(d["f_cathar_milieu"]),
            apostolic_milieu: parseInt(d["f_apostolic_milieu"]),
            other_heterodoxy: parseInt(d["f_other_heterodoxy"]),
          };
        }
      }
    }
  }
  if (structureShows === "occ") {
    if (sizeShows === "pos") {
      if (pos.dep && pos.nondep) {
        data = {
          undef_occ: parseInt(d.undef_occ),
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
        };
      } else {
        if (pos.dep) {
          data = {
            undef_occ: parseInt(d["d_undef_occ"]),
            church: parseInt(d["d_church"]),
            craft: parseInt(d["d_craft"]),
            diss: parseInt(d["d_diss"]),
            free: parseInt(d["d_free"]),
            man: parseInt(d["d_man"]),
            qual: parseInt(d["d_qual"]),
            merch: parseInt(d["d_merch"]),
            offi: parseInt(d["d_offi"]),
            serv: parseInt(d["d_serv"]),
            sp: parseInt(d["d_sp"]),
          };
        }

        if (pos.nondep) {
          data = {
            undef_occ: parseInt(d["n_undef_occ"]),
            church: parseInt(d["n_church"]),
            craft: parseInt(d["n_craft"]),
            diss: parseInt(d["n_diss"]),
            free: parseInt(d["n_free"]),
            man: parseInt(d["n_man"]),
            qual: parseInt(d["n_qual"]),
            merch: parseInt(d["n_merch"]),
            offi: parseInt(d["n_offi"]),
            serv: parseInt(d["n_serv"]),
            sp: parseInt(d["n_sp"]),
          };
        }
      }
      }

      if (sizeShows === "sex") {
        if (sex.male && sex.female) {
          data = {
            undef_occ: parseInt(d.undef_occ),
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
          };
        } else {
          if (sex.male) {
            data = {
              undef_occ: parseInt(d["m_undef_occ"]),
              church: parseInt(d["m_church"]),
              craft: parseInt(d["m_craft"]),
              diss: parseInt(d["m_diss"]),
              free: parseInt(d["m_free"]),
              man: parseInt(d["m_man"]),
              qual: parseInt(d["m_qual"]),
              merch: parseInt(d["m_merch"]),
              offi: parseInt(d["m_offi"]),
              serv: parseInt(d["m_serv"]),
              sp: parseInt(d["m_sp"]),
            };
          }
          if (sex.female) {
            data = {
              undef_occ: parseInt(d["f_undef_occ"]),
              church: parseInt(d["f_church"]),
              craft: parseInt(d["f_craft"]),
              diss: parseInt(d["f_diss"]),
              free: parseInt(d["f_free"]),
              man: parseInt(d["f_man"]),
              qual: parseInt(d["f_qual"]),
              merch: parseInt(d["f_merch"]),
              offi: parseInt(d["f_offi"]),
              serv: parseInt(d["f_serv"]),
              sp: parseInt(d["f_sp"]),
            };
          }
        }
      }
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
  occ: any,
  sizeShows: string,
  sex: any,
  pos: any
) {
  let size = getRadius(d);
  let line = getHiglight(d);
  const data = buidPieChartData(d, structureShows, sizeShows, sex, pos);

  const totalValue = Object.values(data).reduce((a: any, b: any) => a + b, 0);
  const nonEmptyCount = Object.values(data).reduce(
    (a: any, item: any) => a + (item > 0 ? 1 : 0),
    0
  );
  let center = (size + 6) / 2;
  let radius = size / 2;
  let startAngle = 0;
  let endAngle = 0;

  let circles = Object.keys(data).map((key: any, index: number) => {
    let color;
    if (structureShows === "occ") {
      color = occ[key]
        ? Occupations.filter((e) => e.id == key)[0].color
        : "none";
    }

    if (structureShows === "rel") {
      color = rel[key] ? Religions.filter((e) => e.id == key)[0].color : "none";
    }

    if (nonEmptyCount === 1) {
      console.log("bla");
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
  });

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
