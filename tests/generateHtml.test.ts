import { mocked } from 'ts-jest/utils';
import fs from 'fs';
import path from 'path';
import { generateHtmlWithChart } from '../src/utils/generateHtml';
import * as config from '../src/config';

jest.mock('fs');
const _fs = {
  writeFileSync: mocked(fs.writeFileSync),
  readFileSync: mocked(fs.readFileSync)
};

const MOCK_HTML = (placeHolderString?: string) => `
<!DOCTYPE html>
  <html>
    <body>
      <h1>Hello world!</h1>
      ${placeHolderString}
    </body>
  </html>
`;

const MOCK_DATA = {
  JavaScript: 1221,
  Java: 923,
  PHP: 200,
  HTML: 103,
  CSS: 499
};

describe('generateHtml', () => {
  it('should generate an "index.html" file to configured build folder', () => {
    _fs.readFileSync.mockReturnValue(MOCK_HTML(config.TEMPLATE_HTML_PLACEHOLDER));
    _fs.writeFileSync.mockClear();

    generateHtmlWithChart(MOCK_DATA);

    const outputPath = path.join(config.BUILD_DIR_ABSOLUTE_PATH, '/index.html');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputPath,
      expect.stringContaining('<h1>Hello world!</h1>')
    );
  });

  it('should throw an error if placeholder string to replace with generated html cannot be found', () => {
    console.error = jest.fn();
    _fs.readFileSync.mockReturnValue(MOCK_HTML());

    expect(() => generateHtmlWithChart(MOCK_DATA)).toThrow();
  });
});
