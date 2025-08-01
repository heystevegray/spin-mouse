#!/usr/bin/env node

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import * as robot from "robotjs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dayjs.extend(duration);

type Shape =
	| "circle"
	| "square"
	| "triangle"
	| "sinwave"
	| "coswave"
	| "heart"
	| "boobs"
	| "dick";

const shapes: Shape[] = [
	"circle",
	"square",
	"triangle",
	"sinwave",
	"coswave",
	"heart",
	"boobs",
	"dick",
];

// Shape coordinate generator factory
type ShapeCoordinateFn = (
	i: number,
	radius: number,
	centerX: number,
	centerY: number,
) => { x: number; y: number };

// Individual shape implementations
const shapeCoordinateGenerators: Record<Shape, ShapeCoordinateFn> = {
	circle: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY }; // Start at center
		return {
			x: centerX + radius * Math.cos((i * 2 * Math.PI) / 360),
			y: centerY + radius * Math.sin((i * 2 * Math.PI) / 360),
		};
	},
	square: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const stepsPerSide = 90;
		const side = radius * Math.sqrt(2);
		const sideIndex = Math.floor(i / stepsPerSide);
		const stepOnSide = i % stepsPerSide;
		let x = centerX,
			y = centerY;
		switch (sideIndex) {
			case 0: // Top
				x += -side / 2 + (side * stepOnSide) / stepsPerSide;
				y += -side / 2;
				break;
			case 1: // Right
				x += side / 2;
				y += -side / 2 + (side * stepOnSide) / stepsPerSide;
				break;
			case 2: // Bottom
				x += side / 2 - (side * stepOnSide) / stepsPerSide;
				y += side / 2;
				break;
			case 3: // Left
				x += -side / 2;
				y += side / 2 - (side * stepOnSide) / stepsPerSide;
				break;
		}
		return { x, y };
	},
	triangle: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const stepsPerSide = 120;
		const sideIndex = Math.floor(i / stepsPerSide);
		const stepOnSide = i % stepsPerSide;
		const vertices = [
			{ x: centerX, y: centerY - radius },
			{
				x: centerX + radius * Math.sin(Math.PI / 3),
				y: centerY + radius * Math.cos(Math.PI / 3),
			},
			{
				x: centerX - radius * Math.sin(Math.PI / 3),
				y: centerY + radius * Math.cos(Math.PI / 3),
			},
		];
		const start = vertices[sideIndex];
		const end = vertices[(sideIndex + 1) % 3];
		return {
			x: start.x + ((end.x - start.x) * stepOnSide) / stepsPerSide,
			y: start.y + ((end.y - start.y) * stepOnSide) / stepsPerSide,
		};
	},
	boobs: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const angle = ((i % 180) * 2 * Math.PI) / 180;
		const isRight = i >= 180;
		const boobCenterX = centerX + (isRight ? radius * 0.75 : -radius * 0.75);
		const boobCenterY = centerY;
		return {
			x: boobCenterX + radius * 0.75 * Math.cos(angle),
			y: boobCenterY + radius * 0.75 * Math.sin(angle),
		};
	},
	sinwave: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const t = (i * 2 * Math.PI) / 360;
		const x = centerX + (i / 360) * radius * 2 - radius;
		const y = centerY + radius * 0.5 * Math.sin(t);
		return { x, y };
	},
	coswave: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const t = (i * 2 * Math.PI) / 360;
		const x = centerX + (i / 360) * radius * 2 - radius;
		const y = centerY + radius * 0.5 * Math.cos(t);
		return { x, y };
	},
	heart: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const t = (i * 2 * Math.PI) / 360;
		const x = centerX + radius * 0.05 * 16 * Math.sin(t) ** 3;
		const y =
			centerY -
			radius *
				0.05 *
				(13 * Math.cos(t) -
					5 * Math.cos(2 * t) -
					2 * Math.cos(3 * t) -
					Math.cos(4 * t));
		return { x, y };
	},
	dick: (i, radius, centerX, centerY) => {
		if (i === 0) return { x: centerX, y: centerY };
		const shaftLength = radius * 1.2;
		const shaftWidth = radius * 0.3;
		if (i < 120) {
			const angle = (i / 120) * 2 * Math.PI;
			const ballCenterX = centerX - shaftWidth;
			const ballCenterY = centerY + shaftLength / 2;
			return {
				x: ballCenterX + shaftWidth * Math.cos(angle),
				y: ballCenterY + shaftWidth * Math.sin(angle),
			};
		} else if (i < 240) {
			const angle = ((i - 120) / 120) * 2 * Math.PI;
			const ballCenterX = centerX + shaftWidth;
			const ballCenterY = centerY + shaftLength / 2;
			return {
				x: ballCenterX + shaftWidth * Math.cos(angle),
				y: ballCenterY + shaftWidth * Math.sin(angle),
			};
		} else {
			const shaftStep = (i - 240) / 120;
			return {
				x: centerX,
				y: centerY + shaftLength / 2 - shaftStep * shaftLength,
			};
		}
	},
};

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
	.option("r", {
		alias: "radius",
		type: "number",
		choices: [100, 200, 300, 400, 500],
		default: 200,
		describe: "The radius of the circle in pixels that the mouse will move in.",
	})
	.option("s", {
		alias: "speed",
		type: "number",
		choices: [0.1, 0.2, 0.3, 0.4, 0.5],
		default: 0.2,
		describe: "The speed in milliseconds of the mouse movement.",
	})
	.option("x", {
		alias: "shape",
		type: "string",
		choices: shapes,
		default: "circle",
		describe: `The shape of the mouse movement.`,
	})
	.option("w", {
		alias: "wait",
		type: "number",
		choices: [5, 10, 15],
		default: 5,
		describe: "The wait time in seconds between each spin cycle.",
	})
	.option("d", {
		alias: "debug",
		type: "boolean",
		choices: [0, 1],
		default: 0,
		describe: "Pass this option to output debug information.",
	})
	.strict()
	.alias("help", "h")
	.fail((msg, err, _yargs) => {
		if (err) throw err; // Preserve stack
		console.error("Error:", msg);
		console.error(
			"\nTo see available options run: \nnpx ts-node index.ts --help",
		);
		process.exit(1);
	})
	.parseSync();

