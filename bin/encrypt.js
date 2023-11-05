#!/usr/bin/env node
const SOPS_AGE_KEY_FILE = '~/.sops/baiken-age-key.txt'

const { execSync } = require("child_process")
const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const [, , inputFile] = process.argv

if (!inputFile) { throw new Error('Missing encrypted file.') }

const destinationPath = resolve(process.cwd(), inputFile)
if (!existsSync(destinationPath)) { throw new Error(`Encrypted file(${destinationPath}) not exists.`) }

if (readFileSync(destinationPath,'utf-8').toString().includes('sops_version')) { throw new Error(`Encrypted file(${destinationPath}) already encrypted.`) }

console.log(`
SOPS: encrypt
=============
SOPS_AGE_KEY_FILE: ${SOPS_AGE_KEY_FILE}
destinationPath: ${destinationPath}
`)

execSync(`sops --encrypt --age "age1f6u2zw6323cx3lwtqeeusessqra5wg0curq6lxtqcql9yh0s5sgq2k38m9" -i ${destinationPath}`)

console.log('encrypt', process.argv, destinationPath)