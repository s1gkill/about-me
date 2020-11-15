import { buildSite } from './buildSite';

(async () => {
  try {
    await buildSite();
  } catch (error) {
    console.error(error);
  }
})();
