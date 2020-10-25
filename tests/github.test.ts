import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { getProgrmammingLanguages } from '../src/github';

const MOCK_REPOSITORIES_URL_RESPONSE = {
    success: {
        data: JSON.stringify([
            { url: 'https://g1thub-api.com/some-user-repository1' },
            { url: 'https://g1thub-api.com/some-user-repository2' },
            { url: 'https://g1thub-api.com/some-user-repository3' }
        ]),
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
        fetchMock.mockResponses(
            [
                repoSuccess.data,
                { status: repoSuccess.status }
            ],
            [
                urlSuccess.data,
                { status: urlSuccess.status }
            ],
        );
        const result = await getProgrmammingLanguages('someUser');
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
        fetchMock.mockResponses(
            [
                repoSuccess.data,
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
        const result = await getProgrmammingLanguages('someUser');
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