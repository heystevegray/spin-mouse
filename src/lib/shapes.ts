export type Shape =
  | "circle"
  | "square"
  | "triangle"
  | "sinwave"
  | "coswave"
  | "heart"
  | "boobs"
  | "dick";

export const shapes: Shape[] = [
  "circle",
  "square",
  "triangle",
  "sinwave",
  "coswave",
  "heart",
  "boobs",
  "dick",
];

export type ShapeParams = {
  index: number;
  radius: number;
  centerX: number;
  centerY: number;
};

// Shape coordinate generator factory
type ShapeCoordinateFn = (params: ShapeParams) => { x: number; y: number };

// Individual shape implementations
export const generateCoordinates: Record<Shape, ShapeCoordinateFn> = {
  circle: ({ index: i, radius, centerX, centerY }) => {
    if (i === 0) return { x: centerX, y: centerY }; // Start at center
    return {
      x: centerX + radius * Math.cos((i * 2 * Math.PI) / 360),
      y: centerY + radius * Math.sin((i * 2 * Math.PI) / 360),
    };
  },
  square: ({ index: i, radius, centerX, centerY }) => {
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
  triangle: ({ index: i, radius, centerX, centerY }) => {
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
  boobs: ({ index: i, radius, centerX, centerY }) => {
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
  sinwave: ({ index: i, radius, centerX, centerY }) => {
    if (i === 0) return { x: centerX, y: centerY };
    const t = (i * 2 * Math.PI) / 360;
    const x = centerX + (i / 360) * radius * 2 - radius;
    const y = centerY + radius * 0.5 * Math.sin(t);
    return { x, y };
  },
  coswave: ({ index: i, radius, centerX, centerY }) => {
    if (i === 0) return { x: centerX, y: centerY };
    const t = (i * 2 * Math.PI) / 360;
    const x = centerX + (i / 360) * radius * 2 - radius;
    const y = centerY + radius * 0.5 * Math.cos(t);
    return { x, y };
  },
  heart: ({ index: i, radius, centerX, centerY }) => {
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
  dick: ({ index: i, radius, centerX, centerY }) => {
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
