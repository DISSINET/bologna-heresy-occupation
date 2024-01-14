import { Location } from "../types";

export default function countPeople(
  structureShows: string,
  locations: any,
  rel: any,
  occ: any,
  sizeShows: any,
  sex: any,
  pos: any
) {
  let sum = 0;
  if (structureShows === "rel") {
    if (sizeShows === "pos") {
      if (pos.dep && pos.nondep) {
        locations.forEach((l: Location) => {
          Object.keys(rel).forEach((key) => {
            if (rel[key] && l[key]) {
              sum = sum + parseInt(l[key]);
            }
          });
        });
      } else {
        if (pos.dep) {
          locations.forEach((l: Location) => {
            Object.keys(rel).forEach((key) => {
              if (rel[key] && l[`d_${key}`]) {
                sum = sum + parseInt(l[`d_${key}`]);
              }
            });
          });
        }
        if (pos.nondep) {
          locations.forEach((l: Location) => {
            Object.keys(rel).forEach((key) => {
              if (rel[key] && l[`n_${key}`]) {
                sum = sum + parseInt(l[`n_${key}`]);
              }
            });
          });
        }
      }
    }

    if (sizeShows === "sex") {
      if (sex.male && sex.female) {
        locations.forEach((l: Location) => {
          Object.keys(rel).forEach((key) => {
            if (rel[key] && l[key]) {
              sum = sum + parseInt(l[key]);
            }
          });
        });
      } else {
        if (sex.male) {
          locations.forEach((l: Location) => {
            Object.keys(rel).forEach((key) => {
              if (rel[key] && l[`m_${key}`]) {
                sum = sum + parseInt(l[`m_${key}`]);
              }
            });
          });
        }
        if (sex.female) {
          locations.forEach((l: Location) => {
            Object.keys(rel).forEach((key) => {
              if (rel[key] && l[`f_${key}`]) {
                sum = sum + parseInt(l[`f_${key}`]);
              }
            });
          });
        }
      }
    }
  }
  if (structureShows === "occ") {
    if (sizeShows === "pos") {
      if (pos.dep && pos.nondep) {
        locations.forEach((l: Location) => {
          Object.keys(occ).forEach((key) => {
            if (occ[key] && l[key]) {
              sum = sum + parseInt(l[key]);
            }
          });
        });
      } else {
        if (pos.dep) {
          locations.forEach((l: Location) => {
            Object.keys(occ).forEach((key) => {
              if (occ[key] && l[`d_${key}`]) {
                sum = sum + parseInt(l[`d_${key}`]);
              }
            });
          });
        }
        if (pos.nondep) {
          locations.forEach((l: Location) => {
            Object.keys(occ).forEach((key) => {
              if (occ[key] && l[`n_${key}`]) {
                sum = sum + parseInt(l[`n_${key}`]);
              }
            });
          });
        }
      }
    }

    if (sizeShows === "sex") {
      if (sex.male && sex.female) {
        locations.forEach((l: Location) => {
          Object.keys(occ).forEach((key) => {
            if (occ[key] && l[key]) {
              sum = sum + parseInt(l[key]);
            }
          });
        });
      } else {
        if (sex.male) {
          locations.forEach((l: Location) => {
            Object.keys(occ).forEach((key) => {
              if (occ[key] && l[`m_${key}`]) {
                sum = sum + parseInt(l[`m_${key}`]);
              }
            });
          });
        }
        if (sex.female) {
          locations.forEach((l: Location) => {
            Object.keys(occ).forEach((key) => {
              if (occ[key] && l[`f_${key}`]) {
                sum = sum + parseInt(l[`f_${key}`]);
              }
            });
          });
        }
      }
    }
  }
  return sum;
}
