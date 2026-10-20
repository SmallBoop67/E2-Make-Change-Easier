export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const Capacity = 10;

interface ShieldSnapshot {
  readonly charge: number;
  readonly capacity: number;
  readonly missing: number;
}

function createShieldSnapshot(
  rawCharge: number,
  rawCapacity: number,
): ShieldSnapshot {
  const capacity = Math.max(0, rawCapacity);
  const charge = Math.max(0, Math.min(capacity, rawCharge));
  return { charge, capacity, missing: capacity - charge };
}

function currentSnapshot(): ShieldSnapshot {
  return createShieldSnapshot(count, Capacity);
}

const shieldEvents = new EventTarget();
const shieldChanged = "shieldchanged";

function announceShieldChange(snapshot: ShieldSnapshot) {
  shieldEvents.dispatchEvent(
    new CustomEvent<ShieldSnapshot>(shieldChanged, { detail: snapshot }),
  );
}

function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.charge} / ${snapshot.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.charge} · Missing charge: ${snapshot.missing}`;
}

function onInspectorDelivery(event: Event) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats((event as CustomEvent<ShieldSnapshot>).detail);
}

function setCount(next: number) {
  const snapshot = createShieldSnapshot(next, Capacity);
  if (snapshot.charge === count) return;
  count = snapshot.charge;
  announceShieldChange(snapshot);
}

shieldEvents.addEventListener(shieldChanged, (event) => {
  drawMeter((event as CustomEvent<ShieldSnapshot>).detail);
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(currentSnapshot());
  shieldEvents.addEventListener(shieldChanged, onInspectorDelivery);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldEvents.removeEventListener(shieldChanged, onInspectorDelivery);
  panel.remove();
  panel = null;
};
drawMeter(currentSnapshot());
