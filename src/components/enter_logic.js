document.addEventListener("DOMContentLoaded", () => {
  const sendMessageButton = document.getElementById("send_message");

  if (sendMessageButton) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessageButton.click();
      }
    });
  }
});
