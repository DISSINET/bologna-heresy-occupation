import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineExpand,
  AiOutlineArrowUp,
  AiOutlineDash,
} from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "./../../app/hooks";
import {
  restoreDefaultMapPosition,
  zoomIn,
  zoomOut,
  restoreDefaultPitch,
  restoreDefaultBearing,
} from "./MapSlice";

const MapControls = ({}): JSX.Element => {
  const mapState = useAppSelector((state) => state.map);
  const dispatch = useAppDispatch();

  return (
    <div
      className="mt-2"
      style={{
        position: "absolute",
        width: "30px",
        left: "11px",
        zIndex: 1000,
      }}
    >
      <ButtonGroup
        vertical
        size="sm"
        style={{
          width: "30px",
          backgroundColor: "white",
        }}
      >
        <Button
          title="Zoom in"
          disabled={mapState.zoom >= mapState.maxZoom ? true : false}
          variant="outline-dark"
          onClick={() => {
            dispatch(zoomIn());
          }}
        >
          <AiOutlinePlus />
        </Button>
        <Button
          title="Zoom out"
          disabled={mapState.zoom <= mapState.minZoom ? true : false}
          variant="outline-dark"
          onClick={() => {
            dispatch(zoomOut());
          }}
        >
          <AiOutlineMinus />
        </Button>
      </ButtonGroup>
      <ButtonGroup
        className="mt-2"
        vertical
        size="sm"
        style={{
          width: "30px",
          backgroundColor: "white",
        }}
      >
        <Button
          size="sm"
          variant="outline-dark"
          //disabled={mapState.bearing === 0 ? true : false}
          title="Reset map orientation (right-click drag in map to change orientation)"
          onClick={() => {
            dispatch(restoreDefaultBearing());
          }}
        >
          <AiOutlineArrowUp
            style={{ transform: `rotate(${mapState.bearing}deg)` }}
          />
        </Button>
        <Button
          size="sm"
          //disabled={mapState.pitch === 0 ? true : false}
          variant="outline-dark"
          title="Reset map pitch (right-click drag in map to change pitch)"
          onClick={() => {
            dispatch(restoreDefaultPitch());
          }}
        >
          <AiOutlineDash
            style={{ transform: `rotate(${mapState.pitch}deg)` }}
          />
        </Button>
        <Button
          size="sm"
          variant="outline-dark"
          title="Restore original data extent"
          onClick={() => {
            dispatch(restoreDefaultMapPosition());
          }}
        >
          <AiOutlineExpand />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default MapControls;
