// import { Certificate } from "node:crypto";
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

  for (let j = 0; j < ReportRows.length; j++) {
    const row = ReportRows[j];
    const value = row.pick(facts);
    const barY = 110 + j * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${value}`, 18, barY - 8);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, value * 14, 20);
  }
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

interface RowRecord {
  label: string;
  color: string;
  pick: (facts: ProvisioningFacts) => number;
}

const ReportRows: RowRecord[] = [{
  label: "Production",
  color: "#27766b",
  pick: (facts) => facts.production,
}, {
  label: "Consumption",
  color: "#a44d23",
  pick: (facts) => facts.consumption,
}];

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
