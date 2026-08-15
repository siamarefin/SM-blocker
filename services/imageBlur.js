const BLUR_CLASS = "sm-media-blur";

let observer = null;


// =========================
// STYLE
// =========================

function addBlurStyle() {

  if (document.getElementById("sm-media-blur-style")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "sm-media-blur-style";

  style.textContent = `
    img.${BLUR_CLASS},
    video.${BLUR_CLASS},
    canvas.${BLUR_CLASS},
    [style*="background-image"].${BLUR_CLASS} {
      filter: blur(20px) !important;
    }
  `;

  document.head.appendChild(style);
}


// =========================
// BLUR
// =========================

function blurMedia() {

  document.querySelectorAll(
    "img, video, canvas, [style*='background-image']"
  ).forEach((element) => {

    element.classList.add(BLUR_CLASS);

  });

}


// =========================
// REMOVE BLUR
// =========================

function removeBlur() {

  document
    .querySelectorAll(`.${BLUR_CLASS}`)
    .forEach((element) => {

      element.classList.remove(BLUR_CLASS);

    });

}


// =========================
// OBSERVER
// =========================

function startObserver() {

  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    blurMedia();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      "src",
      "poster",
      "style"
    ]
  });

}


// =========================
// STOP OBSERVER
// =========================

function stopObserver() {

  if (!observer) {
    return;
  }

  observer.disconnect();

  observer = null;

}


// =========================
// PUBLIC API
// =========================

window.imageBlur = {

  enable() {

    addBlurStyle();

    blurMedia();

    startObserver();

  },

  disable() {

    stopObserver();

    removeBlur();

  }

};


// =========================
// READ SETTING
// =========================

chrome.storage.local.get(
  "imageBlurEnabled",
  (data) => {

    if (data.imageBlurEnabled === true) {

      window.imageBlur.enable();

    }

  }
);


// =========================
// WATCH SETTING
// =========================

chrome.storage.onChanged.addListener(
  (changes, areaName) => {

    if (
      areaName !== "local" ||
      !changes.imageBlurEnabled
    ) {
      return;
    }

    if (changes.imageBlurEnabled.newValue === true) {

      window.imageBlur.enable();

    } else {

      window.imageBlur.disable();

    }

  }
);