# Analyse your project's exported elements

### This repository is used to check the module.exports of one of your project file and determine how often this exports are used inside of your project

## How to ?

```
import { readFileSync, readdirSync, statSync } from "fs";

const projectFolderPath: string = 'Absolute path to your project' // SET VALUE WITH YOUR PROJECT PATH

const fileFunctions: string = 'exporter.js' // SET VALUE WITH YOUR FILE THAT EXPORTS ELEMENTS

const fileExtension : string = '.js' // SET VALUE WITH THE FILE TYPE YOU WANT TO CHECK

...
...
...

```