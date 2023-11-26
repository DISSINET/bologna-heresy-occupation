export class Location {
  residence_x_coordinates?: number = 0;
  residence_y_coordinates?: number = 0;
  name?: string = "";
  residence_id?: string = "";
  cathar_milieu?: number = 0;
  apostolic_milieu?: number = 0;
  other_heterodoxy?: number = 0;
  male?: number = 0;
  female?: number = 0;
  dep?: number = 0;
  non_dep?: number = 0;
  church?: number = 0;
  craft?: number = 0;
  diss?: number = 0;
  free?: number = 0;
  man?: number = 0;
  qual?: number = 0;
  merch?: number = 0;
  offi?: number = 0;
  serv?: number = 0;
  sp?: number = 0;
  undef_heresy?: number = 0;
  undef_occ?: number = 0;
}

export interface INestDictionary<T> {
  [index: string]: T;
}

export interface IDictionary {
  [index: string]: string | number | boolean | null;
}
