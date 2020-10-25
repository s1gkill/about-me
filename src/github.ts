import fetch from 'node-fetch';

// TODO: error handling

interface GitHubApiResponse {
    url: string;
}

type LanguageData = Record<string, number>;

const getRepositoryUrls = async (gitHubUser: string): Promise<Array<string>> => {
    const USER_REPOSITORIES_URL = `https://api.github.com/users/${gitHubUser}/repos`;
    const repositoryUrls: Array<string> = [];

    try {
        const data: Array<GitHubApiResponse> = await fetch(USER_REPOSITORIES_URL)
            .then(res => res.json());

        data.map((data) => repositoryUrls.push(data.url));
    } catch (e) {
        console.error(e);
    }

    return repositoryUrls;
};

export const getProgrmammingLanguages = async (gitHubUser: string): Promise<LanguageData> => {
    const repositoryUrls = await getRepositoryUrls(gitHubUser);
    const languages: Record<string, number> = {};

    for (let i = 0; i < repositoryUrls.length; i++) {
        const REPOSITORY_LANGUAGES_URL = `${repositoryUrls[i]}/languages`;
        try {
            const languagesUsedInRepository: LanguageData = await fetch(REPOSITORY_LANGUAGES_URL)
                .then(res => res.json());
            Object.keys(languagesUsedInRepository).map((language) => {
                const linesOfCodeTotal = languages[language];
                const linesOfCodeInRepo = languagesUsedInRepository[language];
                if (!linesOfCodeTotal) {
                    languages[language] = linesOfCodeInRepo;
                    return;
                }
                languages[language] = linesOfCodeTotal + linesOfCodeInRepo;
            });
        } catch (e) {
            console.error(e);
        }
    }

    return languages;
};
