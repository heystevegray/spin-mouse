<br/>

<div align="center">
  <img src="./public/logo.png#gh-light-mode-only" />
  <img src="./public/logo-white.png#gh-dark-mode-only" />
</div>
<div align="center">
  <h3>spin-mouse</h3>
  <p>A Node.js application to spin your mouse in customizable shapes.</p>
</div>

This is a [Node.js](https://nodejs.org/en) application that uses the [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file) library to spin your mouse in different shapes.

- [Usage](#usage)
	- [Default Circle Shape](#default-circle-shape)
	- [With Custom Options](#with-custom-options)
	- [Help](#help)
- [Installation](#installation)
	- [SSH](#ssh)
	- [HTTPS](#https)
- [Options](#options)
- [Terminating the Program](#terminating-the-program)
- [How It Works](#how-it-works)

## Usage

### Default Circle Shape

```bash
npx spin-mouse
```

### With Custom Options

```bash
npx spin-mouse --radius 200 --speed 0.2 --wait 5
```

### Help
See the available options with `-h` or `--help`:

```bash
npx spin-mouse -h
```

## Installation

First, make sure you have [Node.js installed](https://nodejs.org/en/download/package-manager) on your machine. Then, clone this repository and install the dependencies:

### SSH
Use SSH if you have set up SSH keys with GitHub:

```bash
git clone git@github.com:heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

### HTTPS
Use HTTPS if you prefer not to use SSH:

```bash
git clone https://github.com/heystevegray/spin-mouse.git
cd spin-mouse
npm install
```

## Options

| Option               | Description                                                                 | Default Value | Choices                                      |
|----------------------|-----------------------------------------------------------------------------|---------------|----------------------------------------------|
| `-r, --radius`       | The radius of the shape in pixels that the mouse will move in.             | `200`         | `[100, 200, 300, 400, 500]`                 |
| `-s, --speed`        | The speed in milliseconds of the mouse movement.                          | `0.2`         | `[0.1, 0.2, 0.3, 0.4, 0.5]`                 |
| `-x, --shape`        | The shape of the mouse movement.                                           | `circle`      | `[circle, square, triangle, sinwave, coswave, heart, boobs, dick]` |
| `-w, --wait`         | The wait time in seconds between each spin cycle.                         | `5`           | `[5, 10, 15]`                               |
| `-d, --debug`        | Show debug information.                                                   | `false`       | `[true, false]`                             |
| `-h, --help`         | Show help information about how to use the program and its options.       |               |                                              |

## Terminating the Program

You can stop the program using one of the following methods:

1. **Keyboard Interrupt:** Press `Ctrl + C` in the terminal.
2. **Quit Terminal:** Close the terminal window. Note that the program waits at least 5 seconds between spins, giving you time to interrupt it.

## How It Works

- The application parses the command-line arguments using the [yargs](https://www.npmjs.com/package/yargs) library.
- It retrieves the screen size using [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file).
- Based on the provided options, it calculates the path for mouse movement.
- The mouse is moved in the specified shape on the screen using [`robotjs`](https://github.com/octalmage/robotjs?tab=readme-ov-file).
