// Mock for maplibre-gl
export const Map = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  getZoom: jest.fn().mockReturnValue(12),
  zoomTo: jest.fn(),
  getBearing: jest.fn().mockReturnValue(0),
  getPitch: jest.fn().mockReturnValue(0),
  resetNorthPitch: jest.fn(),
  flyTo: jest.fn(),
  getContainer: jest.fn().mockReturnValue(document.createElement("div")),
  setProjection: jest.fn(),
  setStyle: jest.fn(),
}));

export const Marker = jest.fn().mockImplementation(() => ({
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  getElement: jest.fn().mockReturnValue(document.createElement("div")),
  getLngLat: jest.fn().mockReturnValue({ lng: 0, lat: 0 }),
  setDraggable: jest.fn(),
  isDraggable: jest.fn().mockReturnValue(false),
  setOffset: jest.fn(),
  getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
  setRotation: jest.fn(),
  getRotation: jest.fn().mockReturnValue(0),
  setRotationAlignment: jest.fn(),
  getRotationAlignment: jest.fn().mockReturnValue("auto"),
  setPitchAlignment: jest.fn(),
  getPitchAlignment: jest.fn().mockReturnValue("auto"),
  setPopup: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

export const Popup = jest.fn().mockImplementation(() => ({
  setMaxWidth: jest.fn().mockReturnThis(),
  setLngLat: jest.fn().mockReturnThis(),
  setDOMContent: jest.fn().mockReturnThis(),
  setOffset: jest.fn(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  isOpen: jest.fn().mockReturnValue(false),
  on: jest.fn(),
  off: jest.fn(),
  getLngLat: jest.fn().mockReturnValue({ lng: 0, lat: 0 }),
}));

export default {
  Map,
  Marker,
  Popup,
};
