import path from 'path';

export const ROOT_DIR = process.cwd(); // dir where node command was invoked )
export const GITHUB_USER = process.argv[2];
export const TEMPLATE_HTML_PLACEHOLDER = '__placeholder__';
export const BUILD_DIR_ABSOLUTE_PATH = path.join(ROOT_DIR, '/html');
