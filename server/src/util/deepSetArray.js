const test = [{ id: 1, groups: [{ id: 1 }, { id: 2, users: [{ id: 8 }] }] }]
const testResult = [{ 'id': 1, 'groups': [{ 'id': 1 }, { 'id': 2, 'users': [{ 'id': 8 }], 'jeff': [{ 'id': 9, 'something': 'else' }] }] }]

function deepSetArray (obj, path, value) {
  let tmp = obj
  let foundIndex = null
  _.each(path, (pathComponent, i) => {
    const [key, search] = pathComponent
    if (key !== '') {
      if (!_.has(tmp, key)) {
        tmp[key] = []
      }
      tmp = tmp[key]
    }
    foundIndex = _.findIndex(tmp, search)
    if (foundIndex === -1) {
      tmp.push(search)
      foundIndex = _.size(tmp) - 1
    }
    tmp = tmp[foundIndex]
  })
  _.assign(tmp, value)
  return obj
}

JSON.stringify(deepSetArray(test, [['', { id: 1 }], ['groups', { id: 2 }], ['jeff', { id: 9 }]], { something: 'else' })) === JSON.stringify(testResult)
