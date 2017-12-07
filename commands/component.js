// @cliDescription  Generates a component.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, system } = context
  const { camelCase, pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  let pathComponents = parameters.first.split('/').map(camelCase)
  let name = pascalCase(pathComponents.pop())
  const relativePath = pathComponents.length ? pathComponents.join('/') + '/' : ''

  const props = { name }
  const jobs = [{
    template: 'component.ejs',
    target: `src/components/${relativePath}${name}.js`
  }]

  await ignite.copyBatch(context, jobs, props)

  await system.run(`yarn update-storybook`)
}
