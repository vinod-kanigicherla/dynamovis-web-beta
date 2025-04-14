import { createPathComponent } from "@react-leaflet/core"
import L from "leaflet-hotline"

export const Hotline = createPathComponent(
  function createHotline({ positions, ...options }, ctx) {
    const Hotline = L.hotline

    const instance = new Hotline(positions, options)
    return { instance, context: { ...ctx, overlayContainer: instance } }
  },
  function updateHotline(layer, props, prevProps) {
    if (props.positions !== prevProps.positions) {
      layer.setLatLngs(props.positions)
    }
  }
)