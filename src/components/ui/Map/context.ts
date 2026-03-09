"use client";

import { createContext } from "react";
import type { MapContextValue, MarkerContextValue } from "./types";

export const MapContext = createContext<MapContextValue | null>(null);

export const MarkerContext = createContext<MarkerContextValue | null>(null);
