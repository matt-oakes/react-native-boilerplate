const { merge, pipe, assoc, omit, __ } = require('ramda')
const { getReactNativeVersion } = require('./lib/react-native-version')
const AndroidSigning = require('./lib/android-signing')

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context.
 */
async function install (context) {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    prompt,
    template
  } = context
  const { colors } = print
  const { red, yellow, bold, gray } = colors

  const { androidPassphrase } = await prompt.ask({ type: 'password', name: 'androidPassphrase', message: 'What is the Android signing passphrase you want to use (min 6 characters)?' })
  const { bundleId, displayName } = await prompt.ask([
    { type: 'input', name: 'bundleId', message: 'What bundle identifier do you want to use (eg. net.mattoakes.app.example)?' },
    { type: 'input', name: 'displayName', message: 'What is the apps display name (eg. Example App)?' }
  ])

  const perfStart = (new Date()).getTime()

  const name = parameters.third
  let spinner = print
    .spin(`using Matt Oakes' React Native boilerplate`)
    .succeed()

  // attempt to install React Native or die trying
  const rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(context)
  })
  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the App.js and __tests__ directory that comes with React Native
  filesystem.remove('App.js')
  filesystem.remove('__tests__')

  // copy our App & Tests directories
  spinner = print.spin('copying files')
  filesystem.copy(`${__dirname}/boilerplate/.vscode`, `${process.cwd()}/.vscode`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/flow-typed`, `${process.cwd()}/flow-typed`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/scripts`, `${process.cwd()}/scripts`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/src`, `${process.cwd()}/src`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/storybook`, `${process.cwd()}/storybook`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  spinner.succeed()

  // generate some templates
  spinner = print.spin('generating files')
  const templates = [
    { template: 'index.js.ejs', target: 'index.js' },
    { template: 'ignite.json.ejs', target: 'ignite/ignite.json' },
    { template: 'README.md.ejs', target: 'README.md' },
    { template: 'gitignore', target: '.gitignore' },
    { template: '.babelrc', target: '.babelrc' },
    { template: '.eslintrc', target: '.eslintrc' },
    { template: 'Gemfile', target: 'Gemfile' },
    { template: 'jest-setup.js', target: 'jest-setup.js' },
    { template: '.flowconfig', target: '.flowconfig' },
    { template: 'rn-cli.config.js', target: 'rn-cli.config.js' },
    { template: 'scripts/internal-release.py.ejs', target: 'scripts/internal-release.py' },
    { template: 'scripts/set-version.py.ejs', target: 'scripts/set-version.py' },
    { template: 'storybook/storybook.js.ejs', target: 'storybook/storybook.js' }
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version
  }
  await ignite.copyBatch(context, templates, templateProps, {
    quiet: !parameters.options.debug,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })
  await system.run("chmod +x scripts/internal-release.py");
  await system.run("chmod +x scripts/set-version.py");
  spinner.succeed()

  /**
   * Merge the package.json from our template into the one provided from react-native init.
   */
  spinner = print.spin('merging package.json')
  async function mergePackageJsons () {
    // transform our package.json in case we need to replace variables
    const rawJson = await template.generate({
      directory: `${ignite.ignitePluginPath()}/boilerplate`,
      template: 'package.json.ejs',
      props: templateProps
    })
    const newPackageJson = JSON.parse(rawJson)

    // read in the react-native created package.json
    const currentPackage = filesystem.read('package.json', 'json')

    // deep merge, lol
    const newPackage = pipe(
      assoc(
        'dependencies',
        merge(currentPackage.dependencies, newPackageJson.dependencies)
      ),
      assoc(
        'devDependencies',
        merge(currentPackage.devDependencies, newPackageJson.devDependencies)
      ),
      assoc('scripts', merge(currentPackage.scripts, newPackageJson.scripts)),
      merge(
        __,
        omit(['dependencies', 'devDependencies', 'scripts'], newPackageJson)
      )
    )(currentPackage)

    // write this out
    filesystem.write('package.json', newPackage, { jsonIndent: 2 })
  }
  await mergePackageJsons()
  spinner.succeed()
  
  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    // pass along the debug flag if we're running in that mode
    const debugFlag = parameters.options.debug ? '--debug' : ''
    const boilerplate = parameters.options.b || parameters.options.boilerplate || 'ignite-matt-oakes-react-native-boilerplate'
    
    await system.spawn(`ignite add ${boilerplate} ${debugFlag}`, { stdio: 'inherit' })
  } catch (e) {
    ignite.log(e)
    throw e
  }
  
  spinner = print.spin('enabling postinstall')
  await system.run('sed -i "" "s/disabled-postinstall/postinstall/g" package.json')
  spinner.succeed()

  spinner = print.spin('running yarn install')
  await system.run('yarn install')
  spinner.succeed()

  // react native link -- must use spawn & stdio: ignore or it hangs!! :(
  spinner = print.spin(`linking native libraries`)
  await system.spawn('react-native link', { stdio: 'ignore' })
  spinner.succeed()

  // Setup Android signing
  spinner = print.spin('setting up Android signing')
  const currentGradleContent = await filesystem.read(AndroidSigning.buildGradlePath)
  const newGradleContent = currentGradleContent.replace(AndroidSigning.searchConfig, AndroidSigning.replacementConfig)
  await filesystem.write(AndroidSigning.buildGradlePath, newGradleContent)
  await filesystem.dir(AndroidSigning.keystorePath, { empty: true })
  await system.run(AndroidSigning.generateKeystoreCommand('debug', 'android', 'android'))
  await system.run(AndroidSigning.generateKeystoreCommand('release', 'release', androidPassphrase))
  spinner.succeed()

  // Set the bundle id and app name correctly
  spinner = print.spin('setting the bundle id and display name')
  await system.run(`yarn update:bundle-id "${bundleId}" "${displayName}"`)
  spinner.succeed()

  spinner = print.spin('setting the initial version number to 0.1.0')
  await system.run(`yarn update:version 0 1 0`)
  spinner.succeed()

  spinner = print.spin(`running tests`)
  await system.run('yarn test')
  spinner.succeed()

  // git configuration
  const gitExists = await filesystem.exists('./.git')
  if (!gitExists) {
    // Install git
    spinner = print.spin('configuring git')
    await system.run(`git init`)
    await system.run(`git add -A`)
    await system.run(`git commit -m "Initial commit"`)
    spinner.succeed()
  }

  const perfDuration = parseInt(((new Date()).getTime() - perfStart) / 10) / 100
  print.info(`ignited ${yellow(name)} in ${perfDuration}s`)

  print.info(`
    ${red('Ignite CLI')} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    Next steps:

      ☐ Setup git remotes
      ☐ Setup Fastlane and Match for iOS
      ☐ Setup Fastlane for Android
      ☐ ${bold('Get coding!')}
  `)
}

module.exports = {
  install
}
