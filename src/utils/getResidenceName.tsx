import { Residences } from "../dicts/residences";

export default function getResidenceNames(ids: string) {
  let idsList = ids.split(",");
  let idsSet = new Set(idsList);
  idsList = Array.from(idsSet);
  const output = idsList.map((e) => getResidenceName(e))
  return output;
}

function getResidenceName(id: string) {
  id = id.trim();
  let res = Residences.filter((e) => e.id === id);
  if (res.length > 0) {
    return res[0]["name"];
  } else return id;
}
