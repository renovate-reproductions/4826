const fs = require('fs')

const encoding = 'utf8'

const nodeVersion = parseInt(process.argv[1])
if (isNaN(nodeVersion)) {
    throw new Error('NodeJs major version should be passed as a script parameter')
}

function readJsonFile(path) {
    const content = fs.readFileSync(path, encoding)
    return JSON.parse(content)
}

function writeJsonFile(path, json) {
    const content = JSON.stringify(json, null, 2).replaceAll(/(\r\n)|(\n\r)|(\r)/g, '\n') + '\n'
    fs.writeFileSync(path, content, encoding)
}

(function() {
    const json = readJsonFile('package.json')

    json.engines = json.engines || {}
    json.engines.node = `>=${nodeVersion}`

    if (json.devDependencies['@types/node'] == null) {
        json.devDependencies['@types/node'] = ''
    }
    ;[
        'dependencies',
        'devDependencies',
    ].forEach(dependenciesKey => {
        const dependencies = json[dependenciesKey]
        if (dependencies == null) return
        Object.entries(dependencies).forEach(([dependency, version]) => {
            if (dependency !== '@types/node') return
            if (version.startsWith(`${nodeVersion}.`)) return
            dependencies[dependency] = `${nodeVersion}.0.0`
        })
    })

    writeJsonFile('package.json')
})()
