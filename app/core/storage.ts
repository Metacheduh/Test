/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.warn("Unable to read localStorage", error);
    return fallback;
  }
}

export function usePersistentState<T>(
  key: string,
  fallback: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(() => readStorage(key, fallback));

  React.useEffect(() => {
    if (typeof localStorage === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Unable to persist localStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}

export function exportAdvisorData(): string {
  if (typeof localStorage === "undefined") return "{}";
  const snapshot: Record<string, unknown> = {};

  Object.keys(localStorage)
    .filter((key) => key.startsWith("advisoros_"))
    .forEach((key) => {
      try {
        snapshot[key] = JSON.parse(localStorage.getItem(key) ?? "null");
      } catch {
        snapshot[key] = localStorage.getItem(key);
      }
    });

  return JSON.stringify(snapshot, null, 2);
}

export function importAdvisorData(payload: string): number {
  if (typeof localStorage === "undefined") return 0;
  let parsed: Record<string, unknown> = {};

  try {
    parsed = JSON.parse(payload) as Record<string, unknown>;
  } catch (error) {
    throw new Error("Invalid backup JSON");
  }

  let updated = 0;
  Object.entries(parsed).forEach(([key, value]) => {
    if (!key.startsWith("advisoros_")) return;
    localStorage.setItem(key, JSON.stringify(value));
    updated += 1;
  });

  return updated;
}
