const fs = require('fs');
const path = require('path');

const productPath = path.join(process.cwd(), 'product.json');
const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));

Object.assign(product, {
  nameShort: 'FreeAI IDE',
  nameLong: 'FreeAI IDE',
  applicationName: 'freeai-ide',
  dataFolderName: '.freeai-ide',
  win32MutexName: 'freeaiide',
  licenseName: 'MIT',
  reportIssueUrl: 'https://github.com/FreeAIIDE/FreeAIIDE/issues/new',
  urlProtocol: 'freeai-ide',
  extensionEnabledApiProposals: {
    ...product.extensionEnabledApiProposals
  }
});

delete product.quality;
delete product.updateUrl;
delete product.releaseNotesUrl;
delete product.documentationUrl;
delete product.requestFeatureUrl;
delete product.twitterUrl;
delete product.crashReporter;
delete product.aiConfig;

fs.writeFileSync(productPath, `${JSON.stringify(product, null, 2)}\n`);
