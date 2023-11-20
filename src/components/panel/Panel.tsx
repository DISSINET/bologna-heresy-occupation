import { useState } from "react";
import Hero from "./Hero";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import { Container, Modal, Button, CloseButton } from "react-bootstrap";
import { GoLocation } from "react-icons/go";
import { BsCheckLg, BsListUl } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";
import packageJson from "../../../package.json";

type PanelComponentProps = {};

const PanelComponent = ({}: PanelComponentProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [infoModal, toggleInfoModal] = useState(false);
  const handleInfoModalClose = () => toggleInfoModal(false);
  const handleInfoModalShow = () => toggleInfoModal(true);

  const now = new Date();

  return (
    <div
      className="panel"
      data-testid="panel-wrapper"
      style={{
        maxHeight: "100%",
        display: "flex",
        flexFlow: "column nowrap",
      }}
    >
      <Hero />
      <div
        style={{
          padding: "1em",
          overflow: "scroll",
          display: "flex",
          flexFlow: "column nowrap",
          gap: "20px",
        }}
      >
        <div
          id="legend"
          style={{
            marginBottom: "60px",
          }}
        >
          <span></span>
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
                This interactive map shows the locations of residence of people
                suspected of heresy in the register of Bologna, 1291–1310. It
                shows the distribution of suspects in space, including their
                sociodemographic characteristics (sex, type of occupation),
                religious affiliation (Cathar milieu, Apostolic milieu, and
                other heterodoxy), as well as position in the trial (deponents
                vs. non-deponents). Any of these characteristics can be used to
                filter the set of persons shown.
              </p>
              <p>
                We included all individuals who were incriminated, either by
                another person or by themselves. We did not include people who
                were mentioned in depositions in a non-incriminating way (e.g.,
                parents as part of identification of suspects; people not
                involved in heresy).
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
