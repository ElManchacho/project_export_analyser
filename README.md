# Analyse your project's exported elements

### This repository is used to check the module.exports of one of your project file and determine how often this exports are used inside of your project

## How to ?


#### Prerequisites

You need to have node installed, version v16.14.0 works fine.

Then run 
```bash
npm install typescript -g 
```
as the script is in Typescript.


#### Step 1

Check the ```functionparser.js``` file at it's top and change the 3 following variables to your liking :

- projectFolderPath --> Absolute path to your project
- fileFunctions --> File at the path ```projectFolderPath``` in which your ```module.exports``` is located
- fileExtension --> Extension of the files you wish to analyse

The part of the file you need to modify is lookiing like this : 

```
import { readFileSync, readdirSync, statSync } from "fs";

const projectFolderPath: string = 'Absolute path to your project' // SET VALUE WITH YOUR PROJECT PATH

const fileFunctions: string = 'exporter.js' // SET VALUE WITH YOUR FILE THAT EXPORTS ELEMENTS

const fileExtension : string = '.js' // SET VALUE WITH THE FILE TYPE YOU WANT TO CHECK

...
...
...

```

#### Step 2 