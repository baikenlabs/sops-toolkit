#!/usr/bin/env node
const SOPS_AGE_KEY_FILE = '~/.sops/baiken-age-key.txt'

const { execSync } = require("child_process")
const { existsSync, readFileSync } = require('fs')
const { resolve, join } = require('path')
const [, , inputFile, outputFolder] = process.argv

if (!inputFile) { throw new Error('Missing encrypted file.') }

const sourceFile = resolve(process.cwd(), inputFile)
if (!existsSync(sourceFile)) { throw new Error(`Encrypted file(${sourceFile}) not exists.`) }

if (!readFileSync(sourceFile, 'utf-8').toString().includes('sops_version')) { throw new Error(`File(${sourceFile}) is not encrypted.`) }

if (!existsSync(outputFolder)) { throw new Error(`Second parameter the output folder(${outputFolder}) was not provided`) }

const destinationFile = join(outputFolder, '.env')
const AGE_PUBLIC_KEY = process?.env?.AGE_PUBLIC_KEY

console.log(`
SOPS: decrypt
=============
AGE_PUBLIC_KEY: ${AGE_PUBLIC_KEY?.length > 0 ? 'yes' : 'no'}
SOPS_AGE_KEY_FILE: ${SOPS_AGE_KEY_FILE}
sourceFile: ${sourceFile}
destinationFile: ${destinationFile}
`)

if (AGE_PUBLIC_KEY?.length > 0) {
    execSync(`sops --decrypt --age ${AGE_PUBLIC_KEY} ${sourceFile} > ${destinationFile}`)
} else {
    execSync(`sops --decrypt --age $(cat ${SOPS_AGE_KEY_FILE} | grep -oEi "public key: (.*)" | grep -oEi "\\b(\\w+)$") ${sourceFile} > ${destinationFile}`)
}


console.log('encrypt', process.argv, sourceFile)