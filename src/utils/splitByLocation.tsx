// used only in pre-processing

import locations from "../data/locations.json";
import bolognaIds from "../data/bologna-ids.json";
import { Location } from "../types";

export default function splitByLocation() {
  let inB: any = [];
  locations.forEach((l: Location) => {
    if (l && l.residence_id) {
      let idsList = l.residence_id.split(",");
      let idsSet = new Set(idsList);
      idsList = Array.from(idsSet);
      idsList = idsList.filter((i) => i !== "");
      let intersect = idsList.filter((i) => bolognaIds.includes(i));
      if (intersect.length > 0) {
        inB.push(l);
      }
    }
  });
  let outB: any = [];
  locations.forEach((l: Location) => {
    if (l && l.residence_id) {
      let idsList = l.residence_id.split(",");
      let idsSet = new Set(idsList);
      idsList = Array.from(idsSet);
      idsList = idsList.filter((i) => i !== "");
      let intersect = idsList.filter((i) => bolognaIds.includes(i));
      if (intersect.length === 0) {
        outB.push(l);
      }
    }
  });
  return [inB, outB];
}
