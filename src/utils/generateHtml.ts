import fs from 'fs';
import path from 'path';
import { NumberRecord } from './github';
import { GITHUB_USER } from '../config';
import { getColorHexCodes } from './getColors';

// MOCK
const response: NumberRecord = {
  JavaScript: 1221,
  Java: 923,
  PHP: 200,
  HTML: 103,
  CSS: 499
};

export const generatePageHtml = (): string | void => {
  try {
    const templateHtmlPath = path.join(__dirname, '../template.html');
    const indexHtmlPath = path.join(__dirname, '../index.html');

    const templateHtml = fs.readFileSync(templateHtmlPath, 'utf8');
    const indexHtml = templateHtml.replace('__placeholder__', generateChartHtml());
    try {
      fs.writeFileSync(indexHtmlPath, indexHtml);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

const STATIC_STYLES = {
  cite: `
    align-self: flex-end;
    flex: 1;
    font-size: 0.6rem;
    padding: 0.5rem;
  `,
  figCaption: `
    align-self: flex-end;
    font-size: 0.6rem;
    padding: 0.5rem;
    text-align: right;
  `
};

const generateChartHtml = (): string => {
  const { cite, figCaption } = STATIC_STYLES;
  const gitHubUrl = `https://github.com/${GITHUB_USER}`;
  const html = `
  <figure style="${generateChartCss()}">
    <cite style="${cite}"><a href="${gitHubUrl}" target="_blank">Source: Github</a></cite>
    <figcaption style="${figCaption}">
      ${generateSpans().join('')}
    </figcaption>
  </figure>
  `;

  return html;
};

const generateChartCss = (): string => {
  const percentsByLanguage = calculatePercents(response);
  const percents = Object.values(percentsByLanguage);
  const pieStyles = `
    radial-gradient(circle closest-side, transparent 66%, #b0e0e6 0), 
    conic-gradient(
      ${generateGradientValues(percents).toString()}
    )
  `;
  const chartStyles = `
    background: ${pieStyles};
    display: flex;
    margin: 0;
    min-height: 15rem;
    outline: 0.1rem solid black;
  `;

  return chartStyles;
};

export const calculatePercents = (languages: NumberRecord): NumberRecord => {
  const percents: NumberRecord = {};
  const total: number = Object.values(languages).reduce((total, current) => total + current, 0);
  for (const lang in languages) {
    const roundedPercentage = Math.round(languages[lang] / total * 100);
    percents[lang] = roundedPercentage;
  }

  return percents;
};

const COLORS = getColorHexCodes(Object.keys(response).length);

const generateGradientValues = (percents: Array<number>) => {
  const gradientValues: Array<string> = [];

  let prevPerc = 0;
  percents.forEach((percent, i) => {
    prevPerc += percent;
    gradientValues.push(
      `${COLORS[i]} ${i === 0 ? '' : 0} ${i === 0 ? percent : prevPerc}%`
    );
  });

  return gradientValues;
};

const generateSpans = (): Array<string> => {
  const spans: Array<string> = [];
  const languages = Object.keys(response);
  languages.forEach((lang, i) => {
    spans.push(`${lang}<span style="color:${COLORS[i]}"></span><br>`);
  });

  return spans;
};


