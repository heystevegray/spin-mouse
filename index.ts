import dayjs from 'dayjs';
import * as robot from 'robotjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('r', {
    alias: 'radius',
    type: 'number',
    default: 200,
    describe:
      'The radius of the circle in pixels that the mouse will move in. The default value is `200`.',
  })
  .option('s', {
    alias: 'speed',
    type: 'number',
    default: 0.2,
    describe:
      'The speed in milliseconds of the mouse movement. The default value is `.2`',
  })
  .option('w', {
    alias: 'wait',
    type: 'number',
    default: 5,
    describe:
      'The wait time in seconds between each spin cycle. The default value is `5`',
  })
  .option('d', {
    alias: 'debug',
    type: 'boolean',
    default: 0,
    describe:
      'Pass this option to output debug information. The default value is `false`',
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
function moveMouseInCircle() {
  spinCount++;

  if (argv.d) {
    console.log(`Spun ${spinCount} times`);
  }

  for (let i = 0; i < 360; i += 3) {
    const x = centerX + argv.r * Math.cos((i * Math.PI) / 180);
    const y = centerY + argv.r * Math.sin((i * Math.PI) / 180);
    // isProgrammaticMove = true;
    robot.moveMouseSmooth(x, y, argv.s);
    // if (argv.d) {
    //   console.log(`\tMoving to (${x.toFixed(2)}px, ${y.toFixed(2)}px)`);
    // }
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
  moveMouseInCircle();
}

const waitTime = argv.w > 0 ? argv.w : 0.5;

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
