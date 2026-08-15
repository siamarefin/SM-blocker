const status = document.getElementById("status");

async function updateStatus() {
  const data = await chrome.storage.local.get([
    "enabled",
    "state"
  ]);

  if (data.enabled) {
    status.textContent = `Status: ${data.state}`;
  } else {
    status.textContent = "Status: OFF";
  }
}

document.getElementById("start").addEventListener("click", async () => {
  await chrome.storage.local.set({
    enabled: true,
    state: "ACTIVE",
    usageStartedAt: null,
    blockedUntil: null
  });

  updateStatus();
});

document.getElementById("stop").addEventListener("click", async () => {
  await chrome.storage.local.set({
    enabled: false,
    state: "INACTIVE",
    usageStartedAt: null,
    blockedUntil: null
  });

  chrome.alarms.clear("usageTimer");
  chrome.alarms.clear("blockTimer");

  updateStatus();
});

updateStatus();