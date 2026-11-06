const map = document.querySelector("#concept-map");
const root = document.querySelector("#root-node");
const svg = document.querySelector(".connections");
const branchIds = ["branch-inspection", "branch-review", "branch-evidence", "branch-adaptation"];
const toggleDetailsButton = document.querySelector("#toggle-details");

function updateToggleLabel() {
  const details = [...document.querySelectorAll(".details")];
  const allExpanded = details.length > 0 && details.every((item) => !item.hidden);
  toggleDetailsButton.textContent = allExpanded ? "Ocultar todos los detalles" : "Mostrar todos los detalles";
}

function drawConnections() {
  if (!map || !root || !svg || window.matchMedia("(max-width: 700px)").matches) {
    if (svg) svg.replaceChildren();
    return;
  }

  const mapRect = map.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const startX = rootRect.left + rootRect.width / 2 - mapRect.left;
  const startY = rootRect.bottom - mapRect.top;
  const paths = [];

  for (const id of branchIds) {
    const branch = document.getElementById(id);
    if (!branch) continue;

    const rect = branch.getBoundingClientRect();
    const endX = rect.left + rect.width / 2 - mapRect.left;
    const endY = rect.top - mapRect.top;
    const curveY = startY + (endY - startY) * 0.58;
    paths.push(
      `<path d="M ${startX} ${startY} C ${startX} ${curveY}, ${endX} ${curveY}, ${endX} ${endY}"></path>`,
      `<circle cx="${endX}" cy="${endY}" r="4"></circle>`
    );
  }

  svg.setAttribute("viewBox", `0 0 ${map.clientWidth} ${map.clientHeight}`);
  svg.innerHTML = paths.join("");
}

function setDetailsExpanded(expanded) {
  document.querySelectorAll(".details-button").forEach((button) => {
    const details = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(expanded));
    button.querySelector("span").textContent = expanded ? "−" : "＋";
    details.hidden = !expanded;
  });
  updateToggleLabel();
  requestAnimationFrame(drawConnections);
}

document.querySelectorAll(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") !== "true";
    const details = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(expanded));
    button.querySelector("span").textContent = expanded ? "−" : "＋";
    details.hidden = !expanded;
    updateToggleLabel();
    requestAnimationFrame(drawConnections);
  });
});

toggleDetailsButton.addEventListener("click", () => {
  const expand = toggleDetailsButton.textContent.startsWith("Mostrar");
  setDetailsExpanded(expand);
});

document.querySelector("#print-map").addEventListener("click", () => window.print());
window.addEventListener("resize", drawConnections);
window.addEventListener("load", drawConnections);
document.fonts?.ready.then(drawConnections);
