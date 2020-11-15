import { mocked } from 'ts-jest/utils';
import fs from 'fs';
import path from 'path';
import { generatePageHtml } from '../src/utils/generateHtml';
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

describe('generateHtml', () => {
  it('should generate an "index.html" file to project root folder', () => {
    const generatedHtmlPath = path.resolve(__dirname, '../html/index.html');
    _fs.readFileSync.mockReturnValue(MOCK_HTML(config.TEMPLATE_HTML_PLACEHOLDER));
    _fs.writeFileSync.mockClear();

    generatePageHtml();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      generatedHtmlPath,
      expect.stringContaining('<h1>Hello world!</h1>')
    );
  });

  it('should log an error if placeholder string to replace with generated html cannot be found', () => {
    console.error = jest.fn();
    _fs.readFileSync.mockReturnValue(MOCK_HTML());

    generatePageHtml();

    expect(console.error).toHaveBeenCalled();
  });
});
