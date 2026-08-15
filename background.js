const USAGE_TIME = 5 * 1000;      // 5 minutes
const BLOCK_TIME = 1 * 60 * 1000;     // 1 hour

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    state: "ACTIVE",
    usageStartedAt: null,
    blockedUntil: null
  });
});

// Facebook tab opened
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || !tab.url.includes("facebook.com")) return;

  const data = await chrome.storage.local.get([
    "enabled",
    "state",
    "usageStartedAt"
  ]);

  if (!data.enabled) return;

  // If currently blocked, don't start a new session
  if (data.state === "BLOCKED") return;

  // Start 5-minute session
  if (!data.usageStartedAt) {
    const startTime = Date.now();

    await chrome.storage.local.set({
      state: "ACTIVE",
      usageStartedAt: startTime
    });

    chrome.alarms.create("usageTimer", {
      delayInMinutes: 5 / 60
    });
  }
});

// 5-minute timer / 1-hour cooldown
chrome.alarms.onAlarm.addListener(async (alarm) => {

  if (alarm.name === "usageTimer") {

    const blockedUntil = Date.now() + BLOCK_TIME;

    await chrome.storage.local.set({
      state: "BLOCKED",
      usageStartedAt: null,
      blockedUntil: blockedUntil
    });

    chrome.alarms.create("blockTimer", {
      delayInMinutes: 60 /60
    });

    // Reload Facebook tabs so content.js can show blocker
    const tabs = await chrome.tabs.query({
      url: ["https://www.facebook.com/*"]
    });

    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  }

  if (alarm.name === "blockTimer") {

    await chrome.storage.local.set({
      state: "ACTIVE",
      usageStartedAt: null,
      blockedUntil: null
    });

    // Reload Facebook tabs so Facebook becomes available
    const tabs = await chrome.tabs.query({
      url: ["https://www.facebook.com/*"]
    });

    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  }
});