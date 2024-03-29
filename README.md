<p align="center">
<a href="https://github.com/Socio-Development/generator">
  <img src="https://raw.githubusercontent.com/Socio-Development/generator/66b1ed38bb1f886c5250e69edf8885b3c4656971/docs/assets/socio-full.svg" alt="Socio logo" width="400px">
</a>
</p>
<br />
<p align="center">
  <a href="https://github.com/Socio-Development/generator/actions/workflows/build-status.yml"><img src="https://github.com/Socio-Development/generator/actions/workflows/build-status.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://github.com/Socio-Development/generator/actions/workflows/test-status.yml"><img src="https://github.com/Socio-Development/generator/actions/workflows/test-status.yml/badge.svg?branch=main" alt="test status"></a>
  <a href="https://github.com/Socio-Development/generator/actions/workflows/coverage-status.yml"><img src="https://github.com/Socio-Development/generator/actions/workflows/coverage-status.yml/badge.svg?branch=main" alt="test coverage status"></a>
</p>
<br />

# Generator

A code generator that provides a reliable way of creating files in your project. Excellent for generating type definitions.

## Getting started

Run `npm i -D @socio-development/generator`

### Example

The following example shows how you can generate type declarations after crawling your file system for icon asset names.

```ts
// ./scripts/generateIconTypes.ts
import { generate } from '@socio-development/generator';

// Crawls a directory and extracts all icon names
function crawlIconAssetsAndExtractNames(): string[] {
  // your code here
}

const iconNames = crawlIconAssetsAndExtractNames(); // ['add', 'delete', 'house']

// Create a template literal to be generated as code
const codeToGenerate = `
export const iconNames = ['${ iconNames.join("', '") }'] as const;

export type IconName = (typeof iconNames)[number];
`

generate({
  code: codeToGenerate, // The code you wish to generate
  file: 'icons.ts', // The file to be generated
  path: 'src/types' // Where to put the generated file
});
```

This script will generate a file `./src/types/_generated/icons.ts` containing the provided code:

```ts
// ./src/types/_generated/icons.ts
export const iconNames = ['add', 'delete', 'house'] as const;

export type IconName = (typeof iconNames)[number];
```

You can then trigger the generator by running `npx ts-node scripts/generateIconTypes.ts`. Furthermore, you can trigger the script everytime you start your development environment:

```json
// package.json
{
  "scripts": {
    "dev": "npm run generate && ts-node src/main.ts",
    "generate": "ts-node scripts/generateIconTypes.ts"
  }
}
```

### Example using snippet syntax

The generator also supports an optional syntax that VS Code users might be familiar with. Instead of using template literals, you can create an array of strings similar to how code snippets is written for VS Code. Each string in the array represents a single line in the generated code:

```ts
// ./scripts/generateIconTypes.ts
import { generate } from '@socio-development/generator';

// Crawls a directory and extracts all icon names
function crawlIconAssetsAndExtractNames(): string[] {
  // your code here
}

const iconNames = crawlIconAssetsAndExtractNames(); // ['add', 'delete', 'house']

// Create a template literal to be generated as code
const codeToGenerate = [
"export const iconNames = ['${ iconNames.join("', '") }'] as const;",
"",
"export type IconName = (typeof iconNames)[number];",
"",
"export type ComponentProps = {",
"\ticon: IconName;",
"}",
]

generate({
  code: codeToGenerate, // The code you wish to generate
  file: 'icons.ts', // The file to be generated
  path: 'src/types' // Where to put the generated file
});
```

This script will generate a file `./src/types/_generated/icons.ts` containing the provided code:

```ts
// ./src/types/_generated/icons.ts
export const iconNames = ['add', 'delete', 'house'] as const;

export type IconName = (typeof iconNames)[number];

export type ComponentProps = {
  icon: IconName;
}
```

The snippet syntax makes it easier to handle indenting of the generated code.

# Configuration options

You can change the global generator config by adding `generator.config.(js|ts)` to the root of your project.

```ts
// ./generator.config.ts
import { defineConfig } from '@socio-development/generator'

export default defineConfig({
  createDir: true, // Allows the generator to create directories
  safeMode: true, // Ensures that all files are generated within a protected directory
  safetyDirName: '_generated' // The name of the protected directory
})
```

All generator config options are described in detail below.

## Create Directory

**Name** `.createDir`

**default** `true`

This option controls whether or not the generator will create new directories in your project.

- If `true`, the generator will add directories if they don't exist.
- If `false`, the generator will throw an error if it encounters a directory that doesn't exist.

## Dot-prefix Whitelist

**name** `.dotPrefixWhitelist`

On some occasions, the generator may encounter directory- and file names that start with a dot (.gitignore, .husky). These names makes it difficult to differentiate between directories and files. If the generator encounters a dot-prefixed name it can't differentiate, it will throw an error. You can add directories and files to the whitelist to prevent this from happening.

### Example

Let's say the generator encounters `./packages/utils/.env` and throws an error:

```bash
Error: [generator] Unknown file or directory: ".env"
```

You should then add `'.env'` to `config.dotPrefixWhitelist.files`:

```ts
// generator.config.ts
import { defineConfig } from '@socio-development/generator'

export default defineConfig({
  dotPrefixWhitelist: {
    dirs: [],
    files: ['.env'] // <-- Add `.env` here
  }
})
```

The generator only validates the very end of paths, so only add the quoted name provided by the error message.

## Safe Mode (Danger Zone)

**Name** `.safeMode`

**Default** `true`

In safe mode, the generator will automatically add a directory to the end of the provided path. This is to prevent the generator from overwriting any of your files. It also has the added benefit of letting you know which files should not be edited.

### Warning
Be extremely careful when disabling this option as it can cause the generator to overwrite your files.

## Safe Mode Directory Name

**Name** `.safetyDirName`

**Default** `'_generated'`

You can change the name of the directory that is created by safe mode.

In safe mode, evey generated file is placed within a directory `**/_generated/*`. This is to protect your files from being overwritten. If you prefer a different name, you can change this to whatever you like.
