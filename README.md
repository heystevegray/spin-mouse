- [spin-mouse](#spin-mouse)
	- [Installation](#installation)
	- [Usage](#usage)
		- [Options](#options)
		- [Terminating the Program](#terminating-the-program)
	- [How It Works](#how-it-works)

# spin-mouse

This is a [Node.js](https://nodejs.org/en) application that uses the [`robotjs`](https://robotjs.io/) library to move the mouse in a circle on the screen. It accepts several command-line arguments to customize the behavior of the mouse movement.

## Installation

First, make sure you have [Node.js installed](https://nodejs.org/en/download/package-manager) on your machine. Then, clone this repository and install the dependencies:

```bash
git clone git@github.com:heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

or

```bash
git clone https://github.com/heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

## Usage

You can run the application with `npx ts-node index.ts` followed by any options you want to use:

```bash
npx ts-node index.ts --radius 200 --speed 0.2 --wait 1
```

### Options

- `-r, --radius <number>`: The radius of the circle in pixels that the mouse will move in. The default value is `100`.
- `-s, --speed <number>`: The speed in milliseconds of the mouse movement. The default value is `0.1`.
- `-w, --wait <number>`: The wait time in seconds between each spin cycle. The default value is `0.5`.
- `-d, --debug <boolean>`: Pass this option to output debug information. The default value is `false`.
- `--help`: Show help information about how to use the program and its options.

### Terminating the Program

The program can be terminated in two ways:

1. **User-Initiated Mouse Movement:** If the mouse is moved manually, the program will detect this action and terminate automatically.

2. **Keyboard Interrupt:** You can also stop the program by using the keyboard interrupt command. On most systems, this is `Command + C`.



## How It Works

The application first parses the command-line arguments using the [yargs](https://www.npmjs.com/package/yargs) library. It then gets the size of the screen using [`robotjs`](https://robotjs.io/), and uses this information along with the provided options to calculate the path of the mouse movement. The mouse is then moved in a circle on the screen using [`robotjs`](https://robotjs.io/).