// Get the center of the screen
const screenSize = robot.getScreenSize();
const centerX = screenSize.width / 2;
const centerY = screenSize.height / 2;
let spinCount = 0;
const startTime = dayjs();

// Arguments
const shape: Shape = argv.x as Shape;
const waitTime = argv.w;
const debug = argv.d;
const radius = argv.r;
const speed = argv.s;

// Function to move the mouse in a circle
function moveMouseInShape() {
	spinCount++;

	if (debug) {
		console.log(`Spun ${spinCount} times`);
	}

	const generateCoordinates = shapeCoordinateGenerators[shape];
	const totalSteps = 360;

	for (let i = 0; i < totalSteps; i++) {
		const { x, y } = generateCoordinates(i, radius, centerX, centerY);
		robot.moveMouseSmooth(x, y, speed);
	}
}

// Function to start the cycle
function startSpinning() {
	if (debug) {
		console.log("Screen size:", screenSize);
	}
	// Start moving the mouse
	robot.setMouseDelay(speed);
	moveMouseInShape();
}

const formatDuration = () => {
	const endTime = dayjs();
	const duration = dayjs
		.duration(endTime.diff(startTime))
		.format("HH[h] mm[m] ss[s]");

	if (debug) {
		console.log(`Started at: ${startTime.format("YYYY-MM-DD HH:mm:ss")}`);
		console.log(`Ended at: ${endTime.format("YYYY-MM-DD HH:mm:ss")}`);
	}

	return `Duration: ${duration}`;
};

// Repeat the cycle every wait minutes, with a wait time in between
const intervalId = setInterval(() => {
	startSpinning();
}, waitTime * 1000);

const exit = () => {
	console.log(`\nFinished ${spinCount} spins with shape ${shape}.`);
	console.log(formatDuration());
	console.log("Now get to work 👋");
	spinCount = 0;
	clearInterval(intervalId);
	process.exit();
};

// Handle CTRL+C
process.on("SIGINT", () => {
	// console.log("\nGracefully stopping...");
	exit();
});

const main = () => {
	console.log("Configuration:");
	for (const [key, value] of Object.entries(argv)) {
		if (key.length > 1 && !key.includes("$")) {
			console.log(`- ${key}: ${value}`);
		}
	}

	console.log("\nPress CTRL+C to stop\n");

	// Start the cycle
	startSpinning();
};

main();
