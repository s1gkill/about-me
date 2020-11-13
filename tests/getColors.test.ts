import { getColorHexCodes } from '../src/utils/getColors';

describe('getColors', () => {
  const hexCodeRegex = /^#[a-z,0-9]{6}$/;
  const expectEachHexCodeMatches = (hexCodeArray: Array<string>) => {
    for (const hexcode of hexCodeArray) {
      expect(hexcode).toMatch(hexCodeRegex);
    }
  };

  it('should return array of hex codes by the given number', () => {
    const colors = getColorHexCodes(8);
    expect(colors).toHaveLength(8);
    expectEachHexCodeMatches(colors);
  });

  it('should return array of hex codes with set shade', () => {
    const colors = getColorHexCodes(12, 'a100');
    expectEachHexCodeMatches(colors);
  });

  it('should return array of hex codes with different shades', () => {
    const colorsWithShade300 = getColorHexCodes(2, '300');
    expectEachHexCodeMatches(colorsWithShade300);

    const colorsWithShade900 = getColorHexCodes(2, '900');
    expectEachHexCodeMatches(colorsWithShade900);

    expect(colorsWithShade300[0]).not.toEqual(colorsWithShade900[0]);
    expect(colorsWithShade300[1]).not.toEqual(colorsWithShade900[1]);
  });

  it('should throw an error if number of colors is too high', () => {
    expect(() => getColorHexCodes(100)).toThrow();
  });
});