import fs from 'fs';
import path from 'path';
import { NumberRecord } from './github';
import { GITHUB_USER, ROOT_DIR, TEMPLATE_HTML_PLACEHOLDER } from '../config';
import { getColorHexCodes } from './getColors';

let _chartData: NumberRecord = {};
let colorsByLanguage: Array<string> = [];

export const generateHtmlWithChart = (chartData: NumberRecord): string => {
  const numberOfLanguages = Object.keys(chartData).length;
  _chartData = chartData;
  colorsByLanguage = getColorHexCodes(numberOfLanguages);

  const templateHtmlPath = path.join(ROOT_DIR, '/src/template.html');
  const templateHtml = fs.readFileSync(templateHtmlPath, 'utf8');

  const canReplace = templateHtml.search(TEMPLATE_HTML_PLACEHOLDER) >= 0;

  if (!canReplace) {
    throw new Error(`Cannot replace html in template - placeholder string ${TEMPLATE_HTML_PLACEHOLDER} not found.`);
  }

  const generatedHtml = templateHtml.replace('__placeholder__', generateChartHtml());

  return generatedHtml;
};

const generateChartHtml = (): string => {
  const STATIC_STYLES = {
    cite: `
      align-self: flex-end;
      flex: 1;
      font-size: 0.6rem;
      text-align: left;
    `,
    figCaption: `
      align-self: flex-end;
      font-size: 0.6rem;
      text-align: right;
    `
  };

  const { cite, figCaption } = STATIC_STYLES;
  const gitHubUrl = `https://github.com/${GITHUB_USER}?tab=repositories`;
  const html = `
  <figure style="${generateChartCss()}">
    <cite style="${cite}">
      <span>Languages used in 
        <a href="${gitHubUrl}" target="_blank" rel="noopener">open source projects</a>
      </span>
    </cite>
    <figcaption style="${figCaption}">
      ${generateSpans().join('')}
    </figcaption>
  </figure>
  `;

  return html;
};

const generateChartCss = (): string => {
  const percentsByLanguage = calculatePercents();
  const percents = Object.values(percentsByLanguage);
  const pieStyles = `
    radial-gradient(circle closest-side, transparent 66%, #F7F7F7 0), 
    conic-gradient(
      ${generateGradientValues(percents).toString()}
    )
  `;
  const chartStyles = `
    background: ${pieStyles};
    display: flex;
    margin: 1rem;
    min-height: 15rem;
  `;

  return chartStyles;
};

const calculatePercents = (): NumberRecord => {
  const percents: NumberRecord = {};
  const total: number = Object.values(_chartData).reduce((total, current) => total + current, 0);
  for (const lang in _chartData) {
    const roundedPercentage = Math.round(_chartData[lang] / total * 100);
    percents[lang] = roundedPercentage;
  }

  return percents;
};

const generateGradientValues = (percents: Array<number>) => {
  const gradientValues: Array<string> = [];

  let prevPerc = 0;
  percents.forEach((percent, i) => {
    prevPerc += percent;
    gradientValues.push(
      `${colorsByLanguage[i]} ${i === 0 ? '' : 0} ${i === 0 ? percent : prevPerc}%`
    );
  });

  return gradientValues;
};

const generateSpans = (): Array<string> => {
  const spans: Array<string> = [];
  const languages = Object.keys(_chartData);
  languages.forEach((lang, i) => {
    spans.push(`${lang}<span style="color:${colorsByLanguage[i]}"></span><br>`);
  });

  return spans;
};


