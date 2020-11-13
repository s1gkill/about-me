import colorPalette from '../colorPalette.json';

export interface ColorPalette {
  red: Shade;
  pink: Shade;
  purple: Shade;
  deeppurple: Shade;
  indigo: Shade;
  blue: Shade;
  lightblue: Shade;
  cyan: Shade;
  teal: Shade;
  green: Shade;
  lightgreen: Shade;
  lime: Shade;
  yellow: Shade;
  amber: Shade;
  orange: Shade;
  deeporange: Shade;
  brown: Shade;
  grey: Shade;
  bluegrey: Shade;
}

export interface Shade {
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
  'a100'?: string;
  'a200'?: string;
  'a400'?: string;
  'a700'?: string;
}

export const getColorHexCodes = (uniqueColors: number, shade: keyof Shade = '500'): Array<string> => {
  const palette: ColorPalette = colorPalette;
  const paletteColors = new Map(Object.entries(palette));
  const maxColors = paletteColors.size;
  const colors = [];

  if (uniqueColors > maxColors) {
    throw new Error(`Maximum number of colors available is ${maxColors} (${uniqueColors} > ${maxColors})`);
  }

  for (let i = 0; i < uniqueColors; i++) {
    const color = Array.from(paletteColors.keys())[i];
    const colorHexCodes = paletteColors.get(color);
    const hexCode = colorHexCodes[shade];

    colors.push(hexCode);
  }

  return colors;
};