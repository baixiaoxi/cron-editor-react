// 同步package.json配置的version到components/version.tsx中

const fs = require('fs-extra');
const path = require('path');

const { version } = require('../package.json');

fs.writeFileSync(
  path.join(__dirname, '..', 'components', 'version', 'version.tsx'),
  `export default '${version}'`,
  'utf8',
);
