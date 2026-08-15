import {
  getData,
  setData
} from "./services/storage.js";

import {
  createTimer,
  clearTimer
} from "./services/timer.js";

import {
  startSession,
  finishSession
} from "./services/usageTracker.js";


const USAGE_TIME = 50 * 1000;          // Testing: 5 seconds
const BLOCK_TIME = 60 * 1000;    // 1 hour


// Extension installed
chrome.runtime.onInstalled.addListener(async () => {

  await setData({
    enabled: true,
    state: "ACTIVE",
    usageStartedAt: null,
    blockedUntil: null,
    today: new Date().toISOString().split("T")[0],
    totalUsage: 0
  });

});


// Facebook opened
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  if (!tab.url || !tab.url.includes("facebook.com")) {
    return;
  }

  const data = await getData([
    "enabled",
    "state",
    "usageStartedAt"
  ]);

  if (!data.enabled) {
    return;
  }

  if (data.state === "BLOCKED") {
    return;
  }

  // Start a new Facebook session
  if (!data.usageStartedAt) {

    await startSession();

    await setData({
      state: "ACTIVE"
    });

    await createTimer(
      "usageTimer",
      USAGE_TIME
    );
  }

});


// Timer events
chrome.alarms.onAlarm.addListener(async (alarm) => {


  // =========================
  // 5 MINUTE / TEST TIMER
  // =========================

  if (alarm.name === "usageTimer") {

    // Save today's usage
    await finishSession();

    const blockedUntil =
      Date.now() + BLOCK_TIME;

    await setData({
      state: "BLOCKED",
      blockedUntil: blockedUntil
    });

    // Start 1 hour cooldown
    await createTimer(
      "blockTimer",
      BLOCK_TIME
    );

    // Reload Facebook
    const tabs = await chrome.tabs.query({
      url: ["https://www.facebook.com/*"]
    });

    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }

  }


  // =========================
  // 1 HOUR COOLDOWN
  // =========================

  if (alarm.name === "blockTimer") {

    await setData({
      state: "ACTIVE",
      blockedUntil: null,
      usageStartedAt: null
    });

    // Remove old timers if any
    await clearTimer("usageTimer");

    // Reload Facebook
    const tabs = await chrome.tabs.query({
      url: ["https://www.facebook.com/*"]
    });

    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }

  }

});