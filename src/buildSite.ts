import fs from 'fs';
import path from 'path';
import { BUILD_DIR_ABSOLUTE_PATH, ROOT_DIR } from './config';
import { generateHtmlWithChart } from './utils/generateHtml';
import { getLinesOfCodeByLanguage, NumberRecord } from './utils/github';

const createBuildFolder = (): void => {
  if (!fs.existsSync(BUILD_DIR_ABSOLUTE_PATH)) {
    fs.mkdirSync(BUILD_DIR_ABSOLUTE_PATH);
  }
};

const copyCss = (): void => {
  const cssFilePath = path.join(ROOT_DIR, '/src/styles.css');
  const cssOutputPath = path.join(BUILD_DIR_ABSOLUTE_PATH, '/styles.css');
  fs.copyFileSync(cssFilePath, cssOutputPath);
};

const createHtmlFile = (html: string): void => {
  const indexHtmlPath = path.join(BUILD_DIR_ABSOLUTE_PATH, '/index.html');
  fs.writeFileSync(indexHtmlPath, html);
};

export const buildSite = async (): Promise<void> => {
  try {
    const linesOfCodeByLanguage: NumberRecord = await getLinesOfCodeByLanguage();
    const generatedHtml = generateHtmlWithChart(linesOfCodeByLanguage);
    createBuildFolder();
    createHtmlFile(generatedHtml);
    copyCss();
  } catch (error) {
    console.error(`------- BUILD FAILED -------: ${error.stack}`);
  }
};
