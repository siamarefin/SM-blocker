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
  resetSession,
  finishSession
} from "./services/usageTracker.js";


const USAGE_TIME = 60 * 1000;          // Testing: 5 seconds
const BLOCK_TIME = 60 * 1000;    // 1 hour


function isFacebook(url) {
  return url && url.includes("facebook.com");
}


async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return tabs[0];
}


// -------------------------
// RESET
// -------------------------

async function resetFacebookSession() {

  await clearTimer("usageTimer");

  await resetSession();

}


// -------------------------
// START
// -------------------------

async function startFacebookSession() {

  const data = await getData([
    "state",
    "usageStartedAt"
  ]);

  if (data.state === "BLOCKED") {
    return;
  }

  if (data.usageStartedAt) {
    return;
  }

  const tab = await getActiveTab();

  if (!tab || !isFacebook(tab.url)) {
    return;
  }

  await startSession();

  await setData({
    state: "ACTIVE"
  });

  await createTimer(
    "usageTimer",
    USAGE_TIME
  );
}


// -------------------------
// ACTIVE TAB CHANGED
// -------------------------

chrome.tabs.onActivated.addListener(async () => {

  const tab = await getActiveTab();

  if (!tab || !isFacebook(tab.url)) {

    await resetFacebookSession();

    return;
  }

  await startFacebookSession();

});


// -------------------------
// WINDOW FOCUS CHANGED
// -------------------------

chrome.windows.onFocusChanged.addListener(async () => {

  const tab = await getActiveTab();

  if (!tab || !isFacebook(tab.url)) {

    await resetFacebookSession();

    return;
  }

  await startFacebookSession();

});


// -------------------------
// TAB URL CHANGED
// -------------------------

chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {

    if (!changeInfo.url && changeInfo.status !== "complete") {
      return;
    }

    const activeTab = await getActiveTab();

    if (!activeTab || activeTab.id !== tabId) {
      return;
    }


    if (isFacebook(tab.url)) {

      await startFacebookSession();

    } else {

      await resetFacebookSession();

    }

  }
);


// -------------------------
// ALARM
// -------------------------

chrome.alarms.onAlarm.addListener(
  async (alarm) => {

    if (alarm.name !== "usageTimer") {
      return;
    }


    // VERY IMPORTANT:
    // Check Facebook is STILL active

    const activeTab = await getActiveTab();

    if (!activeTab || !isFacebook(activeTab.url)) {

      await resetFacebookSession();

      return;
    }


    // 5 continuous minutes completed

    await finishSession();


    await setData({
      state: "BLOCKED",
      blockedUntil: Date.now() + BLOCK_TIME,
      usageStartedAt: null
    });


    await createTimer(
      "blockTimer",
      BLOCK_TIME
    );


    const facebookTabs = await chrome.tabs.query({
      url: ["https://www.facebook.com/*"]
    });


    for (const tab of facebookTabs) {
      chrome.tabs.reload(tab.id);
    }

  }
);


// -------------------------
// BLOCK FINISHED
// -------------------------

chrome.alarms.onAlarm.addListener(
  async (alarm) => {

    if (alarm.name !== "blockTimer") {
      return;
    }

    await setData({
      state: "ACTIVE",
      blockedUntil: null,
      usageStartedAt: null
    });

  }
);