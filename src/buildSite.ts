import { createBuildFolder } from './utils/createBuildFolder';
import { generateCss } from './utils/generateCss';
import { generateHtmlWithChart } from './utils/generateHtml';
import { getLinesOfCodeByLanguage, NumberRecord } from './utils/github';

export const buildSite = async (): Promise<void> => {
  const linesOfCodeByLanguage: NumberRecord = await getLinesOfCodeByLanguage();
  createBuildFolder();
  generateHtmlWithChart(linesOfCodeByLanguage);
  generateCss();
};
