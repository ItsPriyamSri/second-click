import type { Clickable, RoomId } from "./state";

export const REAL_FIELD_ID = "dl-real";
export const SWAP_ID = "dl-swap";

const field: Clickable[] = [
  {
    id: "dl-decoy-1",
    label: "DOWNLOAD NOW",
    shownUrl: "/ads/offer-1",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-2",
    label: "GET THE APP",
    shownUrl: "/ads/offer-2",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: REAL_FIELD_ID,
    label: "Download DemoApp",
    shownUrl: "/continue/real",
    secondUrl: null,
    hops: [],
    kind: "real",
    trapType: "none",
  },
  {
    id: "dl-decoy-3",
    label: "DOWNLOAD (FAST)",
    shownUrl: "/ads/offer-3",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-4",
    label: "MIRROR #1",
    shownUrl: "/ads/offer-4",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-5",
    label: "INSTALLER",
    shownUrl: "/ads/offer-5",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-6",
    label: "CLICK HERE",
    shownUrl: "/ads/offer-6",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-7",
    label: "FREE APK",
    shownUrl: "/ads/offer-7",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
];

const hops: Clickable[] = [
  {
    id: SWAP_ID,
    label: "DemoApp.apk",
    shownUrl: "/ads/click-here",
    secondUrl: "/you-clicked-once.html",
    hops: ["/ads/click-here", "/you-clicked-once.html"],
    kind: "two_url",
    trapType: "second_click",
  },
];

export function getClickables(room: RoomId): Clickable[] {
  if (room === "field") return field;
  if (room === "hops") return hops;
  return [];
}