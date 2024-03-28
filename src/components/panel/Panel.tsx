import { useState, useEffect } from "react";
import Hero from "./Hero";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import {
  Badge,
  ListGroup,
  Modal,
  Button,
  CloseButton,
  InputGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { GoLocation } from "react-icons/go";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import {
  selectLocation,
  setSizeShows,
  setStructureShows,
  changeSexDict,
  resetSexDict,
  changePosDict,
  resetPosDict,
  changeRelDict,
  resetRelDict,
  changeOccDict,
  resetOccDict,
  clearOccDict,
} from "../MainSlice";
import packageJson from "../../../package.json";
import { Card } from "react-bootstrap";
import getResidenceNames from "../../utils/getResidenceName";
import peopleData from "../../data/people.json";
import { INestDictionary, IDictionary } from "../../types";
import { Religions } from "../../dicts/religion";
import { Occupations } from "../../dicts/occupations";

type PanelComponentProps = {};

const PanelComponent = ({}: PanelComponentProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [infoModal, toggleInfoModal] = useState(true);
  const handleInfoModalClose = () => toggleInfoModal(false);
  const handleInfoModalShow = () => toggleInfoModal(true);

  const [allOccChecked, toggleAllOccChecked] = useState(true);
  const handleOccNotAll = () => toggleAllOccChecked(false);
  const handleOccAll = () => toggleAllOccChecked(true);

  const selectedLocation = useAppSelector(
    (state) => state.main.selectedLocation
  );
  const sizeShows = useAppSelector((state) => state.main.sizeShows);
  const structureShows = useAppSelector((state) => state.main.structureShows);

  const sex = useAppSelector((state) => state.main.sex);
  const pos = useAppSelector((state) => state.main.pos);
  const rel = useAppSelector((state) => state.main.rel);
  const occ = useAppSelector((state) => state.main.occ);

  const now = new Date();
  const suspects: INestDictionary<IDictionary> = peopleData;

  useEffect(() => {
    if (Object.values(occ).every(Boolean)) {
      handleOccAll();
    } else {
      handleOccNotAll();
    }
  }, [occ]);

  function setAllOccChecked() {
    if (allOccChecked) {
      dispatch(clearOccDict());
    } else {
      dispatch(resetOccDict());
    }
  }

  function deselectLocation() {
    dispatch(selectLocation({}));
  }
  function changeSizeShows(e: any) {
    dispatch(setSizeShows(e.target.value));
    dispatch(resetSexDict());
    dispatch(resetPosDict());
  }
  function changeStructureShows(e: any) {
    dispatch(setStructureShows(e.target.value));
    dispatch(resetRelDict());
    dispatch(resetOccDict());
  }
  function setSex(e: any) {
    dispatch(changeSexDict([e.target.id, !sex[e.target.id]]));
  }
  function setPos(e: any) {
    dispatch(changePosDict([e.target.id, !pos[e.target.id]]));
  }
  function setRel(e: any) {
    dispatch(changeRelDict([e.target.id, !rel[e.target.id]]));
  }
  function setOcc(e: any) {
    dispatch(changeOccDict([e.target.id, !occ[e.target.id]]));
  }

  function buildPeopleList(people: string) {
    const peopleList = people.split(",");
    const items = peopleList.map((i: string) => {
      if (i) {
        return (
          <ListGroup.Item>
            <Row>
              <Col xs={1}>
                {suspects[i].sex == "m" ? (
                  <BsGenderMale
                    style={{ color: "gray" }}
                    title="gender: male"
                  />
                ) : (
                  <BsGenderFemale
                    style={{ color: "gray" }}
                    title="gender: male"
                  />
                )}{" "}
              </Col>
              <Col style={{ cursor: "default" }}>
                {suspects[i].label}
                <small title="occupation type">
                  {suspects[i].occupation_type && (
                    <>
                      <div style={{ float: "right" }}>
                        <div
                          style={{
                            background: Occupations.filter(
                              (e) => e.name == suspects[i].occupation_type
                            )[0].color,
                          }}
                          className={"circle"}
                        ></div>
                        <span>
                          <i>&nbsp;{suspects[i].occupation_type}</i>
                        </span>
                      </div>
                    </>
                  )}
                </small>{" "}
                <br />
                {suspects[i].cathar_milieu && suspects[i].cathar_milieu != 0 ? (
                  <small title="religious affiliation">
                    <Badge bg="cathar_milieu">{"Cathar milieu"}</Badge>
                  </small>
                ) : (
                  ""
                )}{" "}
                {suspects[i].apostolic_milieu &&
                suspects[i].apostolic_milieu != 0 ? (
                  <small title="religious affiliation">
                    <Badge bg="apostolic_milieu">{"Apostolic milieu"}</Badge>
                  </small>
                ) : (
                  ""
                )}{" "}
                {suspects[i].other_heterodoxy &&
                suspects[i].other_heterodoxy != 0 ? (
                  <small title="religious affiliation">
                    <Badge bg="other_heterodoxy">{"other heterodoxy"}</Badge>
                  </small>
                ) : (
                  ""
                )}{" "}
                <small title="position in trial">
                  <Badge
                    bg="light"
                    text="dark"
                    style={{ border: "1px solid lightgray" }}
                  >
                    {suspects[i].deponent}
                  </Badge>
                </small>{" "}
              </Col>
            </Row>
          </ListGroup.Item>
        );
      }
    });
    return <ListGroup variant="flush">{items}</ListGroup>;
  }

  return (
    <div
      className="panel"
      data-testid="panel-wrapper"
      style={{
        maxHeight: "100%",
        bottom: 0,
        display: "flex",
        flexFlow: "column nowrap",
      }}
    >
      <Hero />
      <div
        style={{
          padding: "1em",
          overflowY: "scroll",
          display: "flex",
          flexFlow: "column nowrap",
          gap: "20px",
        }}
      >
        <div id="filter">
          <span>
            <b>Filtering and Legend</b>
          </span>
          <br />
          <InputGroup className="mb-2 mt-1" size="sm">
            <InputGroup.Text id="symbol-size">
              Filter symbol size by
            </InputGroup.Text>
            <Form.Select
              title="select symbol size value"
              value={sizeShows}
              onChange={(e) => changeSizeShows(e)}
            >
              <option value="pos">position in trial</option>
              <option value="sex">sex</option>
            </Form.Select>
          </InputGroup>
          {sizeShows == "pos" ? (
            <div className="mb-3">
              <Form.Check inline id={"dep"}>
                <Form.Check.Input
                  checked={pos.dep as any}
                  className={"check-secondary"}
                  type={"checkbox"}
                  onChange={(e) => setPos(e)}
                />
                <Form.Check.Label>{"deponent"}</Form.Check.Label>
              </Form.Check>
              <Form.Check inline id={"nondep"}>
                <Form.Check.Input
                  checked={pos.nondep as any}
                  className={"check-secondary"}
                  type={"checkbox"}
                  onChange={(e) => setPos(e)}
                />
                <Form.Check.Label>{"non-deponent"}</Form.Check.Label>
              </Form.Check>
            </div>
          ) : (
            ""
          )}
          {sizeShows == "sex" ? (
            <div className="mb-3">
              <Form.Check inline id={"male"}>
                <Form.Check.Input
                  checked={sex.male as any}
                  className={"check-secondary"}
                  type={"checkbox"}
                  onChange={(e) => setSex(e)}
                />
                <Form.Check.Label>{"male"}</Form.Check.Label>
              </Form.Check>
              <Form.Check inline id={"female"}>
                <Form.Check.Input
                  checked={sex.female as any}
                  className={"check-secondary"}
                  type={"checkbox"}
                  onChange={(e) => setSex(e)}
                />
                <Form.Check.Label>{"female"}</Form.Check.Label>
              </Form.Check>
            </div>
          ) : (
            ""
          )}

          <div id="legend" className="mb-3 mt-1">
            <svg height={82}>
              <text x={10} y={15} className="legend">
                number of people
              </text>
              <circle
                cx={45}
                cy={60}
                r={4}
                fill={"white"}
                stroke={"sienna"}
                strokeWidth={1.2}
              />
              <text fill={"sienna"} x={40} y={79} className="legend">
                1
              </text>
              <circle
                cx={80}
                cy={52}
                r={12}
                fill={"white"}
                stroke={"sienna"}
                strokeWidth={1.2}
              />
              <text fill={"sienna"} x={77} y={78} className="legend">
                5
              </text>
              <circle
                cx={130}
                cy={42}
                r={22}
                stroke={"sienna"}
                strokeWidth={1.2}
                fill={"white"}
              />
              <text fill={"sienna"} x={123} y={78} className="legend">
                20
              </text>
              <circle
                cx={200}
                cy={33}
                r={32}
                stroke={"sienna"}
                strokeWidth={1.2}
                fill={"white"}
              />

              <text fill={"sienna"} x={192} y={78} className="legend">
                60
              </text>
            </svg>
          </div>
          <InputGroup className="mb-2 mt-1" size="sm">
            <InputGroup.Text id="symbol-structure">
              Symbol structure shows
            </InputGroup.Text>
            <Form.Select
              title="select symbol structure value"
              value={structureShows}
              onChange={(e) => changeStructureShows(e)}
            >
              <option value="occ">occupation</option>
              <option value="rel">religious affiliation</option>
            </Form.Select>
          </InputGroup>
        </div>
        <div className="mb-3">
          {structureShows == "occ"
            ? Occupations.map((o: any, i: number) => {
                return (
                  <Form.Check inline type={"checkbox"} id={o.id}>
                    <Form.Check.Input
                      checked={occ[o.id] as any}
                      className={`check-${o.id}`}
                      type={"checkbox"}
                      onChange={(e) => setOcc(e)}
                    />
                    <Form.Check.Label>{o.name}</Form.Check.Label>
                  </Form.Check>
                );
              })
            : ""}
          {structureShows == "occ" ? (
            <Form.Check
              inline
              type={"checkbox"}
              id={"all-occ"}
              style={{ float: "right" }}
            >
              <Form.Check.Input
                checked={allOccChecked}
                type={"checkbox"}
                className={"check-secondary"}
                onChange={() => setAllOccChecked()}
              />
              <Form.Check.Label>
                <i>{allOccChecked ? "deselect all" : "select all"}</i>
              </Form.Check.Label>
            </Form.Check>
          ) : (
            ""
          )}

          {structureShows == "rel"
            ? Religions.map((r: any, i: number) => {
                return (
                  <Form.Check inline type={"checkbox"} id={r.id}>
                    <Form.Check.Input
                      checked={rel[r.id] as any}
                      className={`check-${r.id}`}
                      type={"checkbox"}
                      onChange={(e) => setRel(e)}
                    />
                    <Form.Check.Label>{r.name}</Form.Check.Label>
                  </Form.Check>
                );
              })
            : ""}
        </div>

        <div id="locations" style={{ marginBottom: "80px" }}>
          <span>
            <b>Location details</b>
          </span>
          {Object.keys(selectedLocation).length !== 0 ? (
            <Card style={{ marginTop: "8px" }}>
              <Card.Header className="text-muted">
                <span
                  style={{ cursor: "pointer" }}
                  title="Copy coordinates"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${selectedLocation["residence_y_coordinates"]}, ${selectedLocation["residence_x_coordinates"]}`
                    );
                  }}
                >
                  <GoLocation />{" "}
                  <small>
                    <small>
                      <>
                        {selectedLocation["residence_y_coordinates"]},
                        {selectedLocation["residence_x_coordinates"]}
                      </>
                    </small>
                    <CloseButton
                      aria-label="Hide"
                      onClick={deselectLocation}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                      }}
                    />{" "}
                  </small>
                </span>
              </Card.Header>
              <Card.Body>
                {getResidenceNames(selectedLocation["residence_id"] as string)
                  .length > 2 ? (
                  <Card.Subtitle className="mb-1 text-muted">
                    <small>residences in location</small>
                  </Card.Subtitle>
                ) : (
                  <Card.Subtitle className="mb-1 text-muted">
                    <small>residence</small>
                  </Card.Subtitle>
                )}
                <Card.Title className="mb-4">
                  {getResidenceNames(selectedLocation["residence_id"] as string)
                    .join(" • ")
                    .slice(0, -3)}
                </Card.Title>
                <Card.Subtitle className="mb-1 text-muted">
                  <small>
                    people (
                    {selectedLocation["name"] &&
                      selectedLocation["name"].split(",").length - 1}
                    )
                  </small>
                </Card.Subtitle>
                <Card.Text>
                  {buildPeopleList(selectedLocation["name"] as string)}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <>
              <br />
              <span style={{ marginTop: "8px" }} className="text-muted">
                <small>
                  <i>Select location from the map</i>
                </small>
              </span>
            </>
          )}
        </div>

        <div
          className="pt-12"
          style={{
            position: "absolute",
            background: "#b8c2cc",
            bottom: "0",
            right: "0",
            left: "0",
            height: "60px",
          }}
        >
          <Button
            size="sm"
            variant="outline-dark"
            style={{ position: "absolute", right: "1rem", bottom: "1rem" }}
            onClick={handleInfoModalShow}
          >
            info
          </Button>
          <Modal
            show={infoModal}
            onHide={handleInfoModalClose}
            size="xl"
            centered
          >
            <Hero />
            <CloseButton
              aria-label="Hide"
              onClick={handleInfoModalClose}
              style={{
                position: "absolute",
                right: "1rem",
                top: "1rem",
                backgroundColor: "white",
              }}
            />{" "}
            <Modal.Body>
              <p>
                This map shows the locations of residence of people suspected of
                heresy in the inquisition register of Bologna, 1291–1310. It
                looks at the distribution of suspects in space and at their
                sociodemographic characteristics (sex, type of occupation),
                religious affiliation (Cathar milieu, Apostolic milieu, and
                other heterodoxy), as well as their role in the trial (deponent
                or non-deponent). Any of these characteristics can be used to
                filter the set of persons shown.
              </p>
              <p>
                The map is divided into two main parts, one showing locations
                outside Bologna, the other focusing on Bologna. A switch in the
                right panel sets whether the map symbol should show occupation,
                or religious affiliation. Then, for each location, a pie
                mini-chart shows the occupational, or religious profile of
                suspects in the given location, and also displays the proportion
                of persons from that location for whom the attribute is unknown.
                The display can be filtered, e.g. to show only craftsmen, or
                only those affiliated to the Apostolic movement. After clicking
                on a location, the right panel shows the list of persons from
                that location alongside their characteristics. The coordinates
                of that location can be copied by clicking on them in the right
                panel.
              </p>
              <p>
                We included all individuals incriminated in the register, either
                by another person or by themselves. We did not include persons
                who were mentioned but not incriminated (e.g., father as part of
                the identification of a suspect, people mentioned but not
                involved in dissidence).
              </p>
              <p>
                We do not know specific locations of persons’ houses; the level
                of precision stops at the settlement level (for locations
                outside of Bologna) or parish level (for Bologna). On the
                Bologna map, we also included residents of Bologna for whom the
                parish is not known.
              </p>

              <ul style={{ listStyle: "none" }}>
                <li>
                  <span>
                    <i className="mx-2 icon icon-book" />
                  </span>
                  <span>
                    Data source: Paolini, Lorenzo, Orioli, Raniero (Eds.)
                    (1982). Acta S. Officii Bononie ab anno 1291 usque ad annum
                    1310. Roma: Istituto storico italiano per il Medio Evo.
                  </span>
                </li>
                <li>
                  <span>
                    <i className="mx-2 icon icon-layer-group" />
                  </span>
                  <span>Data: Katia Riccardo</span>
                </li>
                <li>
                  <span>
                    <i className="mx-2 icon icon-drafting-compass" />
                  </span>
                  <span>
                    Map:{" "}
                    <a
                      href="https://pondrejk.eu/"
                      title="personal portfolio page"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Peter Ondrejka
                    </a>
                  </span>
                </li>
                <li>
                  <span>
                    <i className="mx-2 icon icon-binoculars" />
                  </span>
                  <span>Dataset design and supervision: David Zbíral</span>
                </li>
              </ul>
              <p>
                Recommended citation: Riccardo, Katia; Ondrejka, Peter; Zbíral,
                David (2023). Heresy and occupation in Bologna around 1300 ( v.{" "}
                {packageJson.version}){" "}
                <i>Dissident Networks Project (DISSINET)</i>. Retrieved{" "}
                {now.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                from{" "}
                <a href="https://dissinet.cz/maps/bologna-heresy-occupation/">
                  https://dissinet.cz/maps/bologna-heresy-occupation/
                </a>
                .
              </p>
            </Modal.Body>
            <Modal.Footer style={{ background: "#b8c2cc" }}></Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PanelComponent;
