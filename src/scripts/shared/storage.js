const DEFAULTS = {
  fontFamily: 'Calibri',
  fontSize: '11pt',
  decoration: 'none'
}

class Storage {

  constructor() { // Set Defaults
    this.getCustomFontFamily()
    .then(fontFamily => fontFamily ? null : this.setCustomFontFamily(DEFAULTS.fontFamily));

    this.getCustomFontSize()
    .then(fontSize => fontSize ? null : this.setCustomFontSize(DEFAULTS.fontSize));

    this.getCustomFontSize()
    .then(fontSize => fontSize ? null : this.setCustomFontSize(DEFAULTS.fontSize));
  }

  get(propertyKey) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(propertyKey, o => resolve(o[propertyKey]));
    })
  }

  set(propertyKey, value) {
    let o = {};
    o[propertyKey] = value;
    chrome.storage.local.set(o);
  }

  ////////////////////////////////////////
  // Configuration
  //

  setCustomFontFamily(fontFamily) {
    this.set('FONT_FAMILY', fontFamily);
  }
  getCustomFontFamily() {
    return this.get('FONT_FAMILY');
  }

  setCustomFontSize(fontSize) {
    this.set('FONT_SIZE', fontSize);
  }
  getCustomFontSize() {
    return this.get('FONT_SIZE');
  }

  setDecoration(decoration) {
    this.set('DECORATION', decoration);
  }
  getDecoration() {
    return this.get('DECORATION');
  }
}

const storage = new Storage();