export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const routeList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

let x = 2;
let y = 2;
let direction = 0;

interface Command {
  execute: () => void;
  label: string;
}

const forwardCommand: Command = {
  label: "Forward",
  execute: () => {
    const currentDirection = Compass[direction];
    x = x + currentDirection.dx;
    y = y + currentDirection.dy;
    x = Math.max(0, Math.min(4, x));
    y = Math.max(0, Math.min(4, y));
    drawRover();
  },
};

const rightCommand: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % Compass.length;
    drawRover();
  },
};

const plannedRoute: Command[] = [];

interface DirectionRecord {
  name: string;
  dx: number;
  dy: number;
}

const Compass: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: +1, dy: 0 },
  { name: "South", dx: 0, dy: +1 },
  { name: "West", dx: -1, dy: 0 },
];

function updateRouteDisplay() {
  routeList.replaceChildren();
  for (const command of plannedRoute) {
    const item = document.createElement("li");
    item.textContent = command.label;
    routeList.appendChild(item);
  }
  const isEmpty = plannedRoute.length === 0;
  runButton.disabled = isEmpty;
  clearButton.disabled = isEmpty;
}

function enqueue(command: Command) {
  plannedRoute.push(command);
  updateRouteDisplay();
}

function runRoute() {
  while (plannedRoute.length > 0) {
    plannedRoute.shift()!.execute();
  }
  updateRouteDisplay();
}

function clearRoute() {
  plannedRoute.length = 0;
  updateRouteDisplay();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    Compass[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueue(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueue(rightCommand);
};

runButton.onclick = runRoute;
clearButton.onclick = clearRoute;

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  plannedRoute.length = 0;
  updateRouteDisplay();
  drawRover();
};
drawRover();
updateRouteDisplay();
