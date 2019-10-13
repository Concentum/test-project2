export default {
  parseTypeInfo (str) {
    let result = {}
    if (str.type === 'link') {
      result.subtype = 'Object'
      result.class = str.target
    } else if (str.type === 'date' || str.type === 'datetime') {
      result.subtype = 'Date'
    } else if (str.type === 'integer') {
      result.subtype = 'Number'
    } else if (str.type === 'string') {
      result.subtype = 'String'
      result.length = Number(str.length || str.max)
    } else if (str.type === 'number') {
      result.subtype = 'Number'
      result.length = Number(str.length || str.max)
      result.precision = 2
    } else if (str.type === 'boolean') {
      result.subtype = 'Boolean'
    } else if (str.type === 'enum') {
      result.subtype = 'Enum'
    }
    return result
  },
  getDefaultColWidth (requisite, colname) {
    switch (requisite.subtype) {
      case 'Number':
        return 100
      case 'String':
        return colname === "code" || colname === "number" ? 100 : 300
      case 'Object':
        return 300
      case 'Date':
        return 160  
      default:
        return 200
    }
  },
  getDefaultColAlign (requisite) {
    if (requisite.subtype === 'String' || requisite.subtype === 'Object') {
      return 'left'
    } else if (requisite.subtype === 'Number') {
      return 'right'
    } else {
      return 'center'
    }
  },
  getBlankObject (requisites) {
    let data = {}
    for (var key in requisites) {
      if (requisites[key].subtype === 'Object') {
        data[key] = {}
      } else if (requisites[key].subtype === 'Number') {
        data[key] = 0
      } else if (requisites[key].subtype === 'String') {
        data[key] = ''
      } else if (requisites[key].subtype === 'Boolean') {
        data[key] = undefined
      } else if (requisites[key].subtype === 'Date') {
        data[key] = new Date().toISOString().split('.')[0].replace('T', ' ')
      }  
    }
    return data
  }
}
