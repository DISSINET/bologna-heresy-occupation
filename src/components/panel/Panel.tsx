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
  function dissinetLogo() {
    return (
      <svg
        className="pin-r"
        width="178"
        height="68"
        viewBox="0 0 178 68"
        fill="black"
        transform="scale(0.6 0.6)"
      >
        <path d="M-0.06,3l0,26.6l4.14,0l0,-26.6zm4.29,0l2.59,26.6l1.4,0l-2.58,-26.6zm6.73,0l-2.58,26.6l1.4,0l2.59,-26.6zm1.56,0l0,26.6l4.18,0l0,-26.6zm15.69,0l0,20.48c0,3.57,3.23,6.35,6.69,6.35c3.46,0,6.69,-2.78,6.69,-6.35l0,-20.48l-4.18,0l0,20.33c0,1.44,-1.29,2.47,-2.51,2.47c-1.22,0,-2.51,-1.03,-2.51,-2.47l0,-20.33zm26.26,0l0,26.6l4.18,0l0,-26.6zm4.33,0l3.95,26.6l1.45,0l-3.95,-26.6zm5.55,0l0,26.6l4.18,0l0,-26.6zm18.05,25.12l0,1.48l11.36,0l0,-1.48l-3.61,0l0,-23.64l3.61,0l0,-1.48l-11.36,0l0,1.48l3.57,0l0,23.64z" />
        <path d="M6.21,41.5l-5.74,26.6l2.13,0l1.79,-8.4l7.75,0l1.82,8.4l2.13,0l-5.66,-26.6l-2.05,0l3.42,16.3l-7.07,0l3.49,-16.3zm22.72,0l0,26.6l2.06,0l0,-11.25l3.45,0l6.31,11.25l2.36,0l-6.5,-11.48c3.12,-0.26,5.59,-2.88,5.59,-6.11l0,-2.66c0,-3.46,-2.89,-6.35,-6.35,-6.35zm6.73,13.41l-4.67,0l0,-11.51l4.67,0c2.43,0,4.52,1.98,4.52,4.48l0,2.4c0,2.73,-1.97,4.63,-4.52,4.63zm24.81,-11.51l0,24.7l2.06,0l0,-24.7l7.1,0l0,-1.9l-16.26,0l0,1.9zm27.63,24.93c3.65,0,6.57,-2.59,6.57,-6.35l0,-1.63c0,-4.33,-3.64,-5.82,-6.15,-6.39c-2.32,-0.53,-4.94,-1.4,-4.94,-4.52l0,-1.78c0,-2.47,2.13,-4.41,4.52,-4.41c2.36,0,4.52,1.94,4.52,4.41l0,0.95l2.05,0l0,-0.99c0,-3.65,-2.92,-6.35,-6.57,-6.35c-3.65,0,-6.57,2.7,-6.57,6.35l0,1.82c0,4.45,3.76,5.85,6.08,6.39c2.43,0.53,5.01,1.4,5.01,4.56l0,1.55c0,2.47,-2.13,4.41,-4.48,4.41c-2.4,0,-4.56,-1.94,-4.56,-4.41l0,-0.87l-2.05,0l0,0.91c0,3.76,2.92,6.35,6.57,6.35z" />
        <path d="M111.23,3.01l0,10.68l3.55,0c3.63,0,5.67,-1.92,5.67,-5.34c0,-3.42,-2.04,-5.34,-5.67,-5.34zm2.19,1.89l1.33,0c2.3,0,3.42,1.14,3.42,3.45c0,2.31,-1.12,3.45,-3.42,3.45l-1.33,0zm10.71,-0.09l0,-1.8l-2.1,0l0,1.8zm0,8.88l0,-7.62l-2.1,0l0,7.62zm4.87,-7.86c-1.88,0,-3.14,0.97,-3.14,2.34c0,1.77,1.36,2.07,2.64,2.4c1.18,0.31,1.75,0.45,1.75,1.11c0,0.45,-0.37,0.73,-1.11,0.73c-0.87,0,-1.33,-0.43,-1.33,-1.2l-2.13,0c0,1.85,1.3,2.72,3.41,2.72c2.07,0,3.37,-0.96,3.37,-2.39c0,-1.86,-1.5,-2.2,-2.87,-2.56c-1.15,-0.3,-1.63,-0.44,-1.63,-0.98c0,-0.43,0.35,-0.7,1.03,-0.7c0.75,0,1.2,0.33,1.2,1.11l2.01,0c0,-1.7,-1.2,-2.58,-3.2,-2.58zm7.86,0c-1.89,0,-3.14,0.97,-3.14,2.34c0,1.77,1.36,2.07,2.63,2.4c1.19,0.31,1.76,0.45,1.76,1.11c0,0.45,-0.38,0.73,-1.11,0.73c-0.87,0,-1.34,-0.43,-1.34,-1.2l-2.13,0c0,1.85,1.31,2.72,3.42,2.72c2.07,0,3.36,-0.96,3.36,-2.39c0,-1.86,-1.5,-2.2,-2.86,-2.56c-1.16,-0.3,-1.64,-0.44,-1.64,-0.98c0,-0.43,0.36,-0.7,1.04,-0.7c0.75,0,1.2,0.33,1.2,1.11l2.01,0c0,-1.7,-1.2,-2.58,-3.2,-2.58zm7.13,-1.02l0,-1.8l-2.1,0l0,1.8zm0,8.88l0,-7.62l-2.1,0l0,7.62zm8.97,0l0,-10.68l-2.1,0l0,3.97l-0.03,0c-0.47,-0.72,-1.29,-1.11,-2.16,-1.11c-1.91,0,-3.14,1.58,-3.14,4.01c0,2.43,1.25,4,3.17,4c0.88,0,1.72,-0.42,2.19,-1.2l0.03,0l0,1.01zm-3.58,-6.21c0.94,0,1.59,0.88,1.59,2.4c0,1.51,-0.65,2.4,-1.59,2.4c-1.01,0,-1.66,-0.95,-1.66,-2.4c0,-1.46,0.65,-2.4,1.66,-2.4zm8.92,4.96c-0.9,0,-1.67,-0.55,-1.73,-2.13l5.48,0c0,-0.84,-0.08,-1.42,-0.24,-1.95c-0.48,-1.54,-1.77,-2.53,-3.53,-2.53c-2.38,0,-3.78,1.74,-3.78,3.99c0,2.43,1.4,4.11,3.8,4.11c2.02,0,3.34,-1.16,3.64,-2.55l-2.14,0c-0.11,0.61,-0.66,1.06,-1.5,1.06zm-0.02,-5.13c0.85,0,1.53,0.53,1.67,1.68l-3.33,0c0.16,-1.15,0.81,-1.68,1.66,-1.68zm9.54,-1.42c-0.97,0,-1.74,0.46,-2.23,1.14l-0.03,0l0,-0.96l-1.97,0l0,7.62l2.1,0l0,-4.08c0,-1.38,0.63,-2.07,1.5,-2.07c0.83,0,1.34,0.52,1.34,1.68l0,4.47l2.1,0l0,-4.68c0,-2.07,-1.1,-3.12,-2.81,-3.12zm8.1,6.22c-0.72,0,-0.99,-0.33,-0.99,-1.17l0,-3.31l1.46,0l0,-1.56l-1.46,0l0,-1.98l-2.1,0l0,1.98l-1.23,0l0,1.56l1.23,0l0,3.69c0,1.77,0.77,2.47,2.52,2.47c0.36,0,0.83,-0.06,1.11,-0.15l0,-1.6c-0.13,0.04,-0.34,0.07,-0.54,0.07z" />
        <path d="M120.41,31.69l0,-10.68l-2.11,0l0,4.11c0,1.54,0.04,3.09,0.11,4.63l-0.02,0c-0.61,-1.48,-1.28,-2.98,-1.95,-4.41l-2.08,-4.33l-3.13,0l0,10.68l2.11,0l0,-4.11c0,-1.55,-0.04,-3.09,-0.12,-4.63l0.03,0c0.61,1.48,1.28,2.98,1.95,4.4l2.08,4.34zm5.55,-1.25c-0.9,0,-1.66,-0.55,-1.73,-2.13l5.48,0c0,-0.84,-0.08,-1.42,-0.24,-1.95c-0.48,-1.54,-1.77,-2.53,-3.53,-2.53c-2.38,0,-3.77,1.74,-3.77,3.99c0,2.43,1.39,4.11,3.79,4.11c2.02,0,3.35,-1.16,3.64,-2.55l-2.14,0c-0.1,0.61,-0.66,1.06,-1.5,1.06zm-0.02,-5.13c0.84,0,1.53,0.53,1.67,1.68l-3.33,0c0.16,-1.15,0.81,-1.68,1.66,-1.68zm8.68,4.8c-0.72,0,-0.99,-0.33,-0.99,-1.17l0,-3.31l1.45,0l0,-1.56l-1.45,0l0,-1.98l-2.1,0l0,1.98l-1.23,0l0,1.56l1.23,0l0,3.69c0,1.77,0.76,2.47,2.52,2.47c0.36,0,0.82,-0.06,1.11,-0.15l0,-1.6c-0.14,0.04,-0.35,0.07,-0.54,0.07zm11.46,1.58l1.67,-7.62l-2.08,0l-0.57,2.94c-0.21,1.09,-0.41,2.22,-0.55,3.31l-0.03,0c-0.18,-1.09,-0.39,-2.17,-0.65,-3.28l-0.68,-2.97l-2.88,0l-0.67,2.97c-0.25,1.11,-0.46,2.19,-0.64,3.28l-0.03,0c-0.16,-1.09,-0.35,-2.22,-0.56,-3.31l-0.57,-2.94l-2.09,0l1.69,7.62l3,0l0.67,-3c0.24,-1.06,0.45,-2.16,0.63,-3.26l0.03,0c0.18,1.1,0.39,2.2,0.63,3.26l0.68,3zm6.09,-7.86c-2.39,0,-3.9,1.57,-3.9,4.05c0,2.47,1.51,4.05,3.9,4.05c2.38,0,3.89,-1.58,3.89,-4.05c0,-2.48,-1.51,-4.05,-3.89,-4.05zm0,1.62c1.03,0,1.69,0.94,1.69,2.43c0,1.48,-0.66,2.43,-1.69,2.43c-1.04,0,-1.7,-0.95,-1.7,-2.43c0,-1.49,0.66,-2.43,1.7,-2.43zm9.49,-1.5c-0.9,0,-1.57,0.37,-2.08,1.2l-0.03,0l0,-1.08l-1.94,0l0,7.62l2.1,0l0,-3.6c0,-1.5,0.69,-2.31,1.98,-2.31c0.21,0,0.42,0.03,0.66,0.07l0,-1.81c-0.21,-0.06,-0.48,-0.09,-0.69,-0.09zm9.1,7.74l-3.2,-4.11l2.89,-3.51l-2.37,0l-2.46,3.07l-0.03,0l0,-6.13l-2.1,0l0,10.68l2.1,0l0,-3.57l0.03,0l2.55,3.57zm3.33,-7.86c-1.88,0,-3.14,0.97,-3.14,2.34c0,1.77,1.36,2.07,2.64,2.4c1.18,0.31,1.75,0.45,1.75,1.11c0,0.45,-0.37,0.73,-1.11,0.73c-0.87,0,-1.33,-0.43,-1.33,-1.2l-2.13,0c0,1.85,1.3,2.72,3.42,2.72c2.06,0,3.36,-0.96,3.36,-2.39c0,-1.86,-1.5,-2.2,-2.87,-2.56c-1.15,-0.3,-1.63,-0.44,-1.63,-0.98c0,-0.43,0.36,-0.7,1.03,-0.7c0.75,0,1.2,0.33,1.2,1.11l2.01,0c0,-1.7,-1.2,-2.58,-3.2,-2.58z" />
        <path d="M111.23,39.01l0,10.68l2.21,0l0,-3.78l1.83,0c2.59,0,3.91,-1.38,3.91,-3.45c0,-2.07,-1.32,-3.45,-3.91,-3.45zm2.21,1.83l1.53,0c1.39,0,1.96,0.61,1.96,1.62c0,1,-0.57,1.62,-1.96,1.62l-1.53,0zm11.17,1.11c-0.9,0,-1.58,0.37,-2.09,1.2l-0.03,0l0,-1.08l-1.93,0l0,7.62l2.1,0l0,-3.6c0,-1.5,0.69,-2.31,1.98,-2.31c0.21,0,0.42,0.03,0.66,0.07l0,-1.81c-0.21,-0.06,-0.48,-0.09,-0.69,-0.09zm5.05,-0.12c-2.38,0,-3.9,1.58,-3.9,4.05c0,2.47,1.52,4.05,3.9,4.05c2.39,0,3.9,-1.58,3.9,-4.05c0,-2.47,-1.51,-4.05,-3.9,-4.05zm0,1.62c1.04,0,1.7,0.94,1.7,2.43c0,1.48,-0.66,2.43,-1.7,2.43c-1.03,0,-1.69,-0.95,-1.69,-2.43c0,-1.49,0.66,-2.43,1.69,-2.43zm7.58,-2.64l0,-1.8l-2.1,0l0,1.8zm0,1.26l-2.1,0l0,7.47c0,1.09,-0.39,1.41,-1.13,1.41c-0.15,0,-0.28,-0.02,-0.4,-0.04l0,1.51c0.3,0.07,0.64,0.12,1.03,0.12c1.52,0,2.6,-0.77,2.6,-2.69zm5.34,6.38c-0.9,0,-1.67,-0.56,-1.73,-2.14l5.48,0c0,-0.84,-0.08,-1.42,-0.24,-1.95c-0.48,-1.54,-1.77,-2.53,-3.53,-2.53c-2.38,0,-3.78,1.74,-3.78,3.99c0,2.43,1.4,4.11,3.8,4.11c2.02,0,3.34,-1.16,3.64,-2.55l-2.14,0c-0.11,0.61,-0.66,1.07,-1.5,1.07zm-0.02,-5.14c0.84,0,1.53,0.53,1.67,1.68l-3.33,0c0.16,-1.15,0.81,-1.68,1.66,-1.68zm8.81,-1.48c-2.33,0,-3.84,1.59,-3.84,4.05c0,2.46,1.51,4.05,3.84,4.05c2.05,0,3.43,-1.29,3.6,-3.23l-2.21,0c-0.06,1,-0.6,1.61,-1.41,1.61c-1.02,0,-1.63,-0.93,-1.63,-2.43c0,-1.5,0.61,-2.43,1.63,-2.43c0.81,0,1.35,0.55,1.43,1.46l2.19,0c-0.17,-1.79,-1.55,-3.08,-3.6,-3.08zm8.5,6.28c-0.72,0,-0.99,-0.33,-0.99,-1.16l0,-3.32l1.46,0l0,-1.56l-1.46,0l0,-1.98l-2.1,0l0,1.98l-1.23,0l0,1.56l1.23,0l0,3.69c0,1.77,0.77,2.47,2.52,2.47c0.36,0,0.83,-0.06,1.11,-0.15l0,-1.6c-0.13,0.05,-0.34,0.07,-0.54,0.07z" />
        <desc>Dissident Networks Project</desc>
      </svg>
    );
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
          marginBottom: "68px",
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
                  {selectedLocation["residence_x_coordinates"] === null ? (
                    <small>{"unknown/non-geocoded location "}</small>
                  ) : (
                    <>
                      <GoLocation />{" "}
                      <small>
                        <small>
                          {selectedLocation["residence_y_coordinates"]},
                          {selectedLocation["residence_x_coordinates"]}
                        </small>
                      </small>
                    </>
                  )}
                  <small>
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
                ) : selectedLocation["residence_x_coordinates"] === null ? (
                  ""
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
            height: "68px",
          }}
        >
          <a target="_blank" rel="noreferrer" href="https://dissinet.cz">
            {dissinetLogo()}
          </a>
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
            <Modal.Footer style={{ background: "#b8c2cc" }}>
              <Row>
                <Col sm="8">
                  <small>
                    The research presented in this map application is a part of
                    the “Dissident Networks Project” (DISSINET,
                    https://dissinet.cz) and has received funding from the
                    European Research Council (ERC) under the European Union’s
                    Horizon 2020 research and innovation programme (grant
                    agreement No. 101000442). The main part of the dataset was
                    compiled during the research stay of Lidia Hinz-Wieczorek
                    with DISSINET in autumn 2021, which was funded by the Polish
                    National Agency for Academic Exchange (NAWA) under the
                    program of the personal exchange of students and scientists
                    as part of bilateral cooperation (grant agreement No.
                    PPN/BIL/2020/1/00178/U/01).
                  </small>
                </Col>
                <Col>
                  <Row>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://dissinet.cz"
                      style={{ paddingLeft: "60px" }}
                    >
                      {dissinetLogo()}
                    </a>
                    <a
                      href="https://erc.europa.eu/"
                      title="European Research Council"
                      target="_blank"
                      rel="noreferrer"
                      style={{ paddingLeft: "60px" }}
                    >
                      <img
                        src="https://cdn.muni.cz/media/3299268/logo_erc-flag_eum.png?mode=crop&amp;center=0.5,0.5&amp;rnd=132594368580000000&amp;width=278"
                        srcSet="https://cdn.muni.cz/media/3299268/logo_erc-flag_eum.png?mode=crop&amp;center=0.5,0.5&amp;rnd=132594368580000000&amp;width=278 278w,https://cdn.muni.cz/media/3299268/logo_erc-flag_eum.png?mode=crop&amp;center=0.5,0.5&amp;rnd=132594368580000000&amp;width=477 477w"
                        sizes="(min-width:1240px) 278px,(min-width:1024px) calc((100vw - 30px) * 0.5 - 20px),(min-width:768px) calc((100vw - 10px) * 0.5 - 20px),calc((100vw - 10px) * 1 - 20px)"
                        alt="European Research Council"
                        title="European Research Council"
                      />
                    </a>
                  </Row>
                </Col>
              </Row>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PanelComponent;
