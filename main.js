var fs = require('fs')
class section {
  /**
   * new a section
   * @param {String} name name of section
   */
  constructor (name) {
    this.name = name
  }
  /**
   * init section with object
   * @param {Object} body
   */
  init (body) {
    if (typeof body === 'object') {
      this.body = body
    } else {
      throw new Error(body + 'is not an object')
    }
  }
  /**
   * modify option of section
   * @param {String} key
   * @param {any} value
   */
  modify (key, value) {
    if (this.body[key]) {
      this.body[key] = value
    } else {
      throw new Error(key + ' not found in ' + this.name)
    }
  }
  /**
   * convert section to string
   */
  toString () {
    var str
    Object.keys(this.body).forEach((key) => {
      str = str + key + ' = ' + this.body[key].toString
    })
    return str
  }
}
// to be continued
class meter extends section {}
class measure extends section {}
class dock extends meter {}
class audioMeasure extends measure {}
class audioMeter extends meter {}

class iniFile {
  /**
   * new a iniFile
   * @param {String} name name of iniFile
   * @param {PathLike} path path of iniFile
   */
  constructor (name, path) {
    this.name = name
    this.path = path
    if (!fs.statSync(path).isFile()) {
      throw new Error(path + 'is not a file')
    }
    this.body = []
  }
  /**
   * add root section to iniFile
   * @param {Object} obj
   */
  setRoot (obj) {
    this.root = obj
  }
  /**
   * add an object of section to iniFile
   * @param {Object} obj
   */
  add (obj) {
    if (obj instanceof section) {
      this.body.puts(obj)
    } else {
      throw new Error('param is not an object of section')
    }
  }
  /**
   * convert iniFile to string
   */
  toString () {
    isInit(this.root)
    isInit(this.body)
    var str = this.root.toString()
    this.body.forEach((keys) => {
      Object.keys(this.body[keys]).forEach((key) => {
        str = str + this.body[keys][key].toString
      })
    })
  }
}

class project {
  /**
   * new a project
   * @param {String} name name of project
   * @param {PathLike} path path of project
   */
  constructor (name, path) {
    this.name = name
    this.path = path
    if (!fs.statSync(this.path).isDirectory()) {
      throw new Error(path + 'is not a directory')
    }
    this.body = []
  }
  /**
   * add an object of iniFile to project
   * @param {Object} obj
   */
  add (obj) {
    if (obj instanceof iniFile) {
      this.body.puts(obj)
    } else {
      throw new Error('param is not an object of iniFile')
    }
  }
  /**
   * save project to disk
   */
  save () {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    this.body.forEach((keys) => {
      if (!fs.existsSync(this.path + '/' + this.body[keys].path)) {
        fs.mkdirSync(this.path + '/' + this.body[keys].path)
      }
      fs.writeFileSync(this.path + '/' + this.body[keys].path, this.body[keys].toString())
    })
  }
}

/**
 * check if it is init
 * @param {Object} obj var to be check
 */
function isInit (obj) {
  if (obj) {
    throw new Error('not found')
  }
}

export {
  meter, measure, iniFile, project, dock, audioMeter, audioMeasure
}
