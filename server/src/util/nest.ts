const _ = require('lodash')

const ENDING_TOKEN = '$'

function separate (row: any) {
  const ids = []
  const fields = []
  _.each(_.keys(row), key => {
    if (_.endsWith(key, ENDING_TOKEN)) {
      ids.push(key)
    } else {
      fields.push(key)
    }
  })
  return {
    ids,
    fields
  }
}

function getFields (fields: string[], id: string) {
  if (id === ENDING_TOKEN) {
    return _.filter(fields, field => !_.includes(field, '.'))
  }
  const cleanId = id.substring(0,id.length - 1)
  return _.filter(fields, (field => {
    const replaced = _.replace(field, `${cleanId}.`, '')
    if (replaced === field || _.includes(replaced, '.')) {
      return false
    }
    return true
  }))
}

function cleanPath (path: any) {
  return path.substring(0, path.length - 1)
}

function removeObjectPrefixes (obj: any) {
  return _.reduce(obj, (result, value, key) => {
    const split = _.split(key, '.')
    result[_.last(split)] = value
    return result
  }, {})
}

function buildIndexName (row: any, path: any) {
  const name = [ENDING_TOKEN, row[ENDING_TOKEN]]
  _.each(path, (pathPart, index) => {
    if (index === index.length - 1) {
      pathPart = cleanPath(pathPart)
    }
    name.push(pathPart)
    const idValue = row[`${_.join(path.slice(0, index + 1), '.')}$`]
    name.push(idValue)
  })
  return _.join(name, '-')
}

export function nest (rows: any) {
  // Separate automatically imputed id columns and fields to
  // be nested in objects
  const { ids, fields } = separate(rows[0])

  // This is the mapping of ids to the fields associated with
  // each level of nesting. We're using this to avoid having
  // to post-process data and remove the automatically imputed
  // id colums
  const idToFieldMap = _.reduce(ids, (result, id) => {
    if (id === '$') {
      result[id] = getFields(fields, id)
    }
    result[cleanPath(id)] = getFields(fields, id)
    return result
  }, {})

  // The data structure that will eventually be returned
  const data = []

  // Keeping the array locations for nested fields
  const dataIndex = {}

  _.each(rows, row => {
    _.each(ids, levelId => {
      const levelIdValue = row[levelId]
      if (levelId !== ENDING_TOKEN) {
        levelId = levelId.slice(0, levelId.length - 1)
      }
      const path = _.split(levelId, '.')
      let arrayIndex = null

      if (levelId === ENDING_TOKEN) {
        arrayIndex = _.get(dataIndex, `${levelId}-${levelIdValue}`, null)
        if (arrayIndex === null) {
          data.push(_.pick(row, idToFieldMap[levelId]))
          _.set(
            dataIndex,
            `${levelId}-${levelIdValue}`,
            data.length - 1
          )
        }
        return
      }

      const initialRowIndex = _.get(dataIndex, `${ENDING_TOKEN}-${row['$']}`, null)
      let current = data

      current = data[initialRowIndex]
      _.each(_.range(0, path.length), index => {
        const partialPath = path.slice(0, 1 + index)
        const currentNestName = _.last(partialPath)
        const indexName = buildIndexName(row, partialPath)
        arrayIndex = _.get(dataIndex, indexName, null)
        if (arrayIndex === null) {
          if (!_.has(current, currentNestName)) {
            current[currentNestName] = []
          }
          current[currentNestName].push(
            removeObjectPrefixes(
              _.pick(row, idToFieldMap[levelId])
            )
          )
          arrayIndex = current[currentNestName].length - 1
          _.set(
            dataIndex,
            indexName,
            arrayIndex
          )
        }
        current = current[currentNestName][arrayIndex]
      })
    })
  })

  return data
}
