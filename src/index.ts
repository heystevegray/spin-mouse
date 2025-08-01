#!/usr/bin/env node

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import * as robot from "robotjs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateCoordinates, type Shape, shapes } from "./lib/shapes";

dayjs.extend(duration);

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
		describe: "Show debug information",
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
const shape = argv.x as Shape;
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

	const totalSteps = 360;

	for (let index = 0; index < totalSteps; index++) {
		const { x, y } = generateCoordinates[shape]({
			index,
			radius,
			centerX,
			centerY,
		});
		robot.moveMouseSmooth(x, y, speed);
	}
}

// Function to start the cycle
function startSpinning() {
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
	console.log("Now get back to work 👋");
	spinCount = 0;
	clearInterval(intervalId);
	process.exit();
};

// Handle CTRL+C
process.on("SIGINT", () => {
	if (debug) {
		console.log("\nGracefully stopping...");
	}
	exit();
});

const main = () => {
	if (debug) {
		console.log("Screen size:", screenSize);
	}

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
