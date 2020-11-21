import path from 'path';

export const ROOT_DIR = process.cwd(); // dir where node command was invoked 
export const GITHUB_USER = process.env.GITHUB_USER || 'nkrmoose';
export const TEMPLATE_HTML_PLACEHOLDER = process.env.TEMPLATE_HTML_PLACEHOLDER || '__placeholder__';
export const BUILD_DIR_ABSOLUTE_PATH = process.env.BUILD_DIR_ABSOLUTE_PATH || path.join(ROOT_DIR, '/html');
