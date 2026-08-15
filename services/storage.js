export async function getData(keys) {
  return await chrome.storage.local.get(keys);
}

export async function setData(data) {
  return await chrome.storage.local.set(data);
}

export async function removeData(keys) {
  return await chrome.storage.local.remove(keys);
}