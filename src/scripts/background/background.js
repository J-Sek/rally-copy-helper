chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case 'copy-to-email': {
      chrome.tabs.executeScript(null, { file: 'scripts/copy-to-email.js' });
      break;
    }
    default: {
      console.log('Unrecognized command');
    }
  }
});

let clipboard = new Clipboard();
let format = {};

let isEmpty = (v) => v === 'none';

let updateFormat = () => {
  storage.getCustomFontFamily()
    .then(fontFamily => format.fontFamily = fontFamily || DEFAULTS.fontFamily);
  
  storage.getCustomFontSize()
    .then(fontSize => format.fontSize = fontSize || DEFAULTS.fontSize);

  storage.getDecoration()
    .then(fontSize => format.decoration = decoration || DEFAULTS.decoration);
};

let formatedHTML = ({ Url, Title, Id }) => {
  let fontFamilyParam = isEmpty(format.fontFamily) ? null : `font-family: ${format.fontFamily};`;
  let fontSizeParam = isEmpty(format.fontSize) ? null : `font-size: ${format.fontSize};`;
  let style = `style='${fontFamilyParam} ${fontSizeParam}'`;
  let link = `<a ${style} href='${Url}'>${Id}</a>`;

  switch (format.decoration) {
    case 'italic + quotation marks': return `${link}<span ${style}>: "</span><em ${style}>${Title}</em><span ${style}>"</span>`;
    case 'italic + thin space':      return `${link}<span ${style}>: </span><em ${style}>${Title}</em><span ${style}>&#8202;</span>`;
    case 'italic + comma':           return `${link}<span ${style}>: </span><em ${style}>${Title}</em><span ${style}>,</span>`;
    case 'italic + new line':        return `${link}<span ${style}>: </span><em ${style}>${Title}</em><p></p>`;
    default:                         return `${link}<span ${style}>: ${Title}</span>`;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'copy-to-clipboard': {
      let { Url, Title, Id } = message.data;
      clipboard.copy({
        html: formatedHTML({ Url, Title, Id }),
        text: `${Id}: ${Title}`
      });
      sendResponse({isSuccess: true});
      break;
    }
    case 'options-changed': {
      updateFormat();
      sendResponse();
      break;
    }
    default: {
      console.log(`Unrecognized message type [${message.type}]`);
    }
  }
  return true;
});

updateFormat();