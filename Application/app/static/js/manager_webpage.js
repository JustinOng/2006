function webpageInit() {
  window.onload = () => {
    mapInit();
    displayInfoModal();

    document.addEventListener("keydown", (evt) => {
      switch (evt.key) {
        case "a":
          fakeAlert();
          break;
        case "g":
          fakeGPSMovement();
          break;
        case "t":
          fakeERPTime();
          break;
      }
    });
  };
}
