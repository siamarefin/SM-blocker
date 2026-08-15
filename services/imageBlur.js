const BLUR_CLASS = "sm-image-blur";

function addBlurStyle() {
  if (document.getElementById("sm-image-blur-style")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "sm-image-blur-style";

  style.textContent = `
    .${BLUR_CLASS} {
      filter: blur(15px) !important;
    }
  `;

  document.head.appendChild(style);
}

function blurImages() {
  document.querySelectorAll("img").forEach((image) => {
    image.classList.add(BLUR_CLASS);
  });
}

function removeBlur() {
  document.querySelectorAll(`.${BLUR_CLASS}`).forEach((image) => {
    image.classList.remove(BLUR_CLASS);
  });
}

function startObserver() {
  if (!document.body) return;

  const observer = new MutationObserver(() => {
    blurImages();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

window.imageBlur = {
  enable() {
    addBlurStyle();
    blurImages();
    startObserver();
  },

  disable() {
    removeBlur();
  }
};