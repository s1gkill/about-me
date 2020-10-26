import fetch from 'node-fetch';

type RepositoryData<T> = Record<string, T>;
type LanguageData = Record<string, number>;

const getRepositoryUrls = async (gitHubUser: string): Promise<Array<string>> => {
  const url = `https://api.github.com/users/${gitHubUser}/repos`;
  const repositoryUrls: Array<string> = [];

  try {
    const repositoryData: Array<RepositoryData<string>> = await fetch(url).then(res => res.json());
    repositoryData.map((repository) => repositoryUrls.push(repository.url));
  } catch (e) {
    console.error(e);
  }

  return repositoryUrls;
};

export const getLinesOfCodeByLanguage = async (gitHubUser: string): Promise<LanguageData> => {
  const repositoryUrls = await getRepositoryUrls(gitHubUser);
  const totalLinesOfCodeByLang: Record<string, number> = {};

  for (const url of repositoryUrls) {
    try {
      const languagesUrl = `${url}/languages`;
      const linesOfCodeInRepoByLang: LanguageData = await fetch(languagesUrl).then(res => res.json());

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
