import { readFileSync, readdirSync, statSync, mkdirSync, existsSync, writeFileSync } from "fs";
import Excel from 'exceljs';
import path from 'path';

const projectFolderPath: string = 'Absolute path to your project' // SET VALUE WITH YOUR PROJECT PATH

const fileFunctions: string = 'exporter.js' // SET VALUE WITH YOUR FILE THAT EXPORTS ELEMENTS

const fileExtension: string = '.js' // SET VALUE WITH THE FILE TYPE YOU WANT TO CHECK

function readExportedElementModuleDotExport(pathToModuleExportFile: string): string[] {

    const file: string = readFileSync(pathToModuleExportFile, 'utf-8'); // Read function file

    var parsedFile: string[] = file.split("module.exports")

    if (parsedFile.length == 1) {
        console.log("Error : There is no \'module.exports\' in " + pathToModuleExportFile + " file")
        return ['']
    }

    var reparsedFile = parsedFile[1].replace(' = {', '').replace('};', '').replace(' ', '') // Parse it so see what are the exported functions
    reparsedFile = reparsedFile.split('\r').join('').split('\t').join('').split('\n').join('') // Delete spaces and line breaks
    var functions: string[] = reparsedFile.split(',') // List exported functions

    return functions
}

const functions: string[] = readExportedElementModuleDotExport(projectFolderPath + fileFunctions)

// Read every project file (except the fileFunctions) and analyse it

type Analysis = {
    searchedParamater: string;
    searchedParameterType: string;
    paramterOccurences: number;
    concernedFilesPath: string[];
}

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

function listDirectoryFiles(fileExtension: string, path: string, fileFunction: string): string[] {
    var fileList: string[] = []

    readdirSync(path).forEach(file => {
        if (file.indexOf(fileExtension) != -1 && file.indexOf('.json') == -1) {
            if (file != fileFunction) {
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

var soloFunctions: Analysis[] = []

filesAnalysis.forEach(analysis => {
    if (analysis.paramterOccurences == 1) {
        soloFunctions.push(analysis)
    }
})

const message1: string = "Searched functions among files : " + String(filesAnalysis.length)

const message2: string = "Functions used in only one file : " + String(soloFunctions.length)

const timestamp : string = String(new Date().getTime())

const folderName: string = __dirname + '/reports/report_' + timestamp


try {
    console.log(folderName)
    if (!existsSync(folderName)) {
        mkdirSync(folderName);
    }
} catch (err) {
    console.error(err);
}

const content: string = message1 + '\n\n' + message2

try {
    writeFileSync(folderName+'/Report_'+timestamp+'_messages.txt', content);
} catch (err) {
    console.error(err);
}

try{
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Countries List');

    worksheet.columns = [
        { key: 'searchedParamater', header: 'Searched parameter' },
        { key: 'searchedParameterType', header: 'Parameter type' },
        { key: 'paramterOccurences', header: 'Number of time it appears' },
        { key: 'concernedFilesPath', header: 'File in which it appears' },
    ];

    filesAnalysis.forEach((item) => {
        worksheet.addRow(item);
    });

    const exportPath = path.resolve(folderName+'/', 'Report_'+timestamp+'_Analysis.xlsx');

    workbook.xlsx.writeFile(exportPath);
} catch (err){
    console.log(err)
}
