import { EventItem } from "../types/event";

const PREFIX = "calendar:";

export function loadEventsForUser(userId: string): EventItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PREFIX + userId);
    if (!raw) return [];
    return JSON.parse(raw) as EventItem[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function saveEventsForUser(userId: string, events: EventItem[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PREFIX + userId, JSON.stringify(events));
  } catch (e) {
    console.error(e);
  }
}
