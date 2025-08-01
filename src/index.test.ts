import { describe, expect, it } from "vitest";
import {
  generateCoordinates,
  type Shape,
  type ShapeParams,
} from "./lib/shapes";

type TestCase = {
  shape: Shape;
  args: ShapeParams;
  expected: { x: number; y: number };
};

const testCases: TestCase[] = [
  {
    shape: "circle",
    args: { index: 90, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 6.123233995736766e-15, y: 100 },
  },
  {
    shape: "square",
    args: { index: 45, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 0, y: -70.71067811865476 },
  },
  {
    shape: "triangle",
    args: { index: 60, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 43.30127018922193, y: -25 },
  },
  {
    shape: "sinwave",
    args: { index: 180, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 0, y: 6.123233995736766e-15 },
  },
  {
    shape: "coswave",
    args: { index: 180, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 0, y: -50 },
  },
  {
    shape: "heart",
    args: { index: 90, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: 80, y: -20.000000000000004 },
  },
  {
    shape: "boobs",
    args: { index: 90, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: -150, y: 9.184850993605149e-15 },
  },
  {
    shape: "dick",
    args: { index: 60, radius: 100, centerX: 0, centerY: 0 },
    expected: { x: -60, y: 60.00000000000001 },
  },
];

describe("generateCoordinates", () => {
  for (const { shape, args, expected } of testCases) {
    it(`${shape}`, () => {
      const result = generateCoordinates[shape](args);
      expect(result).toEqual(expected);
    });
  }
});
