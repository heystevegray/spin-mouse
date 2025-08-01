import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import * as robot from 'robotjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dayjs.extend(duration);

type Shape = 'circle' | 'square' | 'triangle';
const shapes: Shape[] = ['circle', 'square', 'triangle'];


// Shape coordinate generator factory
type ShapeCoordinateFn = (i: number, radius: number, centerX: number, centerY: number) => { x: number; y: number };

// Individual shape implementations
const shapeCoordinateGenerators: Record<Shape, ShapeCoordinateFn> = {
  circle: (i, radius, centerX, centerY) => ({
    x: centerX + radius * Math.cos((i * Math.PI) / 180),
    y: centerY + radius * Math.sin((i * Math.PI) / 180),
  }),
  square: (i, radius, centerX, centerY) => {
    // Divide the perimeter into 4 sides, each with equal steps
    const stepsPerSide = 90;
    const side = radius * Math.sqrt(2);
    const sideIndex = Math.floor(i / stepsPerSide);
    const stepOnSide = i % stepsPerSide;
    let x = centerX, y = centerY;
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
    // Divide perimeter into 3 sides, each with equal steps
    const stepsPerSide = 120;
    const sideIndex = Math.floor(i / stepsPerSide);
    const stepOnSide = i % stepsPerSide;
    const vertices = [
      { x: centerX, y: centerY - radius },
      { x: centerX + radius * Math.sin(Math.PI / 3), y: centerY + radius * Math.cos(Math.PI / 3) },
      { x: centerX - radius * Math.sin(Math.PI / 3), y: centerY + radius * Math.cos(Math.PI / 3) },
    ];
    const start = vertices[sideIndex];
    const end = vertices[(sideIndex + 1) % 3];
    return {
      x: start.x + ((end.x - start.x) * stepOnSide) / stepsPerSide,
      y: start.y + ((end.y - start.y) * stepOnSide) / stepsPerSide,
    };
  },
};


// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('r', {
    alias: 'radius',
    type: 'number',
    default: 200,
    describe:
      'The radius of the circle in pixels that the mouse will move in.',
  })
  .option('s', {
    alias: 'speed',
    type: 'number',
    default: 0.2,
    describe:
      'The speed in milliseconds of the mouse movement.',
  })
  .option('x', {
    alias: 'shape',
    type: 'string',
    default: 'circle',
    describe:
      `The shape of the mouse movement.Valid options are: "${shapes.join(', ')}"`,
  })
  .option('w', {
    alias: 'wait',
    type: 'number',
    default: 5,
    describe:
      'The wait time in seconds between each spin cycle.',
  })
  .option('d', {
    alias: 'debug',
    type: 'boolean',
    default: 0,
    describe:
      'Pass this option to output debug information.',
  })
  .strict()
  .fail((msg, err, _yargs) => {
    if (err) throw err; // Preserve stack
    console.error('Error:', msg);
    console.error(
      '\nTo see available options run: \nnpx ts-node index.ts --help',
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

// let isProgrammaticMove = false;

// Function to move the mouse in a circle
function moveMouseInShape() {
  spinCount++;

  if (argv.d) {
    console.log(`Spun ${spinCount} times`);
  }


  const shape: Shape = argv.x as Shape || 'circle';
  const generateCoordinates =shapeCoordinateGenerators[shape] 

  const radius = argv.r;
  const totalSteps = 360;
  const stepDelay = argv.s;
  
  for (let i = 0; i < totalSteps; i++) {
    const { x, y } = generateCoordinates(i, radius, centerX, centerY);
    // isProgrammaticMove = true;
    robot.moveMouseSmooth(x, y, stepDelay);
    // isProgrammaticMove = false;
  }
}

// Function to start the cycle
function startSpinning() {
  // if (argv.d) {
  //   console.log('Screen size:', screenSize);
  // }
  // Start moving the mouse
  robot.setMouseDelay(argv.s);
  moveMouseInShape();
}

const waitTime = argv.w || 5; // Default wait time in seconds

const formatDuration = () => {
  const endTime = dayjs();
  const duration = dayjs
    .duration(endTime.diff(startTime))
    .format('HH[h] mm[m] ss[s]');

  if (argv.d) {
    console.log(`Started at: ${startTime.format('YYYY-MM-DD HH:mm:ss')}`);
    console.log(`Ended at: ${endTime.format('YYYY-MM-DD HH:mm:ss')}`);
  }

  return `Duration: ${duration}`;
};

// Repeat the cycle every wait minutes, with a wait time in between
const intervalId = setInterval(() => {
  startSpinning();
}, waitTime * 1000);

const exit = () => {
  console.log(`\nFinished spinning after ${spinCount} spins.`);
  console.log(formatDuration());
  console.log('Now get to work 👋');
  spinCount = 0;
  clearInterval(intervalId);
  process.exit();
};

// Handle CTRL+C
process.on('SIGINT', () => {
  console.log('\nGracefully stopping...');
  exit();
});

// // Check for mouse movement
// let lastPos = robot.getMousePos();

// setInterval(() => {
//   let currentPos = robot.getMousePos();
//   // if (
//   //   !isProgrammaticMove &&
//   //   (currentPos.x !== lastPos.x || currentPos.y !== lastPos.y)
//   // ) {
//   //   console.log('Mouse moved by user, stopping...');
//   //   exit();
//   // }

//   lastPos = currentPos;
// }, 100);

const main = () => {
  // Log config
  console.log('Configuration:');
  for (const [key, value] of Object.entries(argv)) {
    if (key.length > 1 && !key.includes('$')) {
      console.log(`- ${key}: ${value}`);
    }
  }

  console.log('\nPress CTRL+C to stop\n');

  // Start the cycle
  startSpinning();
};

main();
