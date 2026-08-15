const status = document.getElementById("status");
const usage = document.getElementById("usage");
const imageBlur = document.getElementById("imageBlur");


// =========================
// FORMAT TIME
// =========================

function formatTime(milliseconds) {

  const totalSeconds =
    Math.floor(milliseconds / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;


  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}


// =========================
// UPDATE STATUS
// =========================

async function updateStatus() {

  const data = await chrome.storage.local.get([
    "enabled",
    "state",
    "totalUsage",
    "usageStartedAt"
  ]);


  // Status

  if (data.enabled) {

    status.textContent =
      `Status: ${data.state}`;

  } else {

    status.textContent =
      "Status: OFF";

  }


  // Daily total usage

  let totalUsage =
    data.totalUsage || 0;


  // Add current Facebook session

  if (
    data.state === "ACTIVE" &&
    data.usageStartedAt
  ) {

    totalUsage +=
      Date.now() - data.usageStartedAt;

  }


  usage.textContent =
    formatTime(totalUsage);
}


// =========================
// IMAGE BLUR SETTING
// =========================

async function loadImageBlurSetting() {

  const data =
    await chrome.storage.local.get([
      "imageBlurEnabled"
    ]);


  imageBlur.checked =
    data.imageBlurEnabled === true;
}


// =========================
// IMAGE BLUR TOGGLE
// =========================

imageBlur.addEventListener(
  "change",
  async () => {

    await chrome.storage.local.set({
      imageBlurEnabled:
        imageBlur.checked
    });

  }
);


// =========================
// INITIALIZE
// =========================

updateStatus();

loadImageBlurSetting();


// =========================
// UPDATE EVERY SECOND
// =========================

setInterval(
  updateStatus,
  1000
);