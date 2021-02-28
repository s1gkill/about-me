import fetch from 'node-fetch';
import { GITHUB_USER } from '../config';

type ResponseData<T> = Record<string, T>;
export type NumberRecord = Record<string, number>;

const getRepositoryUrls = async (): Promise<string[]> => {
  const url = `https://api.github.com/users/${GITHUB_USER}/repos`;
  const repositoryUrls: string[] = [];
  const repositoryData: ResponseData<string>[] = await fetch(url).then(res => res.json());
  repositoryData.map((repository) => repositoryUrls.push(repository.url));

  return repositoryUrls;
};

export const getLinesOfCodeByLanguage = async (): Promise<NumberRecord> => {
  const repositoryUrls = await getRepositoryUrls();
  const totalLinesOfCodeByLang: Record<string, number> = {};

  // TODO: handle case when no availbale repositories

  for (const url of repositoryUrls) {
    const languagesUrl = `${url}/languages`;
    const linesOfCodeInRepoByLang: NumberRecord = await fetch(languagesUrl).then(res => res.json());

    Object.keys(linesOfCodeInRepoByLang).map((lang) => {
      const total = totalLinesOfCodeByLang[lang];
      const inRepo = linesOfCodeInRepoByLang[lang];
      totalLinesOfCodeByLang[lang] = total ? total + inRepo : inRepo;
    });
  }

  return totalLinesOfCodeByLang;
};
