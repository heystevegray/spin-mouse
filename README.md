<br/>

<div align="center">
  <img src="./public/logo.png#gh-dark-mode-only" />
  <img src="./public/logo-white.png#gh-light-mode-only" />
</div>
<div align="center">
  <h3>spin-mouse</h3>
</div>

<br/>

- [Usage](#usage)
- [Installation](#installation)
	- [ssh](#ssh)
	- [https](#https)
	- [Options](#options)
	- [Terminating the Program](#terminating-the-program)
- [How It Works](#how-it-works)

This is a [Node.js](https://nodejs.org/en) application that uses the [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file) library to spin your mouse in different shapes. It accepts several command-line arguments to customize the behavior of the mouse movement.

## Usage

You can run the application with `npx spin-mouse` followed by any options you want to use:

```bash
npx spin-mouse --radius 200 --speed 0.2 --wait 5
```

See the available options with `-h` or `--help`

```bash
npx spin-mouse -h
```

## Installation

First, make sure you have [Node.js installed](https://nodejs.org/en/download/package-manager) on your machine. Then, clone this repository and install the dependencies:

### ssh
```bash
git clone git@github.com:heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

### https
```bash
git clone https://github.com/heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

### Options

- `-r, --radius <number>`: The radius of the circle in pixels that the mouse will move in. The default value is `200`. Choices are `[100, 200, 300, 400, 500]`.
- `-s, --speed <number>`: The speed in milliseconds of the mouse movement. The default value is `0.2`. Choices are `[0.1, 0.2, 0.3, 0.4, 0.5]`.
- `-x, --shape <string>`: The shape of the mouse movement. The default value is `circle`. Choices are `[circle, square, triangle, sinwave, coswave, heart, boobs, dick]`.
- `-w, --wait <number>`: The wait time in seconds between each spin cycle. The default value is `5`. Choices are `[5, 10, 15]`.
- `-d, --debug <boolean>`: Pass this option to output debug information. The default value is `false`.
- `-h, --help`: Show help information about how to use the program and its options.

### Terminating the Program

1. **Keyboard Interrupt:** You can stop the program by using the keyboard interrupt command. On most systems, this is `Command + C`. Or in a panic, quit the terminal. The wait time is at least 5 seconds between spins so you have 5 seconds to drive the mouse at a minimum.



## How It Works

The application first parses the command-line arguments using the [yargs](https://www.npmjs.com/package/yargs) library. It then gets the size of the screen using [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file), and uses this information along with the provided options to calculate the path of the mouse movement. The mouse is then moved in a circle on the screen using [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file).
