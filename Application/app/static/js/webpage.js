function displayInfoModal() {
  if (!localStorage.getItem("dismissedInfoModal")) {
    // display modal only if user has not hidden modal
    $("#infoModal").modal("show");
  }

  $("#infoModal button.hide").on("click", (e) => {
    localStorage.setItem("dismissedInfoModal", true);
  });
}

function displayAlertNotification(alert, onClick) {
  const first = document.querySelector("#toast-container") === null;

  $.toast({
    type: "info",
    title: alert["type"],
    subtitle:
      getRelativeTime(new Date(alert["reportedDatetime"])) +
      `<div class="alert-data" data-latitude="${alert["latitude"]}" data-longitude="${alert["longitude"]}"></div>`,
    content: alert["msg"],
    delay: 10000,
  });

  if (first) {
    document
      .querySelector("#toast-container")
      .addEventListener("click", onClick);
  }

  const audio = new Audio("audio/234524__foolboymedia__notification-up-1.wav");
  audio.play();
}
