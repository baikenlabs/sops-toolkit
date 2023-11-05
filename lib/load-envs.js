const SOPS_AGE_KEY_FILE = '~/.sops/baiken-age-key.txt'
const { config: dotEnv } = require('dotenv')
const { execSync } = require("child_process")
const { existsSync } = require('fs')
const { resolve, join } = require('path')

module.exports.loadEnvs = async function (inputFile, rootFolder = process.cwd()) {
    const AGE_PRIVATE_KEY = process?.env?.AGE_PRIVATE_KEY
    console.log(`
SOPS: app decrypt and loading envs
=============
AGE_PRIVATE_KEY: ${AGE_PRIVATE_KEY}
SOPS_AGE_KEY_FILE: ${SOPS_AGE_KEY_FILE}
inputFile: ${inputFile}
destinationFile: ${rootFolder}
`)
    const sourceFile = resolve(rootFolder, inputFile)
    if (!existsSync(sourceFile)) { throw new Error(`Encrypted file(${sourceFile}) not exists.`) }

    const localEnvFile = join(rootFolder, 'local.env')
    const destinationFile = join(rootFolder, '.env')

    if (process?.env?.AGE_PRIVATE_KEY) {
        console.log(`Decrypting ${sourceFile} to ${destinationFile} using AGE_PRIVATE_KEY`)
        execSync(`sops --decrypt ${sourceFile} > ${destinationFile}`)
    } else {
        console.log(`Decrypting ${sourceFile} to ${destinationFile} using SOPS_AGE_KEY_FILE`)
        execSync(`sops --decrypt --age $(cat ${SOPS_AGE_KEY_FILE} | grep -oEi "public key: (.*)" | grep -oEi "\\b(\\w+)$") ${sourceFile} > ${destinationFile}`)
    }

    if (existsSync(localEnvFile)) {
        console.log(`Loading ${localEnvFile}`)
        dotEnv({ path: localEnvFile })
    }

    dotEnv({ path: destinationFile })
}


