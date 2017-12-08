// @cliDescription  Generates a saga.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem } = context
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

  // Update the index file
  const filename = 'src/sagas/index.js'
  const contents = await filesystem.readAsync(filename, 'utf8');
  const mutatedContents = contents
    .replace(
      /\[((?:\s*?call\(.*\),?)*)\s*\]/gm,
      `[$1, call(${name}Saga)]`
    )
    .replace(
      /(\s*)((?:\s*import .*Saga from "\.\/.*";)+)(\s*)/gm,
      `$1$2\nimport ${name}Saga from "./${name}";$3`
    )
  await filesystem.writeAsync(filename, mutatedContents, { atomic: true })
}
