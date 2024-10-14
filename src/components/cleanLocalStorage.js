if (
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("index.html")
) {
  console.log("Current path is the main page, clearing localStorage...");
  localStorage.clear();
} else {
  console.log("Current path is not the main page, localStorage not cleared.");
}
