$(document).ready(() => {
  if (!localStorage.getItem("dismissedInfoModal")) {
    // display modal only if user has not hidden modal
    $("#infoModal").modal("show");
  }

  $("#infoModal button.hide").on("click", (e) => {
    localStorage.setItem("dismissedInfoModal", true);
  });
});
