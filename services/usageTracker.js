import { getData, setData } from "./storage.js";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export async function startSession() {
  await setData({
    usageStartedAt: Date.now()
  });
}

export async function finishSession() {
  const data = await getData([
    "usageStartedAt",
    "today",
    "totalUsage"
  ]);

  if (!data.usageStartedAt) {
    return;
  }

  const usedTime = Date.now() - data.usageStartedAt;
  const today = getToday();

  if (data.today !== today) {
    await setData({
      today: today,
      totalUsage: usedTime,
      usageStartedAt: null
    });

    return;
  }

  await setData({
    totalUsage: (data.totalUsage || 0) + usedTime,
    usageStartedAt: null
  });
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