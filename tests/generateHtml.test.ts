import { mocked } from 'ts-jest/utils';
import fs from 'fs';
import { generateHtmlWithChart } from '../src/modules/generateHtml';

jest.mock('fs');
const _fs = {
  readFileSync: mocked(fs.readFileSync)
};

const MOCK_HTML_WITHOUT_PLACEHOLDER = () => `
<!DOCTYPE html>
  <html>
    <body>
      <h1>Hello world!</h1>
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
  it('should throw an error if placeholder string to replace with generated html cannot be found', () => {
    console.error = jest.fn();
    _fs.readFileSync.mockReturnValue(MOCK_HTML_WITHOUT_PLACEHOLDER());

    expect(() => generateHtmlWithChart(MOCK_DATA)).toThrow();
  });
});
