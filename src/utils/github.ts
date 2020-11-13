import fetch from 'node-fetch';
import { GITHUB_USER } from '../config';

type ResponseData<T> = Record<string, T>;
export type NumberRecord = Record<string, number>;

const getRepositoryUrls = async (): Promise<Array<string>> => {
  const url = `https://api.github.com/users/${GITHUB_USER}/repos`;
  const repositoryUrls: Array<string> = [];

  try {
    const repositoryData: Array<ResponseData<string>> = await fetch(url).then(res => res.json());
    repositoryData.map((repository) => repositoryUrls.push(repository.url));
  } catch (e) {
    console.error(e);
  }

  return repositoryUrls;
};

export const getLinesOfCodeByLanguage = async (): Promise<NumberRecord> => {
  const repositoryUrls = await getRepositoryUrls();
  const totalLinesOfCodeByLang: Record<string, number> = {};

  for (const url of repositoryUrls) {
    try {
      const languagesUrl = `${url}/languages`;
      const linesOfCodeInRepoByLang: NumberRecord = await fetch(languagesUrl).then(res => res.json());

      Object.keys(linesOfCodeInRepoByLang).map((lang) => {
        const total = totalLinesOfCodeByLang[lang];
        const inRepo = linesOfCodeInRepoByLang[lang];
        totalLinesOfCodeByLang[lang] = total ? total + inRepo : inRepo;
      });
    } catch (e) {
      console.error(e);
    }
  }

  return totalLinesOfCodeByLang;
};
