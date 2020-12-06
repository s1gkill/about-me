import fs from 'fs';
import path from 'path';
import { BUILD_DIR_ABSOLUTE_PATH, ROOT_DIR } from '../config';
import { generateHtmlWithChart } from './generateHtml';
import { getLinesOfCodeByLanguage, NumberRecord } from './github';

const createBuildFolder = (): void => {
  if (!fs.existsSync(BUILD_DIR_ABSOLUTE_PATH)) {
    fs.mkdirSync(BUILD_DIR_ABSOLUTE_PATH);
  }
};

const copyDirSync = (src: string, dest: string) => {
  fs.mkdirSync(dest, { recursive: true });
  const fileEntries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of fileEntries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      copyDirSync(srcPath, destPath) :
      fs.copyFileSync(srcPath, destPath);
  }
};

const copyAssets = (): void => {
  const outputPath = path.join(BUILD_DIR_ABSOLUTE_PATH);

  const favicon = path.join(ROOT_DIR, '/src/favicon.ico');
  fs.copyFileSync(favicon, outputPath + '/favicon.ico');

  const assetsPath = path.join(ROOT_DIR, '/src/assets');
  copyDirSync(assetsPath, outputPath + '/assets');
};

const copyCss = (): void => {
  const cssFilePath = path.join(ROOT_DIR, '/src/styles.css');
  const outputPath = path.join(BUILD_DIR_ABSOLUTE_PATH, '/styles.css');
  fs.copyFileSync(cssFilePath, outputPath);
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
    copyAssets();
    copyCss();
  } catch (error) {
    console.error(`------- BUILD FAILED ------- \n${error.stack}`);
  }
};
