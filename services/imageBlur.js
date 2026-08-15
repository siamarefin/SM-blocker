const BLUR_CLASS = "sm-media-blur";

let observer = null;

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

function blurMedia() {

  document.querySelectorAll(
    "img, video, canvas, [style*='background-image']"
  ).forEach((element) => {

    element.classList.add(BLUR_CLASS);

  });
}

function removeBlur() {

  document
    .querySelectorAll(`.${BLUR_CLASS}`)
    .forEach((element) => {

      element.classList.remove(BLUR_CLASS);

    });

}

function startObserver() {

  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    blurMedia();
  });

  observer.observe(document.body, {
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

function stopObserver() {

  if (!observer) {
    return;
  }

  observer.disconnect();
  observer = null;

}

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