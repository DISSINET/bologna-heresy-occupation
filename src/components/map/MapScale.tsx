// for Mercator / Km combination
import React from "react";
import { useAppSelector } from "./../../app/hooks";

// TODO parametrized positoning, max width and other values
type MapScaleProps = {
  definitionLayer: any;
};

const MapScale = ({ definitionLayer }: MapScaleProps): JSX.Element => {
  const zoom = useAppSelector((state) => state.map.zoom);
  const latitude = useAppSelector((state) => state.map.latitude);
  const minZoom = useAppSelector((state) => state.map.minZoom);
  const maxZoom = useAppSelector((state) => state.map.maxZoom);
  const maxWidth = 100; // of the scale bar
  const pitch = useAppSelector((state) => state.map.pitch);

  const DEG_TO_RAD = Math.PI / 180;
  const MAX_MERCATOR_LATITUDE = 85.051129;
  const earthRadius = 6371008.8;
  const earthCircumference = 2 * Math.PI * earthRadius;

  // constrain n to the given range via min + max
  function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
  }

  function degToRad(a: number): number {
    return a * DEG_TO_RAD;
  }

  function getLatitudeScale(lat: number): number {
    return Math.cos(
      degToRad(clamp(lat, -MAX_MERCATOR_LATITUDE, MAX_MERCATOR_LATITUDE))
    );
  }

  function getMetersPerPixelAtLatitude(lat: number, zoom: number): number {
    const constrainedZoom = clamp(zoom, minZoom, maxZoom);
    const constrainedScale = Math.pow(2.0, constrainedZoom);
    return (
      (getLatitudeScale(lat) * earthCircumference) / (constrainedScale * 512.0)
    );
  }

  function getDecimalRoundNum(d: number) {
    const multiplier = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10));
    return Math.round(d * multiplier) / multiplier;
  }

  function getRoundNum(num: number) {
    const pow10 = Math.pow(10, `${Math.floor(num)}`.length - 1);
    let d = num / pow10;

    d =
      d >= 10
        ? 10
        : d >= 5
        ? 5
        : d >= 3
        ? 3
        : d >= 2
        ? 2
        : d >= 1
        ? 1
        : getDecimalRoundNum(d);

    return pow10 * d;
  }

  function getScale() {
    // The real distance corresponding to 100px scale length is rounded off to
    // near pretty number and the scale length for the same is found out.
    //
    // get scale number
    const maxDistance = getMetersPerPixelAtLatitude(latitude, zoom) * maxWidth;
    const distance = getRoundNum(maxDistance);
    const distLabel =
      maxDistance >= 1000 ? `${distance / 1000} km` : `${distance} m`;
    // get scale bar length
    const ratio = distance / maxDistance;
    const newWidth = maxWidth * ratio;
    return [distLabel, newWidth];
  }

  function getScaleLength() {
    return `${getScale()[1]}px`;
  }

  function getColor() {
    return pitch < 0.5 ? "black" : "gray";
  }

  return (
    <div
      style={{
        bottom: "11px",
        left: "11px",
        zIndex: 10000,
        position: "absolute",
        color: getColor(),
      }}
    >
      <small>
        <small>{pitch < 0.5 ? "" : "scale varies with perspective"}</small>
      </small>
      <div
        style={{
          width: getScaleLength(),
          borderBottom: `2px solid ${getColor()}`,
        }}
      >
        <small>{getScale()[0]}</small>
      </div>
    </div>
  );
};

export default MapScale;
