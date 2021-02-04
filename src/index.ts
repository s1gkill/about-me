import { GITHUB_USER } from './config';
import { buildSite } from './modules/buildSite';

(async () => {
  if (!GITHUB_USER) {
    console.error(`Github username is required. Pass it as an argument 
  for the "generate" script: "npm run generate -- myGitHubUsername"`);
    process.exit(1);
  }

  await buildSite();
})();
