const status = document.getElementById("status");
const usage = document.getElementById("usage");

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

async function updateStatus() {
  const data = await chrome.storage.local.get([
    "enabled",
    "state",
    "totalUsage",
    "usageStartedAt"
  ]);

  if (data.enabled) {
    status.textContent = `Status: ${data.state}`;
  } else {
    status.textContent = "Status: OFF";
  }

  let totalUsage = data.totalUsage || 0;

  // Include current active session
  if (
    data.state === "ACTIVE" &&
    data.usageStartedAt
  ) {
    totalUsage += Date.now() - data.usageStartedAt;
  }

  usage.textContent = formatTime(totalUsage);
}


document.getElementById("start").addEventListener("click", async () => {

  await chrome.storage.local.set({
    enabled: true,
    state: "ACTIVE"
  });

  updateStatus();

});


document.getElementById("stop").addEventListener("click", async () => {

  await chrome.storage.local.set({
    enabled: false,
    state: "INACTIVE",
    usageStartedAt: null
  });

  await chrome.alarms.clear("usageTimer");
  await chrome.alarms.clear("blockTimer");

  updateStatus();

});


updateStatus();

setInterval(updateStatus, 1000);