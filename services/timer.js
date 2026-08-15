export function createTimer(name, delayInMilliseconds) {
  return chrome.alarms.create(name, {
    delayInMinutes: delayInMilliseconds / 60000
  });
}

export function clearTimer(name) {
  return chrome.alarms.clear(name);
}

export async function getTimer(name) {
  return await chrome.alarms.get(name);
}