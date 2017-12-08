// @cliDescription  Generates a saga.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite } = context
  const { camelCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate saga <name>\n`)
    print.info('A name is required.')
    return
  }

  let pathComponents = parameters.first.split('/').map(camelCase)
  let name = pathComponents.pop()
  const relativePath = pathComponents.length ? pathComponents.join('/') + '/' : ''

  const props = { name }
  const jobs = [{
    template: 'saga.ejs',
    target: `src/sagas/${relativePath}${name}.js`
  }]

  await ignite.copyBatch(context, jobs, props)
}
