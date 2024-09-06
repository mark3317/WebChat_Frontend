export function setGlobalCursorWait() {
  spinner.style.display = "block";
  document.body.classList.add("cursor-wait");
}

export function resetGlobalCursor() {
  spinner.style.display = "none";
  document.body.classList.remove("cursor-wait");
}
