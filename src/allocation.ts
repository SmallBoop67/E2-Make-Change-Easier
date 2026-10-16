export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

interface ProvisioningFacts {
  production: number;
  consumption: number;
  balance: number;
  assigned: number;
  capacity: number;
}
function balancing(assigned: number): ProvisioningFacts {
  const production = assigned * 3;
  const capacity = 6;
  const consumption = 6;
  const balance = production - consumption;
  return { production, consumption, balance, assigned, capacity };
}

function CanvasDrawer(facts: ProvisioningFacts) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < facts.capacity; i++) {
    ctx.fillStyle = i < facts.assigned ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < facts.assigned ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${facts.assigned} / ${facts.capacity}`, 18, 76);
  ctx.fillText(`Production: ${facts.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, facts.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${facts.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, facts.consumption * 14, 20);
}

function ReadOut(facts: ProvisioningFacts) {
  readout.textContent =
    `Assigned: ${facts.assigned}/${facts.capacity} · Production: ${facts.production} · Consumption: ${facts.consumption} · Balance: ${
      facts.balance > 0 ? "+" : ""
    }${facts.balance}`;
}

function Kestrel() {
  const facts = balancing(producers);
  CanvasDrawer(facts);
  ReadOut(facts);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  Kestrel();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  Kestrel();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    Kestrel();
  };
Kestrel();
