import { createPathComponent } from "@react-leaflet/core"
import L from "leaflet";

export const PolyLine = createPathComponent(
  function createPolyline({ positions, ...options }, ctx) {
    const PolyLine = L.polyline

    const instance = new PolyLine(positions, options)
    return { instance, context: { ...ctx, overlayContainer: instance } }
  },
  function updatePolyline(layer, props, prevProps) {
    if (props.positions !== prevProps.positions) {
      layer.setLatLngs(props.positions)
    }
  }
)