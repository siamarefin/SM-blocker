(async () => {
  const data = await chrome.storage.local.get([
    "enabled",
    "state",
    "blockedUntil"
  ]);

  if (!data.enabled || data.state !== "BLOCKED") {
    return;
  }

  const overlay = document.createElement("div");

  overlay.id = "sm-blocker-overlay";

  overlay.innerHTML = `
    <div class="sm-blocker-box">
      <h1>Facebook Blocked</h1>
      <p>You've used your 5 minutes.</p>
      <p>Facebook will be available again in:</p>
      <div id="sm-countdown">Loading...</div>
    </div>
  `;

  const style = document.createElement("style");

  style.textContent = `
    #sm-blocker-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: #111;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }

    .sm-blocker-box {
      text-align: center;
    }

    .sm-blocker-box h1 {
      font-size: 42px;
      margin-bottom: 20px;
    }

    .sm-blocker-box p {
      font-size: 20px;
      color: #ccc;
    }

    #sm-countdown {
      font-size: 48px;
      font-weight: bold;
      margin-top: 25px;
    }
  `;

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(overlay);

  const countdown = document.getElementById("sm-countdown");

  function updateCountdown() {
    const remaining = data.blockedUntil - Date.now();

    if (remaining <= 0) {
      location.reload();
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdown.textContent =
      `${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
})();