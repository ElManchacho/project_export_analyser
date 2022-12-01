import { readFileSync, readdirSync, statSync } from "fs";

const projectFolderPath: string = 'Absolute path to your project' // SET VALUE WITH YOUR PROJECT PATH

const fileFunctions: string = 'exporter.js' // SET VALUE WITH YOUR FILE THAT EXPORTS ELEMENTS

const fileExtension : string = '.js' // SET VALUE WITH THE FILE TYPE YOU WANT TO CHECK

function readExportedElementModuleDotExport(pathToModuleExportFile: string): string[] {

    const file: string = readFileSync(pathToModuleExportFile, 'utf-8'); // Read function file

    

    var parsedFile: string[] = file.split("module.exports")
    
    if (parsedFile.length == 1){
        console.log("Error : There is no \'module.exports\' in "+pathToModuleExportFile+" file")
        return ['']
    }
    
    var reparsedFile = parsedFile[1].replace(' = {', '').replace('};', '').replace(' ', '') // Parse it so see what are the exported functions

    var functions: string[] = reparsedFile.split(',\r\n\t') // List exported functions

    return functions
}

const functions: string[] = readExportedElementModuleDotExport(projectFolderPath + fileFunctions)

// Read every project file (except the fileFunctions) and list the functions used in every file

// List project file's paths

function listDirectorySubfolders(path: string): string[] {
    var subfoldersList: string[] = []
    readdirSync(path).filter(function (folder) {
        if ((path + '/' + folder).indexOf('.git') == -1 && statSync(path + '/' + folder).isDirectory()) {
            subfoldersList.push(path + folder + '/')
        }
    })
    return subfoldersList
}

function listDirectoryFiles(fileExtension:string, path: string, fileFunction:string): string[] {
    var fileList: string[] = []

    readdirSync(path).forEach(file => {
        if (file.indexOf(fileExtension) != -1 && file.indexOf('.json') == -1) {
            if(file!= fileFunction) {
                fileList.push(path + String(file))
            }
        }
    });
    return fileList
}



function listJSFilesToRead(pathProject: string) {
    const foldersToSearch: string[] = listDirectorySubfolders(pathProject)

    foldersToSearch.push(pathProject)

    var files: string[] = []

    foldersToSearch.forEach(filePath => {
        files = files.concat(listDirectoryFiles(fileExtension, filePath, fileFunctions))
    })

    return files
}

const files: string[] = listJSFilesToRead(projectFolderPath)

interface Analysis {
    searchedParamater: string
    searchedParameterType: string
    paramterOccurences: number
    concernedFilesPath: string[]
}

var filesAnalysis: Analysis[] = []

functions.forEach(functionName => {
    var occurences: number = 0
    var occurencesPath: string[] = []
    files.forEach(filePath => {
        if (readFileSync(filePath, 'utf-8').indexOf(functionName) != -1) {
            occurences += 1
            occurencesPath.push(filePath)
        }
    })
    const newAnalysis: Analysis = {
        searchedParamater: functionName,
        searchedParameterType: 'function',
        paramterOccurences: occurences,
        concernedFilesPath: occurencesPath
    }
    filesAnalysis.push(newAnalysis)
})

var soloFunctions : Analysis[] = []

filesAnalysis.forEach(analysis=>{
    if (analysis.paramterOccurences==1)
    {
        soloFunctions.push(analysis)
    }
})

console.log("Searched functions among files :", filesAnalysis.length)

console.log("Functions used in only one file :", soloFunctions.length)