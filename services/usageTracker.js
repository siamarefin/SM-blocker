import {
  getData,
  setData
} from "./storage.js";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export async function startSession() {
  const data = await getData([
    "usageStartedAt"
  ]);

  if (data.usageStartedAt) {
    return;
  }

  await setData({
    usageStartedAt: Date.now()
  });
}

export async function resetSession() {
  await setData({
    usageStartedAt: null
  });
}

export async function finishSession() {
  const data = await getData([
    "usageStartedAt",
    "today",
    "totalUsage"
  ]);

  if (!data.usageStartedAt) {
    return 0;
  }

  const usedTime = Date.now() - data.usageStartedAt;
  const today = getToday();

  if (data.today !== today) {
    await setData({
      today: today,
      totalUsage: usedTime,
      usageStartedAt: null
    });
  } else {
    await setData({
      totalUsage: (data.totalUsage || 0) + usedTime,
      usageStartedAt: null
    });
  }

  return usedTime;
}

export async function getTodayUsage() {
  const data = await getData([
    "today",
    "totalUsage"
  ]);

  const today = getToday();

  if (data.today !== today) {
    await setData({
      today: today,
      totalUsage: 0
    });

    return 0;
  }

  return data.totalUsage || 0;
}