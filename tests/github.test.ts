import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import { getLinesOfCodeByLanguage } from '../src/utils/github';

const MOCK_REPOSITORIES_URL_RESPONSE = {
  success: {
    data: {
      singleRepository: JSON.stringify([
        { url: 'https://g1thub-api.com/some-user-repository1' }
      ]),
      multipleRepositories: JSON.stringify([
        { url: 'https://g1thub-api.com/some-user-repository1' },
        { url: 'https://g1thub-api.com/some-user-repository2' },
        { url: 'https://g1thub-api.com/some-user-repository3' }
      ])
    },
    status: 200
  }
};

const MOCK_LANGUAGES_IN_REPO_RESPONSE = {
  success: {
    data: JSON.stringify(
      {
        JavaScript: 1201,
        Java: 923,
        PHP: 200,
        HTML: 103,
        CSS: 499
      }),
    status: 200
  }
};

describe('getProgrmammingLanguages', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return a record of languages on success', async () => {
    const { success: repoSuccess } = MOCK_REPOSITORIES_URL_RESPONSE;
    const { success: urlSuccess } = MOCK_LANGUAGES_IN_REPO_RESPONSE;
    const { data: { singleRepository: repoPayload } } = repoSuccess;
    fetchMock.mockResponses(
      [
        repoPayload,
        { status: repoSuccess.status }
      ],
      [
        urlSuccess.data,
        { status: urlSuccess.status }
      ],
    );
    const result = await getLinesOfCodeByLanguage();
    expect(result).toMatchObject({
      JavaScript: 1201,
      Java: 923,
      PHP: 200,
      HTML: 103,
      CSS: 499
    });
  });

  it('should combine total lines of code from multiple repositories', async () => {
    const { success: repoSuccess } = MOCK_REPOSITORIES_URL_RESPONSE;
    const { success: urlSuccess } = MOCK_LANGUAGES_IN_REPO_RESPONSE;
    const { data: { multipleRepositories: repoPayload } } = repoSuccess;
    fetchMock.mockResponses(
      [
        repoPayload,
        { status: repoSuccess.status }
      ],
      [
        urlSuccess.data,
        { status: urlSuccess.status }
      ],
      [
        urlSuccess.data,
        { status: urlSuccess.status }
      ],
      [
        urlSuccess.data,
        { status: urlSuccess.status }
      ],
    );
    const result = await getLinesOfCodeByLanguage();
    // 3 repository urls were mocked each containing same values
    expect(result).toMatchObject({
      JavaScript: 1201 * 3,
      Java: 923 * 3,
      PHP: 200 * 3,
      HTML: 103 * 3,
      CSS: 499 * 3
    });
  });
});
