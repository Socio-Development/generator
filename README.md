# Generator

A code generator that provides a reliable way of creating files in your project. Excellent for generating type definitions.

## Getting started

Run `npm i -D @socio-development/generator`

### Example

```ts
// ./scripts/generateIconTypes.ts
import { generate } from '@socio-development/generator';

function crawlIconAssetsAndExtractNames(): string[] {
  // your code here
}

const iconNames = crawlIconAssetsAndExtractNames(); // ['add', 'delete']

const codeToGenerate = `
export const iconNames = ['${ iconNames.join("', '") }'] as const;

export type IconName = (typeof iconNames)[number];
`

generate({
  code: codeToGenerate,
  fileName: 'icons',
  language: 'typescript',
  path: 'src/types'
});
```

This script will generate a file `./src/types/_generated/icons.ts` containing the provided code:

```ts
// ./src/types/_generated/icons.ts
export const iconNames = ['add', 'delete'] as const;

export type IconName = (typeof iconNames)[number];
```
