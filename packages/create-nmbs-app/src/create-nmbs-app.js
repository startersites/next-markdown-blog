#!/usr/bin/env node

import path from 'path'

import chalk from 'chalk'
import checkNodeVersion from 'check-node-version'
import execa from 'execa'
import fs from 'fs-extra'
import Listr from 'listr'
import yargs from 'yargs'

import { name, version } from '../package'

const { _: args, 'yarn-install': yarnInstall } = yargs
  .scriptName(name)
  .usage('Usage: $0 <project directory> [option]')
  .example('$0 newapp')
  .option('yarn-install', {
    default: true,
    describe: 'Skip yarn install with --no-yarn-install',
  })
  .version(version)
  .strict().argv

const targetDir = String(args).replace(/,/g, '-')

if (!targetDir) {
  console.error('Please specify the project directory')
  console.log(
    `  ${chalk.cyan('yarn create nmbs-app')} ${chalk.green(
      '<project-directory>'
    )}`
  )
  console.log()
  console.log('For example:')
  console.log(
    `  ${chalk.cyan('yarn create nmbs-app')} ${chalk.green(
      'my-nmbs-app'
    )}`
  )
  process.exit(1)
}

const newAppDir = path.resolve(process.cwd(), targetDir)
const appDirExists = fs.existsSync(newAppDir)
const templateDir = path.resolve(__dirname, '../../')

const createProjectTasks = ({ newAppDir }) => {
  return [
    {
      title: `${appDirExists ? 'Using' : 'Creating'} directory '${newAppDir}'`,
      task: () => {
        if (appDirExists) {
          // make sure that the target directory is empty
          if (fs.readdirSync(newAppDir).length > 0) {
            console.error(`'${newAppDir}' already exists and is not empty.`)
            process.exit(1)
          }
        } else {
          fs.ensureDirSync(path.dirname(newAppDir))
        }
        fs.copySync(templateDir, newAppDir)
        rimraf.sync(`${newAppDir}/packages`)
      },
    },
  ]
}

const installNodeModulesTasks = ({ newAppDir }) => {
  return [
    {
      title: 'Checking node and yarn compatibility',
      task: () => {
        return new Promise((resolve, reject) => {
          const { engines } = require(path.join(newAppDir, 'package.json'))

          checkNodeVersion(engines, (_error, result) => {
            if (result.isSatisfied) {
              return resolve()
            }

            const errors = Object.keys(result.versions).map((name) => {
              const { version, wanted } = result.versions[name]
              return `${name} ${wanted} required, but you have ${version}.`
            })
            return reject(new Error(errors.join('\n')))
          })
        })
      },
    },
    {
      title: "Running 'yarn install'... (This could take a while)",
      skip: () => {
        if (yarnInstall === false) {
          return 'skipped on request'
        }
      },
      task: () => {
        return execa('yarn install', {
          shell: true,
          cwd: newAppDir,
        })
      },
    },
  ]
}

new Listr(
  [
    {
      title: 'Creating NMBS app',
      task: () => new Listr(createProjectTasks({ newAppDir })),
    },
    {
      title: 'Installing packages',
      task: () => new Listr(installNodeModulesTasks({ newAppDir })),
    },
  ],
  { collapse: false, exitOnError: true }
)
  .run()
  .then(() => {
    ;[
      '',
      chalk.green('Thanks for installing the Next Markdown Blog Starter!'),
      '',
      `We've created your app in '${chalk.green(newAppDir)}'`,
      `Enter the directory and run '${chalk.green(
        'yarn dev'
      )}' to start the development environment.`,
      '',
    ].map((item) => console.log(item))
  })
  .catch((e) => {
    console.log()
    console.log(e)
    process.exit(1)
  })
