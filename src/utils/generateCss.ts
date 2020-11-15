import { copyFileSync } from 'fs';
import path from 'path';
import { BUILD_DIR_ABSOLUTE_PATH } from '../config';

export const generateCss = (): void => {
  const cssFilePath = path.join(__dirname, '../styles.css');
  const cssOutputPath = path.join(BUILD_DIR_ABSOLUTE_PATH, '/styles.css');
  copyFileSync(cssFilePath, cssOutputPath);
};
