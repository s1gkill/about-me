import { mocked } from 'ts-jest/utils';
import fs from 'fs';
import path from 'path';
import { generatePageHtml } from '../src/utils/generateHtml';

jest.mock('fs');
const _fs = {
  writeFileSync: mocked(fs.writeFileSync),
  readFileSync: mocked(fs.readFileSync)
};

const MOCK_HTML = `
<!DOCTYPE html>
  <html>
    <body>
      <h1>Hello world!</h1>
    </body>
  </html>
`;

describe('generateHtml', () => {
  it('should generate an "index.html" file to project root folder', () => {
    const generatedHtmlPath = path.resolve(__dirname, '../html/index.html');
    _fs.writeFileSync.mockClear();
    _fs.readFileSync.mockReturnValue(MOCK_HTML);
    generatePageHtml();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      generatedHtmlPath,
      MOCK_HTML
    );
  });
});
