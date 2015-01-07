
/*
  Password Validator 0.1
  (c) 2007 Steven Levithan <stevenlevithan.com>
  MIT License
*/

/*
var password = "password";
var passed = validatePassword(password, {
  length:   [8, Infinity],
  lower:    1,
  upper:    1,
  numeric:  1,
  special:  1,
  badWords: ["password", "steven", "levithan"],
  badSequenceLength: 4
});
*/
/**
 *  @constructor
 */
var TPasswordValidator = function()
{
  this.options =
  {
    length:   [6, Infinity],
    lower:    0,
    upper:    0,
    numeric:  0,
    special:  0,
    badWords: [],
    custom:   [],
    badSequenceLength: 0
  };
};
TPasswordValidator.prototype =
{
  getConstraints: function()
  {
    var str2 = TSys.translate ( "PasswordConstraintsAre" ) ;
    var str3 = TSys.translate ( "MinimumLength" ) ;
    var str4 = TSys.translate ( "BadWordsAre" ) ;
    var str5 = TSys.translate ( "at_least" ) ;
    var str6 = TSys.translate ( "lower_case_characters" ) ;
    var str7 = TSys.translate ( "upper_case_characters" ) ;
    var str8 = TSys.translate ( "numeric_characters" ) ;
    var str9 = TSys.translate ( "special_characters" ) ;
    var str = str2 + ":<br/><ul>" ;
    if ( this.options["length"][0] ) str += "<li>" + str3 + ": " + this.options["length"][0] + "</li>" ;
    if ( this.options["lower"] ) str += "<li>" + str5 + " " + this.options["lower"] + " " + str6 + ".</li>" ;
    if ( this.options["upper"] ) str += "<li>" + str5 + " " + this.options["upper"] + " " + str7 + ".</li>" ;
    if ( this.options["numeric"] ) str += "<li>" + str5 + " " + this.options["numeric"] + " " + str8 + ".</li>" ;
    if ( this.options["special"] ) str += "<li>" + str5 + " " + this.options["special"] + " " + str9 + ".</li>" ;
    str += "</ul><br/>" ;
    if ( this.options["badWords"].length )
    {
      var a = this.options["badWords"] ;
      str += str4 + ":<ul>" ;
      for ( var i = 0 ; i < a.length ; i++ )
      {
        str += "<li>" + a[i] + "</li>" ;
      }
      str += "</ul>" ;
    }
    return str ;
  },
  addBadWord: function ( word )
  {
    if ( typeof ( this.options["badWords"] ) == 'undefined' )
    {
      this.options["badWords"] = [] ;
    }
    this.options["badWords"].push ( word ) ;
  },
  setOption: function ( name, value )
  {
    if ( typeof ( this.options[name] ) == 'undefined' )
    {
      throw "Password option '" + name + "' not found." ;
    }
    this.options[name] = value ;
  },
  setMinimumLength: function ( minLen )
  {
    if ( isNaN ( minLen ) ) return ;
    this.options["length"][0] = minLen ;
  },
  getMinimumLength: function()
  {
    return this.options["length"][0] ;
  },
  validate: function ( pw )
  {
    return this._validate ( pw, this.options ) ;
  },
  _validate: function (pw, options)
  {
    // default options (allows any password)
    var o = {
      lower:    0,
      upper:    0,
      alpha:    0, /* lower + upper */
      numeric:  0,
      special:  0,
      length:   [0, Infinity],
      custom:   [ /* regexes and/or functions */ ],
      badWords: [],
      badSequenceLength: 0,
      noQwertySequences: false,
      noSequential:      false
    };

    for (var property in options)
      o[property] = options[property];

    var  re = {
        lower:   /[a-z]/g,
        upper:   /[A-Z]/g,
        alpha:   /[A-Z]/gi,
        numeric: /[0-9]/g,
        special: /[\W_]/g
      },
      rule, i;

    // enforce min/max length
    if (pw.length < o.length[0] || pw.length > o.length[1])
      return false;

    // enforce lower/upper/alpha/numeric/special rules
    for (rule in re) {
      if ((pw.match(re[rule]) || []).length < o[rule])
        return false;
    }

    // enforce word ban (case insensitive)
    for (i = 0; i < o.badWords.length; i++) {
      if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
        return false;
    }

    // enforce the no sequential, identical characters rule
    if (o.noSequential && /([\S\s])\1/.test(pw))
      return false;

    // enforce alphanumeric/qwerty sequence ban rules
    if (o.badSequenceLength) {
      var  lower   = "abcdefghijklmnopqrstuvwxyz",
        upper   = lower.toUpperCase(),
        numbers = "0123456789",
        qwerty  = "qwertyuiopasdfghjklzxcvbnm",
        start   = o.badSequenceLength - 1,
        seq     = "_" + pw.slice(0, start);
      for (i = start; i < pw.length; i++) {
        seq = seq.slice(1) + pw.charAt(i);
        if (
          lower.indexOf(seq)   > -1 ||
          upper.indexOf(seq)   > -1 ||
          numbers.indexOf(seq) > -1 ||
          (o.noQwertySequences && qwerty.indexOf(seq) > -1)
        ) {
          return false;
        }
      }
    }

    // enforce custom regex/function rules
    for (i = 0; i < o.custom.length; i++) {
      rule = o.custom[i];
      if (rule instanceof RegExp) {
        if (!rule.test(pw))
          return false;
      } else if (rule instanceof Function) {
        if (!rule(pw))
          return false;
      }
    }
    // great success!
    return true;
  }
};

