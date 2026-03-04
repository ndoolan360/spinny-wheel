import { getOptionCount } from "./options.js";

/** @type {HTMLDivElement} */
const wheelElement = document.getElementById('wheel');
if (!wheelElement) throw new Error('Wheel element not found');

/** @type {SVGGElement} */
const wheelSegmentsGroupElement = document.getElementById('wheel-segments')
if (!wheelSegmentsGroupElement) throw new Error('Wheel segments group element not found');

const SVG_NS = 'http://www.w3.org/2000/svg';
const WHEEL_CENTER = 50;
const WHEEL_RADIUS = 50;

/**
 * @param {number} angle
 * @param {number} [addRevs=3] - The number of revolutions to spin the wheel.
 */
export const spinWheel = (angle, addRevs = 3) => {
  const count = getOptionCount();
  if (count === 0) return;

  angle = Math.round(angle);

  // Get current revs
  const revs = wheelElement.style.getPropertyValue('--revs') || 0;

  // Knock wheel off the border between segments
  if (angle % (360 / count) === 0) {
    angle += Math.random() < 0.5 ? 1 : -1;
  }

  // Spin!
  wheelElement.style.setProperty('--angle', angle);
  wheelElement.style.setProperty('--revs', Number(revs) + addRevs);
}

/**
 * @param {number} angleRadians - The angle in radians.
 * @param {number} [radius=WHEEL_RADIUS] - The radius from the center.
 * @returns {{x: number, y: number}} The Cartesian coordinates.
 */
const polarToCartesian = (angleRadians, radius = WHEEL_RADIUS) => ({
  x: (WHEEL_CENTER + radius * Math.cos(angleRadians)).toFixed(2),
  y: (WHEEL_CENTER + radius * Math.sin(angleRadians)).toFixed(2),
});

/**
 * @param {number} startAngle
 * @param {number} endAngle
 * @returns {string}
 */
const describeArcPath = (startAngle, endAngle) => {
  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${WHEEL_CENTER} ${WHEEL_CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

/**
 * @param {number} count - The number of segments to create.
 */
export const setWheelSegments = (count) => {
  /** @type {SVGElement[]} */
  const segments = [];

  if (count <= 0) {
    // No segments, just a blank wheel
  } else if (count === 1) {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', WHEEL_CENTER);
    circle.setAttribute('cy', WHEEL_CENTER);
    circle.setAttribute('r', WHEEL_RADIUS);
    circle.style.setProperty('--i', 0);

    segments.push(circle);
  } else {

    const step = (2 * Math.PI) / count;
    const startOffset = Math.PI / count;

    for (let i = 0; i < count; i += 1) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.classList.add('wheel-segment');

      const startAngle = startOffset + i * step;
      const endAngle = startAngle + step;
      path.setAttribute('d', describeArcPath(startAngle, endAngle));
      path.style.setProperty('--i', i);

      segments.push(path);
    }
  }

  wheelSegmentsGroupElement.style.setProperty('--count', count);
  wheelSegmentsGroupElement.replaceChildren(...segments);
};

/**
 * @param {number} wheelAngle - The current angle of the wheel in degrees.
 * @param {number} count - The number of options on the wheel.
 * @returns {number} The index of the closest option.
 */
const getClosestOptionIndex = (wheelAngle, count) => {
  const step = 360 / count;
  const targetAngle = (((360 - wheelAngle) % 360) + 360) % 360;

  let bestIndex = 0;
  let bestDelta = Infinity;

  for (let i = 0; i < count; i += 1) {
    const optionAngle = i * step;
    const delta = Math.abs(((optionAngle - targetAngle + 540) % 360) - 180);

    if (delta < bestDelta) {
      bestDelta = delta;
      bestIndex = i;
    }
  }

  return bestIndex;
};

/**
 * @returns {number} The current rotation of the wheel in degrees.
 */
const getRotationDegrees = () => {
  const transform = getComputedStyle(wheelElement).transform;
  if (!transform || transform === 'none') return 0;

  const matrixMatch = transform.match(/^matrix(?:3d)?\((.+)\)$/);
  if (!matrixMatch) {
    return 0;
  }

  const values = matrixMatch[1].split(',').map((v) => parseFloat(v.trim()));
  const [a, b] = values;
  return ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360;
};

/**
 * @returns {number} The index of the currently selected option, or -1 if there are no options.
 */
export const getCurrentIndex = () => {
  const count = getOptionCount();
  if (count === 0) return -1;

  const angle = getRotationDegrees();
  return getClosestOptionIndex(angle, count);
};

/**
 * @returns {number} The total transition time in milliseconds for the wheel element.
 */
export const getTransitionTotalMs = () => {
  const parseTimeToMs = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    if (trimmed.endsWith('ms')) return parseFloat(trimmed);
    if (trimmed.endsWith('s')) return parseFloat(trimmed) * 1000;
    return 0;
  };

  const parseTimeListToMs = (value) =>
    value
      .split(',')
      .map(parseTimeToMs)
      .reduce((max, time) => Math.max(max, time), 0);

  const style = getComputedStyle(wheelElement);
  const duration = parseTimeListToMs(style.transitionDuration);
  const delay = parseTimeListToMs(style.transitionDelay);
  return duration + delay;
};
