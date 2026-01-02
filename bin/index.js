#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { version, description } = require('../package.json');

const DEFAULT_ENV_FILES = ['.env', '.env.local', '.env.production'];

program
  .name('dotenv-example')
  .version(version)
  .description(description)
  .option('-o, --output <file>', 'output file name', '.env.example')
  .option('-f, --file <file>', 'specific env file to use')
  .action((options) => {
    generateEnvExample(options);
  });

program.parse();

function findEnvFile(specificFile) {
  if (specificFile) {
    const filePath = path.join(process.cwd(), specificFile);
    if (fs.existsSync(filePath)) {
      return { path: filePath, name: specificFile };
    }
    console.error(`Error: ${specificFile} not found`);
    process.exit(1);
  }

  for (const file of DEFAULT_ENV_FILES) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      return { path: filePath, name: file };
    }
  }
  return null;
}

function maskLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return line;

  const match = line.match(/^([^=]+)=(.*)$/);
  if (!match) return line;

  const [, key, value] = match;
  const placeholder = `your_${key.trim().toLowerCase()}`;

  if (value.startsWith('"') && value.endsWith('"')) return `${key}="${placeholder}"`;
  if (value.startsWith("'") && value.endsWith("'")) return `${key}='${placeholder}'`;
  return `${key}=${placeholder}`;
}

function generateEnvExample(options) {
  const envFile = findEnvFile(options.file);
  if (!envFile) {
    console.error(`Error: No env file found. Looked for: ${DEFAULT_ENV_FILES.join(', ')}`);
    process.exit(1);
  }

  try {
    console.log(`📁 Using ${envFile.name}`);
    const content = fs.readFileSync(envFile.path, 'utf-8');
    const masked = content.split('\n').map(maskLine).join('\n');

    const outputPath = path.join(process.cwd(), options.output);
    fs.writeFileSync(outputPath, masked);
    console.log(`✅ Created ${options.output}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
