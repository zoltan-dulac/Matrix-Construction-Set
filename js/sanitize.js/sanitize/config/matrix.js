if(!Sanitize.Config) {
  Sanitize.Config = {}
}

Sanitize.Config.MATRIX = {
    
 /* These are the allowed tags */
 elements: [
    'a', 'b', 'blockquote', 'br', 'caption', 'cite', 'code', 'col',
    'colgroup', 'dd', 'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'i', 'img', 'li', 'ol', 'p', 'pre', 'q', 'small', 'strike', 'strong',
    'sub', 'sup', 'span', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u',
    'ul'
    
    ],

   /* These are the attributes allowed. */
   attributes: {
     'a'         : ['href'],
     'blockquote': ['cite'],
     'q'         : ['cite'],
     'img'       : ['src', 'width', 'height'],
     'svg'       : ['xmlns', 'xmlns:xlink',  'viewBox'],
     'path'      : ['d'],
     'textpath'  : ['xlink:href'],
     'tspan'     : ['dy'],
     '__ALL__': ['class', 'id'],
   },

   /* Links will add a 'nofollow' attribute to prevent SPAMMING */
   add_attributes: {
     'a': {'rel': 'nofollow'}
   },

   /* We restrict the protocols that can be used inside of URLs */
   protocols: {
    'a'         : {'href': ['ftp', 'http', 'https', 'mailto',
                                Sanitize.RELATIVE]},
    'blockquote': {'cite': ['http', 'https', Sanitize.RELATIVE]},
    'img'       : {'src' : ['http', 'https', Sanitize.RELATIVE]},
    'q'         : {'cite': ['http', 'https', Sanitize.RELATIVE]}
  }
};
