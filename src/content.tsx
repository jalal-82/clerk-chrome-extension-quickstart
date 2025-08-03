import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

import { DetectionIndicator } from "~features/subscription-detector/components/DetectionIndicator"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"] // Changed to work on all URLs for testing
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
      <DetectionIndicator />
    </div>
  )
}

export default PlasmoOverlay
