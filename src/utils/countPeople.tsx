import { Location } from "../types";

export default function countPeople(
  structureShows: string,
  locations: any,
  rel: any,
  occ: any
) {
  let sum = 0;
  if (structureShows === "rel") {
    locations.forEach((l: Location) => {
      Object.keys(rel).forEach((key) => {
        if (rel[key] && l[key]) {
          sum = sum + parseInt(l[key]);
        }
      });
    });
  }
  if (structureShows === "occ") {
    locations.forEach((l: Location) => {
      Object.keys(occ).forEach((key) => {
        if (occ[key] && l[key]) {
          sum = sum + parseInt(l[key]);
        }
      });
    });
  }
  return sum;
}
