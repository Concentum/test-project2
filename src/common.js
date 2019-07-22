export default {
  parseTypeInfo (str) {
    let result = {}
    if (str.substr(0, 11) === 'references.') {
      result.subtype = 'Object'
      result.class = str.split('.')[1]
    } else if (str === 'timestamp' || str === 'datetime') {
      result.subtype = 'Date'
    } else if (str === 'integer' || str === 'smallint') {
      result.subtype = 'Number'
    } else if (str === 'text') {
      result.subtype = 'String'
    } else if (str.substr(0, 8) === 'varchar(') {
      result.subtype = 'String'
      result.length = Number(str.replace('varchar(', '').replace(')', ''))
    } else if (str.substr(0, 8) === 'numeric(') {
      let tmp = str.replace('numeric(', '').replace(')', '').split(',')
      result.subtype = 'Number'
      result.length = Number(tmp[0])
      result.precision = Number(tmp[1])
    }
    return result
  },
  getDefaultColWidth (requisite) {
    switch (requisite.subtype) {
      case 'Number': 
        return 100
      case 'String':
        return 300
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
      }  
    }
    return data
  }
}
