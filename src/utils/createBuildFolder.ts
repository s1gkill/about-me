import fs from 'fs';
import { BUILD_DIR_ABSOLUTE_PATH } from '../config';

export const createBuildFolder = (): void => {
  if (!fs.existsSync(BUILD_DIR_ABSOLUTE_PATH)) {
    fs.mkdirSync(BUILD_DIR_ABSOLUTE_PATH);
  }
};
