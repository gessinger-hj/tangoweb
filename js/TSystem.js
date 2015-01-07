Tango.include ( "TComponents" ) ;
Tango.include ( "Calypso" ) ;
Tango.include ( "TPasswordValidator" ) ;
Tango.include ( "TXml" ) ;
Tango.include ( "TUtil" ) ;
Tango.include ( "Geometry" ) ;
/**
 *  Global singleton <b>TSys</b>
 *  @constructor
 */
var x = null ;
var TSysClass = function()
{
  var i;

  this.IE    = false;
  this.NS    = false;
  this.OP    = false;
  this.MDA   = false;
  this.PPC   = false;
  this.createLOG = false;
  this.DEBUG = false;
  this.showNativeErrors = false;
  this.defaultGlobalErrorText = "Dieser Dienst steht leider zur Zeit\n nicht zur Verf?gung." ;
  this.theLoggingWindow = null ;
  this.theLoggingTextArea = null ;
  this.applicationName = "" ;
  this.webConfig = null ;
  this.locale = null ;
  this.localizedMessages = null ; //[] ;
  this.defaultLocalizedMessages = new Array() ;
  this.finished = false ;

  var lmDE = new Array() ;
  var lmEN = new Array() ;
  var lmFR = new Array() ;
  this.defaultLocalizedMessages["de"] = lmDE ;
  this.defaultLocalizedMessages["en"] = lmEN ;
  this.defaultLocalizedMessages["fr"] = lmFR ;

  lmDE["Cancel"] = "Abbrechen" ;
  lmDE["Close"] = "Schlie\u00DFen" ;
  lmDE["Apply"] = "Anwenden" ;
  lmDE["Open"] = "\u00D6ffnen" ;
  lmDE["Ok"] = "Ok" ;
  lmDE["Yes"] = "Ja" ;
  lmDE["No"] = "Nein" ;
  lmDE["Error"] = "Fehler" ;
  lmDE["Warning"] = "Warnung" ;
  lmDE["Information"] = "Information" ;
  lmDE["Question"] = "Frage" ;
  lmDE["InvalidCredentials"] = "Die Kombination Benutzerkennung/Passwort ist falsch." ;
  lmDE["WindowClose"] = "Fenster schlie\u00DFen." ;
  lmDE["PasswordConstraintsAre"] = "Passwortbedingungen sind" ;
  lmDE["MinimumLength"] = "Mindestl\u00E4nge" ;
  lmDE["BadWordsAre"] = "Ung\u00FCltige Passw\u00F6rter sind" ;
  lmDE["at_least"] = "mindestens" ;
  lmDE["lower_case_characters"] = "Kleinbuchstabe(n)" ;
  lmDE["upper_case_characters"] = "Gro\u00DFbuchstabe(n)" ;
  lmDE["numeric_characters"] = "Ziffer(n)" ;
  lmDE["special_characters"] = "Sonderzeiche(n)" ;
  lmDE["Upload"] = "Importieren" ;
  lmDE["Retry"] = "Wiederholen" ;
  lmDE["PleaseSelectAFileAndPressUpload"] = "Bitte w\u00E4hlen Sie eine Datei aus<br/> und klicken Sie dann auf <b>Importieren</b>" ;
  lmDE["FileUpload"] = "Datei importieren..." ;
  lmDE["TheFileHasBeenUploadedSucessfully"] = "Die Datei <b>{FILE}</b> wurde erfolgreich importiert." ;
  lmDE["TheFileCouldNotBeUploaded"] = "Die Datei {FILE} konnte nicht importiert werden." ;
  lmDE["ThisServiceIsCurrentlyNotAvailable"] = "Dieser Dienst ist leider zur Zeit nicht erreichbar." ;
  lmDE["SessionEndedLoginAgain"] = "Die Sitzung wurde beendet.<br/>Sie k&ouml;nnen sich wieder anmelden." ;
  lmDE["AlreadyExistsArg0"] = "'$0' ist schon vorhanden." ;
  lmDE["AMomentPlease"] = "Bitte warten Sie einen Moment..." ;
  lmDE["WindowMinMax"] = "Fenster maximieren<br/>wiederherstellen." ;
  lmDE["WindowDataAreChangedDiscard"] = "Einige Daten wurden ver&auml;ndert.<br/>Verwerfen?" ;
  lmDE["AreYouSureToDeleteSelectedItem"] = "Wollen Sie wirklich<br/>den markierten Eintrag l\u00F6schen?" ;

  lmEN["Cancel"] = "Cancel" ;
  lmEN["Close"] = "Close" ;
  lmEN["Apply"] = "Apply" ;
  lmEN["Open"] = "Open" ;
  lmEN["Ok"] = "Ok" ;
  lmEN["Yes"] = "Yes" ;
  lmEN["No"] = "No" ;
  lmEN["Error"] = "Error" ;
  lmEN["Warning"] = "Warning" ;
  lmEN["Information"] = "Information" ;
  lmEN["Question"] = "Question" ;
  lmEN["InvalidCredentials"] = "Invalid credentials." ;
  lmEN["WindowClose"] = "Close Window." ;
  lmEN["PasswordConstraintsAre"] = "Password constraints are" ;
  lmEN["MinimumLength"] = "Minimum length" ;
  lmEN["BadWordsAre"] = "Bad words are" ;
  lmEN["at_least"] = "at least" ;
  lmEN["lower_case_characters"] = "lower case character(s)" ;
  lmEN["upper_case_characters"] = "upper case character(s)" ;
  lmEN["numeric_characters"] = "numeric character(s)" ;
  lmEN["special_characters"] = "special character(s)" ;
  lmEN["Upload"] = "Upload" ;
  lmEN["Retry"] = "Retry" ;
  lmEN["PleaseSelectAFileAndPressUpload"] = "Please select a file and press <b>Upload</b>" ;
  lmEN["FileUpload"] = "Upload a file..." ;
  lmEN["TheFileHasBeenUploadedSucessfully"] = "The file <b>{FILE}</b> has been uploaded successfully." ;
  lmEN["TheFileCouldNotBeUploaded"] = "The file {FILE} could not be uploaded." ;
  lmEN["ThisServiceIsCurrentlyNotAvailable"] = "The service you requested is currently not available." ;
  lmEN["SessionEndedLoginAgain"] = "The Session has been terminated.<br/>Please login again." ;
  lmEN["AlreadyExistsArg0"] = "'$0' already exists." ;
  lmEN["AMomentPlease"] = "A moment please..." ;
  lmEN["WindowMinMax"] = "Maximize / Restore Window." ;
  lmEN["WindowDataAreChangedDiscard"] = "Data are changed. Discard anyway?" ;
  lmEN["AreYouSureToDeleteSelectedItem"] = "Are you sure to delete<br/>the selected item?" ;

  lmFR["Cancel"] = "Annuler" ;
  lmFR["Yes"] = "oui" ;
  lmFR["No"] = "non" ;

  this.counter = new Date().getTime() ;

  this.userLanguage = "de" ;

  this.mimeTypeTextFileExtensions = [ ".js" , ".java" , ".c" , ".cpp" , ".properties"
                                    , ".log" , ".log_1" , ".log_2" , ".log_3" , ".log_4" , ".dtd" , ".sh"
                                    , ".axl" , ".ini"
                                    ] ;

  this.user = null ;
  this.browserChecked = false ;
  this._logoutListener = [] ;
  this._unloadListener = [] ;
  this._loginListener = [] ;
  this.logInternal = true ;
  this._useAxlCache = false ;
  this._nameToAxl = [] ;
  this._minPageWidth = 0 ;
  this._minPageHeight = 0 ;
  this._minPageWidthMobile = 0 ;
  this._minPageHeightMobile = 0 ;
  this._fminPageWidthMobile = undefined ;
  this._fminPageHeightMobile = undefined ;

  if ( Tango.ua.ie )
	{
  	window.onerror = function(message, url, linenumber)
  	{
			if ( url.lastIndexOf ( "/" ) > 0 )
			{
				url = url.substring ( url.lastIndexOf ( "/" ) + 1 ) ;
			}
			if ( url.indexOf ( "?" ) > 0 )
			{
				url = url.substring ( 0, url.indexOf ( "?" ) ) ;
			}
    	var log = message + " at line " + linenumber + " in " + url ;
    	this.log ( log ) ;
    	return true;
  	};
	}
};
TSysClass.prototype =
{
  uid: "guest",
  pwd: "guest",
  applicationName: "NoName",
  passwordValidator: null,
  getPasswordValidator: function()
  {
    if ( ! this.passwordValidator ) this.passwordValidator = new TPasswordValidator() ;
    return this.passwordValidator ;
  },
  getPasswordValidatorText: function()
  {
    if ( ! this.passwordValidator ) this.passwordValidator = new TPasswordValidator() ;
    return this.passwordValidator.getConstraints() ;
  },
  setPasswordValidator: function ( passwordValidator )
  {
    if ( passwordValidator ) this.passwordValidator = passwordValidator ;
  },
  nop: function()
  {
  },
  toFunction: function ( functionString )
  {
    if ( typeof ( functionString ) == 'function' ) return functionString ;
    if ( typeof ( functionString ) != 'string' ) return null ;
    var pos = functionString.indexOf ( "(" ) ;
    if ( pos > 0 ) functionString = functionString.substring ( 0, pos ) ;
    functionString = functionString.trim() ;
    var func = eval ( functionString ) ;
    if ( typeof ( func ) == 'function' ) return func ;
    return null ;
  },
  alert: function ( exc )
  {
    if ( this.showNativeErrors ) alert ( exc ) ;
    else                         alert ( this.defaultGlobalErrorText ) ;
  },
  alertDefault: function()
  {
    alert ( this.defaultGlobalErrorText ) ;
  },
  getTempId: function()
  {
    this.counter++ ;
    return "O" + this.counter ;
  },
  getCounter: function()
  {
    this.counter++ ;
    return this.counter ;
  },
  setUserLanguage: function ( lang )
  {
    if ( ! lang ) lang = "de" ;
    else
    if ( lang.length > 2 )
    {
      lang = lang.substring ( 0, 2 ) ;
    }
    this.userLanguage = lang ;
  },
  getUserLanguage: function()
  {
    return this.userLanguage ;
  },
  setApplicationName: function ( name )
  {
    this.applicationName = name ? name : "" ;
  },
  getApplicationName: function()
  {
    return this.applicationName ;
  },
  getBodyXml: function()
  {
    var b = document.getElementsByTagName ( "body" )[0] ;
    return new TXml ( b ) ;
  },
  getXmlByName: function ( name )
  {
    var b = this.getBodyXml() ;
    return b.getXmlByName ( name ) ;
  },
  getXmlById: function ( id )
  {
    var b = document.getElementById ( id ) ;
    if ( !b ) return null ;
    return new TXml ( b ) ;
  },
  getHttpRequestObject: function()
  {
    return Tango.getHttpRequestObject() ;
  },
  parseXml: function ( xmlString, callback )
  {
    return new TXml ( this.parseDom ( xmlString, callback ) ) ;
  },
  parseDom: function ( xmlString, callback )
  {
    if ( ! xmlString ) xmlString = "<xml></xml>" ;
    var domDoc = null ;

    if (typeof window.ActiveXObject != 'undefined' )
    {
      try
      {
        domDoc = new ActiveXObject("Microsoft.XMLDOM");
        domDoc.async="false";
        domDoc.loadXML(xmlString);
      }
      catch ( e )
      {
        domDoc = new ActiveXObject("Msxml2.XMLDOM");
        domDoc.async="false";
        domDoc.loadXML(xmlString);
      }
    }
    else
    if ( document.implementation.createDocument )
    {
      var parser = new DOMParser();
      domDoc = parser.parseFromString(xmlString, "text/xml");
    }
    if ( ! domDoc )
    {
      TSys.log ( "Parser error in:\n" + xmlString ) ;
      this.evaluateXmlParsing ( xmlString, false, true );
      throw "XML Parser error" ;
    }
    else
    {
      var x = new TXml ( domDoc ) ;
      if ( x.domRoot.nodeType == DOM_DOCUMENT_NODE )
      {
        x = new TXml() ;
        x.add ( "parsererror" ) ;
        if ( callback )
        {
          callback ( x, xmlString ) ;
        }
	else
        {
          TSys.log ( "Parser error in:\n" + xmlString + "\n" + x ) ;
          this.evaluateXmlParsing ( xmlString, false, true );
          throw "XML Parser error" ;
        }
      }
      else
      if ( x.domRoot.nodeName == 'parsererror' )
      {
        if ( callback )
        {
          callback ( x, xmlString ) ;
        }
	else
        {
          TSys.log ( "Parser error in:\n" + xmlString + "\n" + x ) ;
          this.evaluateXmlParsing ( xmlString, false, true );
          throw "XML Parser error" ;
        }
      }
      else
      if ( x.domRoot.nodeName == 'xml' )
      {
        if ( x.domRoot.firstChild && x.domRoot.firstChild.nodeName == 'parsererror' )
        {
          if ( callback )
          {
            callback ( x, xmlString ) ;
          }
	  else
          {
            TSys.log ( "Parser error in:\n" + xmlString + "\n" + x ) ;
            this.evaluateXmlParsing ( xmlString, false, true );
            throw "XML Parser error" ;
          }
        }
      }
    }
    return domDoc ;
  },
  dataFactoryServletName: "DataFactory",
  mainServletName: "Tango",
  imageFactoryServletName: "ImageFactory",
  setTheme: function ( themeName, callback )
  {
    try
    {
      Tango.loadTheme ( themeName, callback ) ;
    }
    catch ( exc )
    {
      this.log ( "" + exc ) ;
    }
  },
  setDefaultTheme: function()
  {
    if ( ! Tango.isThemeCssLoaded() )
    {
      var wc = TSys.getWebConfig() ;
      var dtn = Tango.getThemeName() ;
      if ( dtn == 'default' ) dtn = wc.getDefaultThemeName() ;
      TSys.setTheme ( dtn ) ;
    }
  },
  getMainServletName: function()
  {
    return this.mainServletName ;
  },
  getDataFactoryServletName: function()
  {
    return this.dataFactoryServletName ;
  },
  getImageFactoryServletName: function()
  {
    return this.imageFactoryServletName ;
  },
  getDataFactoryUrl: function()
  {
    return this.getDataFactoryServletName()+"?application="+this.getApplicationName()+"&counter="+this.getCounter() ;
  },
  getMainUrl: function()
  {
    return this.getMainServletName()+"?application="+this.getApplicationName()+"&counter="+this.getCounter() ;
  },
  throwErrorMessageException: function ( HTTP )
  {
    if ( HTTP.responseText.length == 0 )
    {
      if ( HTTP.statusText && HTTP.statusText.length > 0 )
      {
        throw HTTP.statusText + ": " + HTTP.status ;
      }
      else
      {
        throw "Protocoll error" + HTTP.status ;
      }
    }
    if ( HTTP.responseText.length > 0 )
    {
      if ( HTTP.responseText.indexOf ( "<xml><Error>" ) >= 0 )
      {
        var x = new TXml ( HTTP.responseXML.documentElement ) ;
        var t = x.getContent ( "Error/Message" ) ;
        if ( t )
        {
          throw t ;
        }
      }
    }
  },
  createHttpStatusText: function ( HTTP )
  {
    if ( HTTP.status == 200 ) return null ;
    // if ( ! TSys.createLOG ) return "ThisServiceIsCurrentlyNotAvailable" ;
    var t = TSys.translate ( "ThisServiceIsCurrentlyNotAvailable" ) ;
    if ( HTTP.status == 400 || HTTP.status == 502 )
    {
      if ( HTTP.responseText.length == 0 )
      {
        if ( HTTP.statusText && HTTP.statusText.length > 0 )
        {
          return t + "\n(" + HTTP.statusText + ": " + HTTP.status + ")" ;
        }
        else
        {
          return t + "(Protocoll error: " + HTTP.status + ")" ;
        }
      }
      if ( HTTP.responseText.length > 0 )
      {
        TSys.log ( HTTP.responseText ) ;
        try
        {
          if ( HTTP.responseText.indexOf ( "<Error>" ) >= 0 )
          {
            var x = new TXml ( HTTP.responseXML.documentElement ) ;
            var t = x.getContent ( "Error/Message" ) ;
            if ( t ) return t ;
          }
        }
        catch ( exc )
        {
          TSys.log ( exc ) ;
        }
        return t + "\n(" + HTTP.statusText + ": " + HTTP.status + ")" ;
      }
    }
    return t + "\n(" + HTTP.statusText + ": " + HTTP.status + ")" ;
  },
  createHttpStatusXml: function ( HTTP )
  {
    if ( HTTP.status == 200 ) return ;
    if ( HTTP.responseText.length == 0 ) return ;
    try
    {
      return new TXml ( HTTP.responseXML.documentElement ) ;
    }
    catch ( exc )
    {
      TSys.log ( exc ) ;
    }
  },
  throwHttpStatusException: function ( HTTP )
  {
    if ( HTTP.status == 200 ) return ;
    var t = this.createHttpStatusText ( HTTP ) ;
    if ( t ) throw t ;
  },
  httpGet: function ( url, callback, method )
  {
    return this.httpPost ( url, null, callback, method ) ;
  },
  _httpGetText: function ( url )
  {
    var HTTP = this.getHttpRequestObject() ;
    HTTP.open ( "GET", url, false ) ;
    HTTP.send(null) ;
    return HTTP.responseText ;
  },
  showThrobberTypeWorkingPanel: function ( options )
  {
    // document.body.style.cursor = "wait" ;
    var delay = 0 ;
    var opacity = "" ; //0.3
    var backgroundColor = "" ; //'#FFFFFF'
    if ( TSys.isIE() && Tango.ua.ieVersion <= 9 ) delay = 0 ;
    var txml = Tango.getThemeXml ( "Globals/WorkingPanel" ) ;
    if ( txml )
    {
      var op = txml.getFloatAttribute ( "opacity", -1 ) ;
      if ( op >= 0 ) opacity = op ;
      var bg = txml.getAttribute ( "background-color" ) ;
      if ( bg ) backgroundColor = bg ;
    }
    if ( typeof options === 'object' )
    {
      if ( options.opacity ) opacity = options.opacity ;
      if ( options.delay ) delay = options.delay ;
    }
    return new TWorkingPanel ( { progressBarShowSeconds: true
                                , delay: delay
                                , showProgressBar: false
                                , showIndicator: true
                                , opacity: opacity
                                , backgroundColor:  backgroundColor
                                }
                              ) ;
  },
  executeLater: function ( callback, options )
  {
    var wp = this.showThrobberTypeWorkingPanel ( options ) ;
    var t = new TTimer ( 200, function()
    {
      try
      {
        callback() ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
      }
      wp.close() ;
    });
    t.setRepeats ( false ) ;
    t.start() ;
  },
  executeLaterNoWorkingPanel: function ( callback )
  {
    var t = new TTimer ( 200, function()
    {
      try
      {
        callback() ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
      }
    });
    t.setRepeats ( false ) ;
    t.start() ;
  },
  httpPost: function ( url, parameter, callback, method )
  {
    if ( !url )
    {
      throw "TSys.httpPost: url is null" ;
    }
    var HTTP = this.getHttpRequestObject() ;
    var async = false ;
    if (  typeof ( callback ) == 'function'
       || ( callback && method && typeof ( callback ) == 'object' && typeof ( method ) == 'function' )
       )
    {
      var p = { aborted: false } ;
      async = true ;
      var wp = null ;
      if ( TSys.isIE() && Tango.ua.ieVersion <= 9 )
      {
        wp = this.showThrobberTypeWorkingPanel() ;
      }
      else
      {
        wp = new TWorkingPanel ( { progressBarShowSeconds: true
                                  , cancel:function(event)
                                    {
                                      p.aborted = true ;
                                      HTTP.abort() ;
                                    }
                                  }
                                ) ;
      }
    }
    if ( typeof ( callback ) == 'function' )
    {
      if ( Tango.isActiveXObject ( HTTP ) )
      {
        HTTP.onreadystatechange = function()
        {
          if ( HTTP.readyState != 4 ) return ;
          if ( p.aborted == true )
          {
            if ( wp ) wp.close() ; wp = null ;
            document.body.style.cursor = "default" ;
            return ;
          }
          try
          {
            callback ( HTTP ) ;
          }
          catch ( exc )
          {
            TSys.log ( exc ) ;
          }
          if ( wp ) wp.close() ; wp = null ;
          document.body.style.cursor = "default" ;
        };
      }
      else
      {
        HTTP.onload = function()
        {
          if ( HTTP.readyState != 4 ) return ;
          if ( p.aborted )
          {
            if ( wp ) wp.close() ; wp = null ;
            document.body.style.cursor = "default" ;
            return ;
          }
          try
          {
            callback ( HTTP ) ;
          }
          catch ( exc )
          {
            TSys.log ( exc ) ;
          }
          if ( wp ) wp.close() ; wp = null ;
          document.body.style.cursor = "default" ;
        };
      }
    }
    else
    if ( callback && method && typeof ( callback ) == 'object' && typeof ( method ) == 'function' )
    {
      if ( Tango.isActiveXObject ( HTTP ) )
      {
        HTTP.onreadystatechange = function()
        {
          if ( HTTP.readyState != 4 ) return ;
          if ( p.aborted )
          {
            if ( wp ) wp.close() ; wp = null ;
            document.body.style.cursor = "default" ;
            return ;
          }
          try
          {
            method.apply ( callback, [ HTTP ] ) ;
          }
          catch ( exc )
          {
            TSys.log ( exc ) ;
          }
          if ( wp ) wp.close() ; wp = null ;
          document.body.style.cursor = "default" ;
        };
      }
      else
      {
        HTTP.onload = function()
        {
          if ( HTTP.readyState != 4 ) return ;
          if ( p.aborted )
          {
            if ( wp ) wp.close() ; wp = null ;
            document.body.style.cursor = "default" ;
            return ;
          }
          try
          {
            method.apply ( callback, [ HTTP ] ) ;
          }
          catch ( exc )
          {
            TSys.log ( exc ) ;
          }
          if ( wp ) wp.close() ; wp = null ;
          document.body.style.cursor = "default" ;
        };
      }
    }
    try
    {
      if ( async ) document.body.style.cursor = "wait" ;
      HTTP.open ( "POST", url, async ) ;
      if ( ! parameter )
      {
        HTTP.send ( "dummy" ) ;
        if ( HTTP.status == 403 )
        {
          if ( this.loggedIn )
          {
            var d = new TUserDialog ( "SessionEndedLoginAgain" ) ;
            d.setUserFunction ( function(){TSys.logout();} ) ;
            d.info() ;
          }
          else
          {
            TSys.logout() ;
          }
        }
      }
      else
      {
        if ( typeof ( parameter ) != 'string' ) parameter = String ( parameter ) ;
        HTTP.send ( parameter ) ;
      }
//      if ( ! async ) document.body.style.cursor = "" ;
    }
    catch ( exc )
    {
      if ( ! async ) document.body.style.cursor = "" ;
    }
    return HTTP ;
  },
  httpPostSimpleAsync: function ( url, parameter, callback )
  {
    if ( !url )
    {
      throw "TSys.httpPost: url is null" ;
    }
    var HTTP = this.getHttpRequestObject() ;

    if ( Tango.isActiveXObject ( HTTP ) )
    {
      HTTP.onreadystatechange = function()
      {
        if ( HTTP.readyState != 4 ) return ;
        try
        {
          callback ( HTTP ) ;
        }
        catch ( exc )
        {
          TSys.log ( exc ) ;
        }
      };
    }
    else
    {
      HTTP.onload = function()
      {
        if ( HTTP.readyState != 4 ) return ;
        try
        {
          callback ( HTTP ) ;
        }
        catch ( exc )
        {
          TSys.log ( exc ) ;
        }
      };
    }

    try
    {
      HTTP.open ( "POST", url, true ) ;
      if ( ! parameter )
      {
        HTTP.send ( "dummy" ) ;
        if ( HTTP.status == 403 )
        {
          if ( this.loggedIn )
          {
            var d = new TUserDialog ( "SessionEndedLoginAgain" ) ;
            d.setUserFunction ( function(){TSys.logout();} ) ;
            d.info() ;
          }
          else
          {
            TSys.logout() ;
          }
        }
      }
      else
      {
        if ( typeof ( parameter ) != 'string' ) parameter = String ( parameter ) ;
        HTTP.send ( parameter ) ;
      }
    }
    catch ( exc )
    {
    }
  },
  getStartAxl: function ( axlName )
  {
    if ( ! axlName )
    {
      var wc = this.getWebConfig() ;
      axlName = wc.getStartAxl() ;
      if ( ! axlName ) axlName = this.getApplicationName() ;
    }
    var url = this.getMainUrl()+"&action=GetAxl&axl=" + axlName ;
    return this.getXml ( url ) ;
  },
  getAxlFromCache: function ( name )
  {
    if ( ! this._useAxlCache ) return null ;
    return this._nameToAxl[name] ;
  },
  putAxlToCache: function ( name, axl )
  {
    if ( ! this._useAxlCache ) return ;
    if ( ! axl ) return ;
    this._nameToAxl[name] = axl ;
  },
  getAxl: function ( axlName, attributes, callback, method )
  {
    if ( ! axlName )
    {
      var wc = this.getWebConfig() ;
      axlName = wc.getStartAxl() ;
      if ( ! axlName ) axlName = this.getApplicationName() ;
      if ( ! axlName ) return ;
    }
    var url = this.getDataFactoryUrl()+"&action=GetAxl&axl=" + axlName ;
    if ( attributes )
    {
      if ( TSys.isArray ( attributes ) || typeof ( attributes ) == 'object' )
      {
        for ( var key in attributes )
        {
          var v = attributes[key] ;
          if ( typeof ( v ) != 'string' && typeof ( v ) != 'boolean' && typeof ( v ) != 'number' ) continue ;
          v = encodeURIComponent ( v ) ;
          url += "&" + key + "=" + encodeURIComponent ( "" + attributes[key] ) ;
        }
      }
    }
    if ( callback || method )
    {
      this.httpPostSimpleAsync ( url, null, callback, method ) ;
    }
    else
    {
      var HTTP = TSys.httpPost ( url, null, callback, method ) ;
      if ( HTTP.status != 200 )
      {
        if ( HTTP.status != 412 )
          TSys.throwHttpStatusException ( HTTP ) ;
      }
      return HTTP.responseXML.documentElement ;
    }
  },
  getAxlText: function ( axlName, attributes )
  {
    var url = this.getDataFactoryUrl()+"&action=GetAxl&axl=" + axlName ;
    if ( TSys.isArray ( attributes ) )
    {
      for ( var key in attributes )
      {
        var v = attributes[key] ;
	if ( typeof ( v ) != 'string' && typeof ( v ) != 'boolean' && typeof ( v ) != 'number' ) continue ;
        v = encodeURIComponent ( v ) ;
        url += "&" + key + "=" + encodeURIComponent ( attributes[key] ) ;
      }
    }
    return this.getText ( url ) ;
  },
  getPrivateXml: function ( fileName, callback, method )
  {
    var url = this.getDataFactoryUrl() + "&action=GetPrivateXml&fileName=" + fileName ;
    var HTTP = TSys.httpGet ( url, callback, method ) ;
    if ( ! callback && ! method )
    {
      if ( HTTP.status != 200 )
      {
        TSys.throwHttpStatusException ( HTTP ) ;
      }
      return new TXml ( HTTP.responseXML.documentElement ) ;
    }
    return HTTP ;
  },
  getXml: function ( url, callback, method )
  {
    var HTTP = TSys.httpPost ( url, null, callback, method ) ;
    if ( ! callback && ! method )
    {
      if ( HTTP.status != 200 )
      {
        if ( HTTP.status != 412 )
          TSys.throwHttpStatusException ( HTTP ) ;
      }
      return HTTP.responseXML.documentElement ;
    }
  },
  getText: function ( url )
  {
    var HTTP = TSys.httpGet ( url ) ;
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    return HTTP.responseText ;
  },
  MIME_TYPE_MS_EXCEL: "application/x-msexcel",
  MIME_TYPE_HTML: "text/html",
  MIME_TYPE_ZIP: "application/zip",
  downloadDocument: function ( url, mimeType )
  {
    var nuUrl = url ;
    if ( typeof ( url ) == 'string' )
    {
      location.href  = url ;
    }
  },
  showHtmlDocument: function ( msg, elementId )
  {
    var thiz = this ;
    var e = document.getElementById ( elementId ) ;
    if ( ! e )
    {
      throw "Element not found, id='" + elementId + "'" ;
    }
    if ( ! msg || msg.jsClassName != "CoMessage" )
    {
      throw "Missing or invalid message" ;
    }
    msg.setReturnFromArgsMimeType ( "text/html" ) ;
    var url = Calypso.getUrl() ;
    var wp = new TWorkingPanel() ;
    TSys.httpPost ( url, msg, function ( HTTP )
    {
      if ( HTTP.readyState != 4 ) return ;
      if ( wp ) wp.close() ; wp = null ;
      thiz.showHtmlDocumentCallback ( HTTP, elementId ) ;
    } ) ;
  },
  showHtmlDocumentCallback: function  ( HTTP, elementId )
  {
    try
    {
      if ( HTTP.status != 200 )
      {
        var t = TSys.createHttpStatusText ( HTTP ) ;
        if ( t )
        {
          var dUserDialog = new TUserDialog ( t ) ;
          dUserDialog.error() ;
        }
        return ;
      }
      var e = document.getElementById ( elementId ) ;
      e.innerHTML = HTTP.responseText ;
    }
    catch ( exc )
    {
      throw exc ;
    }
  },
  eval: function ( str )
  {
    try
    {
      return eval ( "x=" + str ) ;
//      return eval ( "(" + str + ")" ) ;
    }
    catch ( exc )
    {
      this.log ( "Browser Exception--------------------------\n" + exc ) ;
      this.evaluateJavaScript ( "x=" + str, false, true ) ;
      throw exc ;
    }
  },
  evaluateJavaScript: function ( str, returnError, log, returnErrorXml )
  {
    if ( returnErrorXml )
    {
      var url = this.getMainUrl() + "&action=EvaluateJavaScript&returnErrorXml=true&log=false" ;
      var HTTP = this.httpPost ( url, str ) ;
      var rc = HTTP.status ;
      if ( rc == 200 )
      {
        if ( HTTP.responseXML && HTTP.responseXML.documentElement )
	{
	  var x = new TXml ( HTTP.responseXML.documentElement ) ;
	  if ( x.getContent ( "Status" ) == "OK" ) return ;
	  return x ;
	}
      }
    }
    else
    {
      var url = this.getMainUrl() + "&action=EvaluateJavaScript&returnError=" + ( returnError ? true : false )
              + "&log=" + ( log ? true : false )
              ;
      var HTTP = this.httpPost ( url, str ) ;
      var rc = HTTP.status ;
      if ( rc == 200 )
      {
        return HTTP.responseText ;
      }
    }
  },
  evaluateXmlParsing: function ( str, returnError, log )
  {
    var url = this.getMainUrl()
            + "&action=EvaluateXml&returnError=" + ( returnError ? true : false )
            + "&log=" + ( log ? true : false )
            ;
    var HTTP = this.httpPost ( url, str ) ;
    var rc = HTTP.status ;
    if ( rc == 200 )
    {
      if ( HTTP.responseText )
      {
      return new TXml ( HTTP.responseXML.documentElement ) ;
      }
    }
  },
  log: function ( text )
  {
    if ( typeof Error !== 'undefined' )
    {
      if ( text instanceof Error )
      {
        text = this.getStackTrace ( text ) ;
      }
    }

    try
    {
      if ( typeof ( text ) != "string" ) text = String ( text ) ;
      this.counter++ ;
      var url = Calypso.getUrl ( "LOG" ) + "&counter=" + this.counter + "&application=" + this.getApplicationName() ;
      var HTTP = this.httpPost ( url, text ) ;
    }
    catch ( exc )
    {
log ( exc ) ;
    }
  },
  LZ: function (x){return(x<0||x>9?"":"0")+x;},
  MLZ: function (x)
  {
    if ( x == "" ) return 0 ;
    if ( x == "0" ) return 0 ;
    if ( x == "00" ) return 0 ;
    var i = 0 ;
    var rc = "" ;
    var found = false ;
    for ( i = 0 ; i < x.length ; i++ )
    {
      if ( ! found && x.charAt ( i ) == '0' ) continue ;
      found = true ;
      rc += x.charAt ( i ) ;
    }
    return rc ;
  },
  formatMoneyWithCurrency: function ( amount )
  {
    if ( ! this.locale ) this.getLocale() ;
    return this.locale.formatMoneyWithCurrency ( amount ) ;
  },
  isAlien: function (a) { return this.isObject(a) && typeof a.constructor != 'function'; },
  isArray: function (a) { return this.isObject(a) && a.constructor == Array; },
  isDate: function (a) { return this.isObject(a) && a.constructor == Date; },
  isBoolean: function (a) { return typeof a == 'boolean'; },
  isEmpty: function (o) {
    var i, v;
    if (this.isObject(o)) {
        for (i in o) {
            v = o[i];
            if (this.isUndefined(v) && this.isFunction(v)) {
                return false;
            }
        }
    }
    return true;
  },
  isFunction: function (a) { return typeof a == 'function'; },
  isNull: function (a) { return typeof a == 'object' && !a; },
  isNumber: function (a) { return typeof a == 'number' && isFinite(a); },
  isObject: function (a) { return a && typeof a == 'object'; },
  isString: function (a) { return typeof a == 'string'; },
  isUndefined: function (a) { return typeof a == 'undefined'; },
  getCookie: function ( name )
  {
    var start = document.cookie.indexOf( name + "=" );
    var len = start + name.length + 1;
    if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) )
    {
      return null;
    }
    if ( start == -1 ) return null;
    var end = document.cookie.indexOf( ";", len );
    if ( end == -1 ) end = document.cookie.length;
    return unescape( document.cookie.substring( len, end ) );
  },
  setCookie: function ( name, value, expires, path, domain, secure )
  {
    var today = new Date();
    today.setTime( today.getTime() );
    if ( expires ) expires = expires * 1000 * 60 * 60 * 24;
    var expires_date = new Date( today.getTime() + (expires) );
    document.cookie = name + "=" + escape ( value )
                    + ( ( expires ) ? ";expires="+expires_date.toGMTString() : "" )
                    + ( ( path ) ? ";path=" + path : "" )
                    + ( ( domain ) ? ";domain=" + domain : "" )
                    + ( ( secure ) ? ";secure" : "" );
  },
  deleteCookie: function ( name, path, domain )
  {
    if ( this.getCookie ( name ) ) document.cookie = name + "="
                                              + ( ( path ) ? ";path=" + path : "")
                                              + ( ( domain ) ? ";domain=" + domain : "" )
                                              + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
  },
  setLogoutFunction: function ( logoutFunction )
  {
    this.logoutFunction = logoutFunction ;
  },
  unload: function ( event )
  {
    if ( typeof ( this.logoutFunction ) == 'function' )
    {
      eval ( this.logoutFunction ) ;
    }
  },
  touchHome: function()
  {
    var url = this.getMainUrl() + "&action=TouchUser" ;
    return this.httpPost ( url ) ;
  },
  escapeCriticalXmlCharacters: function ( str )
  {
    return str.replace ( /&/g, "&amp;" ).replace ( />/g, "&gt;" ).replace ( /</g, "&lt;" ) ;
  },
  escapeHtmlCharacters : function ( str )
  {
    return str.replace ( /&/g, "&amp;" ).replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ).replace ( /\n/g, "<br/>" ) ;
  },
  periodicalToucher: null,
  periodicalToucherTimeoutMillis: 10000,
  periodicalToucherStart: function()
  {
    this._periodicalToucherStart() ;
  },
  _periodicalToucherStart: function()
  {
    this.periodicalToucher = new TTimer ( this.periodicalToucherTimeoutMillis, function()
    {
      try
      {
        var HTTP = TSys.touchHome() ;
        if ( ! TSys.periodicalToucher ) return ;
        if ( HTTP.status == 0 ) return ;
        if ( HTTP.status != 200 )
        {
          TSys.periodicalToucher.stop() ;
          TSys.logout() ;
        }
      }
      catch ( exc )
      {
        if ( TSys.periodicalToucher ) TSys.periodicalToucher.stop() ;
      }
    } ) ;
    this.periodicalToucher.start() ;
  },
  periodicalToucherStop: function()
  {
    this._periodicalToucherStop() ;
  },
  _periodicalToucherStop: function()
  {
    if ( ! this.periodicalToucher ) return ;
    this.periodicalToucher.stop() ;
    this.periodicalToucher = null ;
  },
  changeOwnPassword: function ( oldPassword, newPassword )
  {
    var url = this.getMainUrl()+"&action=ChangeOwnPassword" ;
    var t = "<xml>\n<OldPassword><![CDATA[" + oldPassword + "]]></OldPassword>\n"
          + "<NewPassword><![CDATA[" + newPassword + "]]></NewPassword>\n"
          + "</xml>"
          ;
    var HTTP = this.httpPost ( url, t ) ;
    return HTTP.status ;
  },
  changePassword: function()
  {
    var d = new TDialogChangePassword() ;
    d.setValidator ( this.getPasswordValidator() ) ;
    d.show() ; 
  },
  addDefaultLocalizedMessages: function ( language, name, trans )
  {
    var la = this.defaultLocalizedMessages[language] ;
    if ( la == null )
    {
      la = new Array() ;
      this.defaultLocalizedMessages[language] = la ;
    }
    la[name] = trans ;
  },
  translate: function ( str, def, params )
  {
    if ( ! str ) return def ;

    if ( typeof ( str ) != 'string' ) return "" + str ;

    var post = "" ;
    if ( str.indexOf ( '%' ) == 0 )
    {
      var pos  = str.indexOf ( '%', 1 ) ;
      if ( pos < 0 || pos == str.length - 1 )
      {
        str = str.substring ( 1, pos ) ;
      }
      else
      {
        var str = str.substring ( 1, pos ) ;
        post = str.substring ( pos + 1 ) ;
      }
    }
    var t = "" ;
    t = this.getLocalizedMessages()[str] ;
    if ( ! t )
    {
      var language = this.getLocale().getLanguage() ;
      var la = this.defaultLocalizedMessages[language] ;
      if ( ! la ) la = this.defaultLocalizedMessages["en"] ;
      t = la[str] ;
    }
    if ( ! t ) t = def ;
    if ( ! t ) return str ;

    if ( this.isArray ( params ) )
    {
      var i = 0 ;
      for ( i = 0 ; i < params.length ; i++ )
      {
        t = t.replace ( "\$" + i, params[i] ) ;
      }
    }
    return t + post ;
  },
  replaceDollarVariables: function ( str, params )
  {
    if ( ! str ) return str ;
    if ( ! this.isArray ( params ) ) return str ;
    for ( var i = 0 ; i < params.length ; i++ )
    {
      str = str.replace ( "\$" + i, params[i] ) ;
    }
    return str ;
  },
  getLocalizedMessages: function()
  {
    if ( this.localizedMessages ) return this.localizedMessages ;
    try
    {
      var url = this.getMainUrl()+"&action=GetLocalizedMessages" ;
      var HTTP = this.httpGet ( url ) ;
      if ( HTTP.status != 200 )
      {
        this.localizedMessages = [] ;
        return ;
      }
      if ( HTTP.responseXML && HTTP.responseXML.documentElement )
      {
        if ( this.localizedMessages ) this.localizedMessages.length = 0 ;
        this.localizedMessages = new Array() ;

        var en = new TXEnum ( HTTP.responseXML.documentElement ) ;
        while ( en.hasNext() )
        {
          var e = en.next() ;
          if ( e.nodeType == DOM_ELEMENT_NODE )
          {
            var ch = e.firstChild ;
            if ( ch && ch.nodeValue )
            {
              this.localizedMessages[e.nodeName] = ch.nodeValue ;
            }
          }
        }
      }
    }
    catch ( exc )
    {
      this.localizedMessages = [] ;
log ( exc ) ;
    }
    return this.localizedMessages ;
  },
  isCookiesEnabled: function()
  {
    TSys.setCookie ( "TEST_COOKIE", "VALUE" ) ;
    var c = TSys.getCookie ( "TEST_COOKIE" ) ;
    TSys.deleteCookie ( "TEST_COOKIE" ) ;
    return c != null ;
  },
  joinExistingSession: function()
  {
    this.loggedIn = false ;
    var url = this.getMainUrl()+"&action=JoinExistingSession" ;
    var HTTP = this.httpPost ( url ) ;
    var rc = HTTP.status ;
    if ( rc != 200 )
    {
      if ( this.localizedMessages && this.localizedMessages.length )
      {
        this.localizedMessages.length = 0 ;
      }
      this.localizedMessages = null ;
      this.getLocalizedMessages() ;
      var d = new TUserDialog ( "ThisServiceIsCurrentlyNotAvailable" ) ;
      d.error() ;
      return rc ;
    }

    this.loggedIn = true ;
    if ( HTTP.responseXML && HTTP.responseXML.documentElement )
    {
      this.personalData = new TXml ( HTTP.responseXML.documentElement ) ;
      this.preferenceData = this.personalData.ensureXml ( "PreferenceData" ) ;
      var x = this.personalData.getXml ( "PersistentData" ) ;
      if ( ! x )
      {
        x = this.personalData.addXml ("PersistentData" ) ;
      }
      this.persistentData = new TPersistentData ( x ) ;

      this.user = new TUser ( this.personalData.getXml ( "User" ) ) ;
      var bounds = this.personalData.getDom ( "Bounds" ) ;
      if ( bounds )
      {
        var en = new TXEnum ( bounds ) ;
        while ( en.hasNext() )
        {
          var e = en.next() ;
          if ( e.nodeType == DOM_ELEMENT_NODE )
          {
            var name = e.nodeName ;
            var x = parseInt ( e.getAttribute ( "x" ) ) ;
            var y = parseInt ( e.getAttribute ( "y" ) ) ;
            var w = parseInt ( e.getAttribute ( "width" ) ) ;
            var h = parseInt ( e.getAttribute ( "height" ) ) ;
            var b = new TRectangle ( x, y, w, h ) ;
            TWM.savedWindowBounds [ name ] = b ;
          }
        }
      }
        
      var tn = this.getUser().getRight ( "THEME_NAME" ) ;
      var mtn = this.getUser().getRight ( "MOBILE_THEME_NAME" ) ;
      if ( Tango.ua.mobile && mtn )
      {
        this.setTheme ( mtn ) ;
      }
      else
      if ( ! Tango.ua.mobile && tn )
      {
        this.setTheme ( tn ) ;
      }
      else
      if ( ! this.getWebConfig().getThemeStrict() )
      {
        var themeName = this.personalData.getContent ( "PreferenceData/ThemeName" ) ;
        if ( themeName )
        {
          this.setTheme ( themeName ) ;
        }
      }
    }
    this.getLocalizedMessages() ;
    this.periodicalToucherStart() ;
    this._fireLoginEvent() ;
    return rc ;
  },
  login: function ( uid, pwd, additionalAttributes )
  {
    this.loggedIn = false ;
    if ( ! this.isCookiesEnabled() )
    {
      this.getLocalizedMessages() ;
      var dUserDialog = new TUserDialog ( "YouMustHaveCookiesEnabled" ) ;
      dUserDialog.error() ;
      return -1 ;
    }
    var url = this.getMainUrl()+"&action=Login" ;
    var str = "<xml><uid><![CDATA[" + uid + "]]></uid><pwd><![CDATA[" + pwd + "]]></pwd>" ;
    if ( additionalAttributes )
    {
      str += "\n<AdditionalAttributes>\n" ;
      if ( this.isArray ( additionalAttributes ) || typeof ( additionalAttributes ) == 'object' )
      {
        for ( var key in additionalAttributes )
        {
          if ( typeof ( key ) == 'number' ) continue ;
          var val = additionalAttributes[key] ;
          if ( this.isArray ( val ) || typeof ( val ) == 'object' )
          {
            str += "<" + key + ">\n" ;
            for ( var k in val )
            {
              var v = val[k] ;
              if (  typeof ( v ) != 'string'
                 && typeof ( v ) != 'number'
                 && typeof ( v ) != 'boolean'
                 )
              {
                continue ;
              }
              str += "<Item><![CDATA[" + v + "]]></Item>\n" ;
            }
            str += "</" + key + ">\n" ;
            continue ;
          }
          if (  typeof ( val ) != 'string'
             && typeof ( val ) != 'number'
             && typeof ( val ) != 'boolean'
             )
          {
            continue ;
          }
          str += "<" + key + "><![CDATA[" + val + "]]></" + key + ">\n" ;
        }
      }
      str += "</AdditionalAttributes>" ;
    }
    str += "</xml>" ;
    var HTTP = this.httpPost ( url, str ) ;
    var rc = HTTP.status ;
    if ( rc != 200 )
    {
      if ( this.localizedMessages && this.localizedMessages.length )
      {
        this.localizedMessages.length = 0 ;
      }
      this.localizedMessages = null ;
      this.getLocalizedMessages() ;
      if ( HTTP.status == 403 )
      {
        var dUserDialog = new TUserDialog ( "InvalidCredentials" ) ;
        dUserDialog.error() ;
      }
      else
      {
        var d = new TUserDialog ( "ThisServiceIsCurrentlyNotAvailable" ) ;
        d.error() ;
      }
      return rc ;
    }

    this.loggedIn = true ;
    if ( HTTP.responseXML && HTTP.responseXML.documentElement )
    {
      this.personalData = new TXml ( HTTP.responseXML.documentElement ) ;
      this.preferenceData = this.personalData.ensureXml ( "PreferenceData" ) ;
      var x = this.personalData.getXml ( "PersistentData" ) ;
      if ( ! x )
      {
        x = this.personalData.addXml ("PersistentData" ) ;
      }
      this.persistentData = new TPersistentData ( x ) ;

      this.user = new TUser ( this.personalData.getXml ( "User" ) ) ;
      var bounds = this.personalData.getDom ( "Bounds" ) ;
      if ( bounds )
      {
        var en = new TXEnum ( bounds ) ;
        while ( en.hasNext() )
        {
          var e = en.next() ;
          if ( e.nodeType == DOM_ELEMENT_NODE )
          {
            var name = e.nodeName ;
            var x = parseInt ( e.getAttribute ( "x" ) ) ;
            var y = parseInt ( e.getAttribute ( "y" ) ) ;
            var w = parseInt ( e.getAttribute ( "width" ) ) ;
            var h = parseInt ( e.getAttribute ( "height" ) ) ;
            var b = new TRectangle ( x, y, w, h ) ;
            TWM.savedWindowBounds [ name ] = b ;
          }
        }
      }
        
      var tn = this.getUser().getRight ( "THEME_NAME" ) ;
      var mtn = this.getUser().getRight ( "MOBILE_THEME_NAME" ) ;
      if ( Tango.ua.mobile && mtn )
      {
        this.setTheme ( mtn ) ;
      }
      else
      if ( ! Tango.ua.mobile && tn )
      {
        this.setTheme ( tn ) ;
      }
      else
      if ( ! this.getWebConfig().getThemeStrict() )
      {
        var themeName = this.personalData.getContent ( "PreferenceData/ThemeName" ) ;
        if ( themeName )
        {
          this.setTheme ( themeName ) ;
        }
      }
    }
    this.getLocalizedMessages() ;
    this.periodicalToucherStart() ;
    this._fireLoginEvent() ;
    return rc ;
  },
  getUser: function()
  {
    return this.user ;
  },
  getUid: function()
  {
    if ( ! this.user ) return null ;
    return this.user.getUid() ;
  },
  getOrg: function()
  {
    if ( ! this.user ) return null ;
    return this.user.getOrg() ;
  },
  getUserRight: function ( name, def )
  {
    if ( ! this.user ) return null ;
    return this.user.getRight ( name, def ) ;
  },
  getUserRightBool: function ( name, def )
  {
    if ( ! this.user ) return null ;
    return this.user.getRightBool ( name, def ) ;
  },
  getPreferenceData: function()
  {
    if ( ! this.preferenceData ) this.preferenceData = new TXml() ;
    return this.preferenceData ;
  },
  getPreferenceOptions: function()
  {
    if ( ! this.preferenceOptions )
    {
      this.preferenceOptions = this.getPreferenceData().ensureXml ( "Options" ) ;
    }
    return this.preferenceOptions ;
  },
  getPreferenceValue: function ( name, def )
  {
    if ( ! name ) return null ;
    var po = this.getPreferenceOptions() ;
    if ( ! po ) return def ;
    var e = po.getXml ( name ) ;
    if ( ! e ) return def ;
    return e.getContent() ;
  },
  getPreferenceValueBool: function ( name, def )
  {
    return this.getPreferenceOptions().getBool ( name, def ) ;
  },
  getPreferenceValueFloat: function ( name, def )
  {
    return this.getPreferenceOptions().getFloat ( name, def ) ;
  },
  getPreferenceValueInt: function ( name, def )
  {
    return this.getPreferenceOptions().getInt ( name, def ) ;
  },
  setPreferenceValue: function ( name, value )
  {
    var e = this.getPreferenceOptions().getXml ( name ) ;
    if ( e )
    {
      if ( typeof ( value ) != 'undefined' ) e.setContent ( value ) ;
      else                                   e.remove() ;
    }
    else
    if ( typeof ( value ) != 'undefined' )
    {
      this.getPreferenceOptions().addDom ( name, value ) ;
    }
  },
  getPersistentData: function()
  {
    return this.persistentData ;
  },
  getPersistentWindowData: function ( windowId )
  {
    if ( ! this.persistentData ) return null ;
    return this.persistentData.getElement ( "Windows/" + windowId ) ;
  },
  getPersistentValue: function ( name, windowId )
  {
    if ( ! this.persistentData ) return null ;
    if ( ! windowId ) return this.persistentData.getValue ( name ) ;
    return this.persistentData.getValue ( "Windows/" + windowId + "/" + name ) ;
  },
  addPersistentData: function ( name, value )
  {
    this.persistentData.setValue ( name, value ) ;
  },
  savePersistentData: function()
  {
    var x = this.personalData.duplicate() ;
    x.remove ( "User" ) ;
    var version = this.getWebConfig().getVersion() ;
/*
    <MenuItem text='%Data%' onclick='function()
	    {
	    TSys.addPersistentData ( "XXX", "AAA" ) ;
	    TSys.savePersistentData()
	    }'
	    />
*/
//log ( "version=" + version ) ;
//    var url = this.getMainServletName()+"?application="+this.getApplicationName()+"&counter="+this.getCounter() ;
    var IDENTITY_KEY = this.getUser().getIntegerUid() ;
    var r = Database.createUpdate ( "T_IDENTITY" ) ;
    r.addKeyColumn ( "IDENTITY_KEY", IDENTITY_KEY ) ;
    r.addColumn ( "PREFERENCES", "" + x ) ;
    r.execute() ;
  },
  logout: function ( logoutUrl )
  {
    if ( typeof ( logoutUrl ) != 'string' ) logoutUrl = "" ;
    if ( ! this.loggedIn ) return ;
    this.loggedIn = false ;

    var logoutDone = false ;
    try
    {
      try
      {
        this._fireLogoutEvent() ;
      }
      catch ( exc )
      {
        TSys.log ( "" + exc ) ;
      }
      if ( this.personalData )
      {
        TWM.closeAllWindows() ;
        var bounds = this.personalData.ensureXml ( "Bounds" ) ;
        for ( var key in TWM.savedWindowBounds )
        {
          var p = TWM.savedWindowBounds [ key ] ;
          if ( typeof ( p ) == 'object' && p.jsClassName == 'TRectangle' )
          {
            var b = bounds.ensureXml ( key ) ;
            b.remove() ;
            b = bounds.addXml ( key ) ;
            b.addAttribute ( "x", p.x ) ;
            b.addAttribute ( "y", p.y ) ;
            b.addAttribute ( "width", p.width ) ;
            b.addAttribute ( "height", p.height ) ;
          }
        }
      }
      TGui.collectPersistentData() ;
      this.periodicalToucherStop() ;
      if ( this.preferenceData )
      {
        var xThemeName = this.preferenceData.ensureXml ( "ThemeName" ) ;
        this.preferenceData.remove ( "User" ) ;
        if ( ! this.getWebConfig().getThemeStrict() )
        {
          xThemeName.setContent ( Tango.getThemeName() ) ;
        }
      }
      if ( ! logoutUrl )
      {
        logoutUrl = this.getWebConfig().getLogoutUrl() ;
      }
      if ( ! logoutUrl )
      {
        logoutUrl = document.location ;
      }
      this.user = null ;
      var url = this.getMainUrl() + "&action=Logout" ;
      if ( this.personalData )
      {
        var HTTP = this.httpPost ( url, this.personalData.toString() ) ;
        if ( HTTP.status == 200 ) logoutDone = true ;
      }
      else
      {
        var HTTP = this.httpPost ( url ) ;
        if ( HTTP.status == 200 ) logoutDone = true ;
      }
    }
    catch ( exc )
    {
    }
    if ( logoutUrl )
    {
      this.finished = true ;
      if ( logoutDone )
      {
        document.location = logoutUrl ;
      }
      else
      {
        TSys.writeServiceNotAvailable() ;
      }
    }
  },
  getLocale: function ( optionalElement )
  {
    if ( optionalElement )
    {
      for ( var ch = optionalElement ; ; ch = ch.parentNode )
      {
        if ( ch.nodeName.toUpperCase() == "BODY" ) break ;
        if ( ch.xLocale )
        {
          return ch.xLocale ;
        }
      }
    }
    if ( this.locale ) return this.locale ;
    this.getWebConfig() ;
    return this.locale ;
  },
  getWebConfig: function()
  {
    if ( this.webConfig && this.webConfig.xml ) return this.webConfig ;
    this.webConfig = new TWebConfig() ;
    this.webConfig.initialize() ;
    DateUtils.setFormats ( this.webConfig ) ;
    this._useAxlCache = this.webConfig.getBool ( "UseAxlCache", Tango.ua.realMobile ) ;
    this._minPageWidth = this.webConfig.getInt ( "MinPageWidth", 0 ) ;
    this._minPageHeight = this.webConfig.getInt ( "MinPageHeight", 0 ) ;

    var v = null ;
    v = this.webConfig.getValue ( "Mobile.MinPageWidth" ) ;
    if ( ! v )
    {
      this._minPageWidthMobile = this._minPageWidth ;
    }
    else
    {
      v = v.trim() ;
      if ( v.indexOf ( "function" ) == 0 )
      {
        this._minPageWidthMobile = this._minPageWidth ;
        try
        {
          this._fminPageWidthMobile = TSys.eval ( v ) ;
        }
        catch ( exc )
        {
        }
      }
      else
      {
        this._minPageWidthMobile = parseInt ( v ) ;
	if ( isNaN ( this._minPageWidthMobile ) ) this._minPageWidthMobile = this._minPageWidth ;
      }
    }
    v = this.webConfig.getValue ( "Mobile.MinPageHeight" ) ;
    if ( ! v )
    {
      this._minPageHeightMobile = this._minPageHeight ;
    }
    else
    {
      v = v.trim() ;
      if ( v.indexOf ( "function" ) == 0 )
      {
        this._minPageHeightMobile = this._minPageHeight ;
        try
        {
          this._fminPageHeightMobile = TSys.eval ( v ) ;
        }
        catch ( exc )
        {
        }
      }
      else
      {
        this._minPageHeightMobile = parseInt ( v ) ;
        if ( isNaN ( this._minPageHeightMobile ) ) this._minPageHeightMobile = this._minPageHeight ;
      }
    }
    var mobile = this.webConfig.getBool ( "Browser.Profile/ua-is-mobile", false ) ;
    if ( ! Tango.ua.mobile ) Tango.ua.mobile = mobile ;
    this.locale = new Locale() ;
    var x = this.webConfig.getXml() ;
    if ( x.getContent ( "DEBUG" ) )
    {
      this.DEBUG = x.getBool ( "DEBUG", false ) ;
    }
    if ( x.getContent ( "LOG" ) )
    {
      this.createLOG = x.getBool ( "LOG", false ) ;
    }
    this.showNativeErrors = x.getBool ( "SHOW_NATIVE_ERRORS" ) ;
    this.menuShortcuts = this.webConfig.menuShortcuts ;
    Tango.ua.useGenericButtons = x.getBool ( "USE_GENERIC_BUTTONS", Tango.ua.useGenericButtons ) ;
    this.DEFAULT_MIN_YEAR_FOR_DATE = x.getInt ( "DEFAULT_MIN_YEAR_FOR_DATE", -2 ) ;
    if ( this.DEFAULT_MIN_YEAR_FOR_DATE > 0 ) this.DEFAULT_MIN_YEAR_FOR_DATE *= -1 ;
    this.DEFAULT_MAX_YEAR_FOR_DATE = x.getInt ( "DEFAULT_MAX_YEAR_FOR_DATE", 8 ) ;
    return this.webConfig ;
  },
  isMimetypeText: function  ( mimeType, name )
  {
    if ( mimeType == "application/xml" ) return true ;
    var i = 0 ;
    for ( i = 0 ; i < this.mimeTypeTextFileExtensions.length ; i++ )
    {
      if ( name.endsWith ( this.mimeTypeTextFileExtensions[i] ) ) return true ;
    }
    return false ;
  }
} ;
TSysClass.prototype.DEFAULT_MIN_YEAR_FOR_DATE = -2 ;
TSysClass.prototype.DEFAULT_MAX_YEAR_FOR_DATE = 8 ;
TSysClass.prototype.disableKeyboardShortcuts = function()
{
  this.keyboardShortcutsDisabled = true ;
} ;

TSysClass.prototype.addUnloadListener = function ( fe )
{
  if ( typeof fe === 'function' )
  {
    fe = new TFunctionExecutor ( fe ) ;
  }
  this._unloadListener.push ( fe ) ;
} ;
TSysClass.prototype._fireUnloadEvent = function ( event )
{
  for ( var i = 0 ; i < this._unloadListener.length ; i++ )
  {
    try
    {
      this._unloadListener[i].executeWithEvent ( event ) ;
    }
    catch ( exc )
    {
    }
  }
} ;
window.onbeforeunload = function(e)
{
  TSys._fireUnloadEvent ( e ) ;
  // return "" ;
};

TSysClass.prototype.addLogoutListener = function ( fe )
{
  this._logoutListener.push ( fe ) ;
} ;
TSysClass.prototype._fireLogoutEvent = function ( event )
{
  for ( var i = 0 ; i < this._logoutListener.length ; i++ )
  {
    try
    {
      this._logoutListener[i].executeWithEvent ( event ) ;
    }
    catch ( exc )
    {
    }
  }
} ;
TSysClass.prototype.addLoginListener = function ( fe )
{
  this._loginListener.push ( fe ) ;
} ;
TSysClass.prototype._fireLoginEvent = function ( event )
{
  for ( var i = 0 ; i < this._loginListener.length ; i++ )
  {
    try
    {
      this._loginListener[i].executeWithEvent ( event ) ;
    }
    catch ( exc )
    {
    }
  }
};

TSysClass.prototype.isIE6 = function()
{
  return Tango.ua.ie6 ;
};
TSysClass.prototype.isIE = function()
{
  return Tango.ua.ie ;
};
TSysClass.prototype.isMozilla = function()
{
  return Tango.ua.firefox ;
};
TSysClass.prototype.isKhtml = function()
{
  return Tango.ua.khtml ;
};
TSysClass.prototype.toFullString = function ( text, indent )
{
  if ( ! indent ) indent = "" ;
  if ( this.isArray ( text ) || ( typeof ( text ) == 'object' && text ) )
  {
    var str = "" ;
    if ( text.jsClassName && typeof ( text.toString ) == 'function' )
    {
      str += indent + text + "\n" ;
      return ;
    }
    if ( typeof ( text.nodeType ) == 'number' && text.nodeName && typeof ( text.firstChild  ) )
    {
      str += indent + text + "\n" ;
      return ;
    }
    for ( var key in text )
    {
      var p = text [ key ] ;
      if ( typeof ( p ) == 'function' ) continue ;
      if ( p instanceof TXml )
      {
        str += indent + "[" + key + "]=" + p + "\n" ;
        continue ;
      }
      if ( this.isArray ( p ) || ( typeof ( p ) == 'object' && ! this.isDate ( p ) ) )
      {
        str += indent + "[" + key + "]=\n" + this.toFullString ( p, indent + "  " ) + "\n" ;
        continue ;
      }
      str += indent + "[" + key + "]=" + p + "\n" ;
    }
    return str ;
  }
  return String ( text ) ;
};
TSysClass.prototype.setLogInternal = function ( state )
{
  this.logInternal = state ? true : false ;
};
function log ( text, full )
{
  TSys.debug ( text, full ) ;
}
TSysClass.prototype.debug = function ( text, full )
{
  if ( text instanceof Error )
  {
    text = this.getStackTrace ( text ) ;
  }
  else
  if ( full )
  {
    text = this.toFullString ( text ) ;
  }
  else
  if ( this.isArray ( text ) )
  {
    text = this.toFullString ( text ) ;
  }

  if ( ! this.createLOG )
  {
    this.log ( text ) ;
    return ;
  }
  try
  {
//TSys.logInternal = false ;
    if ( Tango.ua.realMobile || this.logRemote )
    {
      this.log ( text ) ;
      return ;
    }
    if ( this.logInternal )
    {
      TGui.log ( text ) ;
      return ;
    }
  }
  catch ( exc )
  {
text = text + "\n" + exc ;
  }
  if ( this.theLoggingWindow && ! this.theLoggingWindow.closed )
  {
    this.theLoggingTextArea.value += text + "\n" ;
    this.theLoggingWindow.focus() ;
    return ;
  }
  var win = window;
  var uid = "da_logging_window";

  var url = "" + TSys.getCounter() ;
  var name = uid ;
  var nwin = null ;
  try
  {
    nwin = win.open("", name, "locationbar=no,resizable=yes,dependent=yes, height=200, width=500");
  }
  catch ( exc )
  {
  }
  if (!nwin) {
    alert("Not able to open debugging window due to pop-up blocking.");
    return undefined;
  }
  nwin.document.write(
       '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">'
     + '<html>'
     + '<head>'
     + '<title>Logging ...</title>'
     + '<script type="text/javascript" language="javascript" >'
     + 'function clearPane(event)'
     + '{'
     + '  var ta = document.getElementById ( "LOG_WINDOW_TEXTAREA" ) ;'
     + '  ta.value = "\\n" ;'
     + '}'
     + 'function closePane(event)'
     + '{'
     + '  window.close() ;'
     + '}'
     + '</script>'
     + '</head>'
     + '<body id="LOG_WINDOW_BODY" >'
     + '<button onclick="clearPane(event)" style="position:absolute; left:4px; top:4px;" >Clear</button>'
     + '<button onclick="closePane(event)" style="position:absolute; right:4px; top:4px;" >Close</button>'
     + '<div id="LOG_WINDOW_PANE" style="position:absolute; left:0px; top:28px; width:98%; height:98%;" >'
     + '<textarea style="position:absolute;width:100%;height:100%;" rows="20" ID="LOG_WINDOW_TEXTAREA" >'
     + '</textarea>'
     + '</div>'
     + '</body>'
     + '</html>'
     );
  nwin.document.close();
  nwin.document.title += ' ' + win.document.title;
  this.theLoggingWindow = nwin;
  this.theLoggingTextArea = nwin.document.getElementById ( "LOG_WINDOW_TEXTAREA" ) ;
  this.theLoggingWindow.focus() ;
  this.theLoggingTextArea.value = text + "\n" ;
};
TSysClass.prototype.tryFunctionExecutor = function ( str )
{
  if ( ! str ) return null ;
  str = str.trim() ;
  if (  ( str.charAt ( 0 ) == "{" && str.charAt ( str.length-1 ) == "}" )
     || ( str.indexOf ( "(" ) > 0 && str.charAt ( str.length-1 ) == ")" )
     || ( str.startsWith ( "function" ) && str.indexOf ( "(" ) > 0 && str.charAt ( str.length-1 ) == "}" )
     )
  {
    var args = this.toArray ( arguments ) ; args.shift();
    var fe = new TFunctionExecutor ( str, args ) ;
    return fe ;
  }
  return null ;
};
TSysClass.prototype.print = function ( str, title )
{
  var t = str ;
  if ( typeof ( str ) == 'string' ) {}
  else
  if ( str && str.nodeName )
  {
    t = str.innerHTML ;
  }
  else
  {
    t = String ( str ) ;
  }
  if ( title ) title = encodeURIComponent ( title ) ;
  if ( TSys.isIE() ) title = "" ;
  var nwin = window.open("", title ? title : "", "menubar=yes,toolbar=yes,scrollbars=yes,locationbar=yes,resizable=yes,dependent=yes" ) ;
  nwin.document.write ( t ) ;
  nwin.document.close();
  nwin.print();
};
TSysClass.prototype.writeServiceNotAvailable = function()
{
  document.open() ;
  if ( TSys._notAvailableHtml )
  {
    TSys._notAvailableHtml = TSys._notAvailableHtml.replace ( /#DOCUMENT.LOCATION#/g, document.location ) ;
    document.write( TSys._notAvailableHtml ) ;
  }
  else
  {
    document.write(
         '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">'
       + '<html>'
       + '<head>'
       + '<title>Service unavailable</title>'
       + '</head>'
       + '<body >'
       + 'This service is currently unavailable'
       + '</body>'
       + '</html>'
       );
  }
  document.close();
};
TSysClass.prototype.getEmptyXmlDocument = function()
{
  var url = "Tango?action=GetEmptyXml" ;
  var HTTP = TSys.getHttpRequestObject() ;
  HTTP.open ( "GET", url, false ) ;
  HTTP.send(url) ;
  if ( HTTP.status != 200 )
  {
    var t = TSys.createHttpStatusText ( HTTP ) ;
    return new TXml ( this.parseDom ( "<xml></xml>" ) ) ;
  }
  return new TXml ( HTTP.responseXML.documentElement ) ;
};
/**
 *  @constructor
 */
var TUser = function ( xmlUser )
{
  this.jsClassName = "TUser" ;
  this.xmlUser = xmlUser ;
};
TUser.prototype =
{
  getUid: function()
  {
    if ( ! this.xmlUser ) return null ;
    return this.xmlUser.getContent ( "Uid" ) ;
  },
  getOrg: function()
  {
    if ( ! this.xmlUser ) return null ;
    return this.xmlUser.getContent ( "Org" ) ;
  },
  getIntegerUid: function()
  {
    if ( ! this.xmlUser ) return -1 ;
    return this.xmlUser.getInt ( "IntegerUid", -1 ) ;
  },
  getExternalKey: function()
  {
    if ( ! this.xmlUser ) return -1 ;
    return this.xmlUser.getInt ( "ExternalKey", -1 ) ;
  },
  getExternalId: function()
  {
    if ( ! this.xmlUser ) return null ;
    return this.xmlUser.getContent ( "ExternalId" ) ;
  },
  getWorkAxl: function()
  {
    if ( ! this.xmlUser ) return null ;
    return this.xmlUser.getContent ( "WorkPage" ) ;
  },
  getOrgUnitId: function ( level )
  {
    if ( ! this.xmlUser ) return -1 ;
    return this.xmlUser.getInt ( "Org" + level + "Id", -1 ) ;
  },
  getRight: function ( name, def )
  {
    if ( typeof ( def ) == 'undefined' ) def = null ;
    if ( ! name ) return def ;
    if ( ! this.xmlUser ) return def ;
    var r = this.xmlUser.getXml ( "Rights" ) ;
    if ( ! r ) return def ;
    var e = r.getXml ( name ) ;
    if ( ! e ) return def ;
    return e.getContent() ;
  },
  getRightBool: function ( name, def )
  {
    var v = this.getRight ( name, def ) ;
    if ( ! v || v != "true" ) return def ? true : false ;
    return true ;
  },
  pwdMustBeChanged: function()
  {
    if ( ! this.xmlUser ) return false ;
    var i = this.xmlUser.getInt ( "PWD_MUST_BE_CHANGED", 0 ) ;
    return ( i & 1 ) != 0 ;
  },
  getGroupId: function ( name )
  {
    if ( ! this.xmlUser ) return -1 ;
    var g = this.xmlUser.getXml ( "Groups" ) ;
    if ( ! g ) return -1 ;
    var en = g.getEnum ( "Group" ) ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( d.nodeType != DOM_ELEMENT_NODE ) continue ;
      var x = new TXml ( d ) ;
      if ( x.getContent ( "Name" ) == name )
      {
        return x.getInt ( "Id", -1 ) ;
      }
    }
    return -1 ;
  },
  getGroupIdByType: function ( groupTypeName )
  {
    if ( ! this.xmlUser ) return -1 ;
    var r = this.xmlUser.getXml ( "Rights" ) ;
    if ( ! r ) return -1 ;
    var en = r.elements() ;
    while ( en.hasNext() )
    {
      var x = en.nextXml() ;
      var tn = x.getName() ;
      if ( tn.indexOf ( "GROUP." ) != 0 ) continue ;
      if ( tn == "GROUP." + groupTypeName )
      {
        var name = x.getContent() ;
        return this.getGroupId ( name ) ;
      }
    }
    return -1 ;
  },
  isMemberOfGroup: function ( name )
  {
    return this.getGroupId ( name ) != -1 ;
  },
  toString: function()
  {
    if ( ! this.xmlUser ) return "(" + this.jsClassName + ")" ;
    return "(" + this.jsClassName + ")\n" + this.xmlUser ;
  }
} ;
// -------------- Web configuration ----------------------
/**
 *  @constructor
 */
var TWebConfig = function()
{
  this.jsClassName = "TWebConfig" ;
  this.xml = null ;
  this.languageCode = null ;
  this.countryCode = null ;
  this.applicationName = null ;
  this.namespace = null ;
};
TWebConfig.prototype =
{
  initialize: function()
  {
    try
    {
      var url = TSys.getMainUrl() + "&action=GetWebConfig" ;
      var response  = TSys.getXml ( url ) ;
      this.xml = new TXml ( response ) ;
      TSys._notAvailableHtml = this.xml.getContent ( "NotAvailableHtml" ) ;
      TSys.setUserLanguage ( this.xml.getContent ( "Browser.Profile/accept-language", "de" ) ) ;
      var millis = this.xml.getInt ( "PeriodicalToucherTimeoutMillis", -1 ) ;
      if ( millis >= 3000 ) // && millis <= 300000 )
      {
        TSys.periodicalToucherTimeoutMillis = millis ;
      }
      this.applicationName = this.xml.getContent ( "Application" ) ;
      if ( this.applicationName ) TSys.setApplicationName ( this.applicationName ) ;
      this.shortcuts = this.xml.getBool ( "Shortcuts", true ) ;
      this.menuShortcuts = true ;
      this.menuShortcuts = this.xml.getBool ( "MenuShortcuts", this.menuShortcuts ) ;
    }
    catch ( exc )
    {
      log ( exc ) ;
    }
  },
  getVersion: function()
  {
    if ( ! this.xml ) return 1 ;
    return this.xml.getInt ( "Version", 1 ) ;
  },
  getNamespace: function()
  {
    if ( ! this.xml ) return null ;
    return this.xml.getContent ( "Namespace" ) ;
  },
  getStartAxl: function()
  {
    if ( ! this.xml ) return null ;
    if ( Tango.ua.mobile )
    {
      var dt = this.xml.getContent ( "Mobile.StartAxl", this.xml.getContent ( "Mobile.WorkAxl", null ) ) ;
      if ( dt ) return dt ;
    }
    return this.xml.getContent ( "StartAxl", this.xml.getContent ( "WorkAxl", null ) ) ;
  },
  getXml: function()
  {
    return this.xml ;
  },
  getLogoutUrl: function()
  {
    if ( ! this.xml ) return null ;
    if ( Tango.ua.mobile )
    {
      var dt = this.xml.getContent ( "Mobile.LogoutUrl" ) ;
      if ( dt ) return dt ;
    }
    return this.xml.getContent ( "LogoutUrl", null ) ;
  },
  isLTR: function()
  {
    if ( ! this.xml ) return true ;
    if ( this.textDirection ) return this.textDirection == "ltr" ;
    return this.getTextDirection() == "ltr" ;
  },
  getTextDirection: function()
  {
    if ( this.textDirection ) return this.textDirection ;
    if ( ! this.xml ) return "ltr" ;
    this.textDirection = this.xml.getContent ( "TextDirection", "ltr" ) ;
    return this.textDirection ;
  },
  getTextVerticalDirection: function()
  {
    if ( ! this.xml ) return "tb" ;
    return this.xml.getContent ( "TextVerticalDirection", "tb" ) ;
  },
  getContextPath: function()
  {
    if ( ! this.xml ) return "" ;
    return this.xml.getContent ( "Browser.Profile/context-path" ) ;
  },
  getWorkAxl: function()
  {
    var user = TSys.getUser() ;
    if ( user )
    {
      var str = user.getWorkAxl() ;
      if ( str ) return str ;
    }
    if ( ! this.xml ) return null ;
    if ( Tango.ua.mobile )
    {
      var dt = this.xml.getContent ( "Mobile.WorkAxl", this.xml.getContent ( "Mobile.StartAxl", null ) ) ;
      if ( dt ) return dt ;
    }
    return this.xml.getContent ( "WorkAxl", this.xml.getContent ( "StartAxl", null ) ) ;
  },
  getDefaultThemeName: function()
  {
    if ( ! this.xml ) return "XP" ;
    if ( Tango.ua.mobile )
    {
      var dt = this.xml.getContent ( "Mobile.DefaultTheme" ) ;
      if ( dt ) return dt ;
    }
    return this.xml.getContent ( "DefaultTheme", "XP" ) ;
  },
  getThemeStrict: function()
  {
    if ( ! this.xml ) return false ;
    if ( Tango.ua.mobile )
    {
      var dt = this.xml.getContent ( "Mobile.ThemeStrict" ) ;
      if ( dt ) return this.xml.getBool ( "Mobile.ThemeStrict", false ) ;
    }
    return this.xml.getBool ( "ThemeStrict", false ) ;
  },
  toString: function()
  {
    return "(TWebConfig)\n" + this.xml.toString ( true ) ;
  },
  getValue: function ( name, def )
  {
    if ( ! this.xml ) return def ;
    return this.xml.getContent ( name, def ) ;
  },
  getInt: function ( name, def )
  {
    if ( ! this.xml ) return def ;
    return this.xml.getInt ( name, def ) ;
  },
  getBool: function ( name, def )
  {
    if ( ! this.xml ) return def ;
    return this.xml.getBool ( name, def ) ;
  }
};
/**
 *  @constructor
 */
var TPoint = function ( x, y )
{
  if ( typeof ( x ) == 'string' ) x = parseInt ( x ) ;
  if ( typeof ( y ) == 'string' ) y = parseInt ( y ) ;
  this.x = isNaN ( x ) ? 0 : x ;
  this.y = isNaN ( y ) ? 0 : y ;
  this.jsClassName = "TPoint" ;
};
TPoint.prototype.toString = function()
{
  return "Point[" + this.x + "," + this.y + "]" ;
};
TPoint.prototype.plus = function ( that )
{
  return new TPoint ( this.x + that.x, this.y + that.y ) ;
};
TPoint.prototype.minus = function ( that )
{
  return new TPoint ( this.x - that.x, this.y - that.y ) ;
};
TPoint.prototype.min = function(that)
{
  return new TPoint (
        Math.min(this.x , that.x), Math.min(this.y , that.y)) ;
};
TPoint.prototype.max = function(that)
{
  return new TPoint (
        Math.max(this.x , that.x), Math.max(this.y , that.y)) ;
};
TPoint.prototype.constrainTo = function (one, two)
{
  var min = one.min(two) ;
  var max = one.max(two) ;

  return this.max(min).min(max) ;
};
TPoint.prototype.distance = function (that)
{
  return Math.sqrt(Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2)) ;
};
/**
 *  @constructor
 */
var TDimension = function ( width, height )
{
  if ( typeof ( width ) == 'string' ) width = parseInt ( width ) ;
  if ( typeof ( height ) == 'string' ) height = parseInt ( height ) ;
  this.width = isNaN ( width ) ? 0 : width ;
  this.height = isNaN ( height ) ? 0 : height ;
  this.jsClassName = "TDimension" ;
};
TDimension.prototype.toString = function()
{
  return "Dimension[width=" + this.width + ",height=" + this.height + "]" ;
};
/**
 *  @constructor
 */
var TRectangle = function ( x, y, width, height )
{
  if ( typeof ( x ) == 'string' ) x = parseInt ( x ) ;
  if ( typeof ( y ) == 'string' ) y = parseInt ( y ) ;
  if ( typeof ( width ) == 'string' ) width = parseInt ( width ) ;
  if ( typeof ( height ) == 'string' ) height = parseInt ( height ) ;
  this.x = isNaN ( x ) ? 0 : x ;
  this.y = isNaN ( y ) ? 0 : y ;
  this.width = isNaN ( width ) ? 0 : width ;
  this.height = isNaN ( height ) ? 0 : height ;
  this.jsClassName = "TRectangle" ;
};
TRectangle.prototype.toString = function()
{
  return "Rectangle[" + this.x + "," + this.y + "," + this.width + "," + this.height + "]" ;
};
/**
 *  @param {int|TPoint|event} x
 *  @param {int} [y]
 *  @return {boolean} true if inside or on border, else false
 */
TRectangle.prototype.contains = function ( x, y )
{
  if ( x instanceof TPoint ) { y = x.y ; x = x.x ; }
  else
  if ( x && typeof ( x ) == 'object' )
  {
    if ( x.isEvent || ( x instanceof TEvent ) )
    {
      var ev = x ;
      x = ev.getX() ; y = ev.getY() ;
    }
    else
    if ( x.type && x.type.indexOf ( "mouse" ) == 0 )
    {
      var ev = new TEvent ( x ) ;
      x = ev.getX() ; y = ev.getY() ;
    }
  }
  if ( typeof ( x ) == 'number' && typeof ( y ) == 'number' )
  {
    if ( x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height )
    {
      return true ;
    }
  }
  return false ;
};
/**
 *  @param {int|TPoint|event} x
 *  @param {int} [y]
 *  @return {boolean} true if inside, border excluded, else false
 */
TRectangle.prototype.inside = function ( x, y )
{
  if ( x instanceof TPoint ) { y = x.y ; x = x.x ; }
  else
  if ( x && typeof ( x ) == 'object' )
  {
    if ( x.type && x.type.indexOf ( "mouse" ) == 0 )
    {
      var ev = new TEvent ( x ) ;
      x = ev.getX() ; y = ev.getY() ;
    }
  }
  if ( typeof ( x ) == 'number' && typeof ( y ) == 'number' )
  {
    if ( x > this.x + 3 && x < this.x + this.width - 1 && y > this.y + 3 && y < this.y + this.height - 1 )
    {
      return true ;
    }
  }
  return false ;
};
/**
 *  @constructor
 */
var Insets = function ( top, left, bottom, right )
{
  this.jsClassName = "Insets" ;
  if (  typeof ( top ) == 'object' )
  {
    this.top = typeof ( top.top ) == 'number' ? top.top : 0 ;
    this.left = typeof ( top.left ) == 'number' ? top.left : 0 ;
    this.bottom = typeof ( top.bottom ) == 'number' ? top.bottom : 0 ;
    this.right = typeof ( top.right ) == 'number' ? top.right : 0 ;
    return ;
  }
  this.top = typeof ( top ) == 'number' ? top : 0 ;
  this.left = typeof ( left ) == 'number' ? left : 0 ;
  this.bottom = typeof ( bottom ) == 'number' ? bottom : 0 ;
  this.right = typeof ( right ) == 'number' ? right : 0 ;
};
Insets.prototype =
{
  toString: function()
  {
    return "(" + this.jsClassName + ")["
         + "top=" + this.top
         + ",left=" + this.left
         + ",bottom=" + this.bottom
         + ",right=" + this.right
         + "]"
         ;
  }
};
/**
 *  @constructor
 */
var Padding = function ( top, left, bottom, right )
{
  Tango.initSuper ( this, Insets, top, left, bottom, right );
  this.jsClassName = "Padding" ;
};
Padding.inherits( Insets ) ;
Padding.prototype.apply = function ( htmlElement )
{
  if ( this.top >= 0 ) htmlElement.style.paddingTop = this.top + "px" ;
  if ( this.left >= 0 ) htmlElement.style.paddingLeft = this.left + "px" ;
  if ( this.bottom >= 0 ) htmlElement.style.paddingBottom = this.bottom + "px" ;
  if ( this.right >= 0 ) htmlElement.style.paddingRight = this.right + "px" ;
};
/*
  TComponent.prototype.setSize.apply ( this, arguments ) ;
*/
/**
 *  @constructor
 */
var TException = function ( text, code )
{
  this.text = text ;
  this.code = code ;
};
TException.prototype =
{
  toString: function()
  {
    return this.text + ( this.code ? "( " + this.code + " )" : "" ) ;
  }
};
function getWindow ( elem )
{
  var ch = elem ;
  while ( ch )
  {
    if ( ch.xClassName == "Window" )
    {
      return ch ;
    } 
    ch = ch.parentNode ;
  }
  return null ;
}
// ------ common gui handling: layout event geometrie ------------

var LC = 0 ;
/**
 *  @constructor
 */
var CheckableGroup = function ( name )
{
  this.jsClassName = "CheckableGroup" ;
  this.name = name ;
  this.checkableList = [] ;
  this.genericCheckableList = [] ;
};
CheckableGroup.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
CheckableGroup.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this.checkableList.length = 0 ;
  this.checkableList = undefined ;
  this.genericCheckableList.length = 0 ;
  this.genericCheckableList = undefined ;
};
CheckableGroup.prototype.addCheckable = function ( ch )
{
  if ( ! ch.checkable ) return ;
  if ( ch.xClassName.indexOf ( "ToolbarToggle" ) == 0 )
  {
    TGui.addEventListener ( ch, "mouseup", this.setCheckableState.bindAsEventListener ( this ) ) ;
    this.genericCheckableList.push ( ch ) ;
    return ;
  }
  if ( ch.jsPeer && typeof ( ch.jsPeer.setChecked ) == 'function' )
  {
    ch.checkableGroup = this ;
    if ( ch.checked )
    {
      for ( var i = 0 ; i < this.checkableList.length ; i++ )
      {
        if ( this.checkableList[i].checked ) this.checkableList[i].jsPeer.setChecked ( false ) ;
      }
    }
    this.checkableList.push ( ch ) ;
  }
};
CheckableGroup.prototype.setCheckableState = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! src.checkable ) src = src.parentNode ;
  if ( src.disabled ) return ;
  if ( this.genericCheckableList.length == 1 )
  {
    if ( this.genericCheckableList[0].checked )
    {
      this.genericCheckableList[0].checked = false ;
      setButtonDecoration ( this.genericCheckableList[0], "normal", event ) ;
    }
    else
    {
      this.genericCheckableList[0].checked = true ;
      setButtonDecoration ( this.genericCheckableList[0], "normal", event ) ;
    }
    return ;
  }
  for ( var i = 0 ;  i < this.genericCheckableList.length ; i++ )
  {
    if ( this.genericCheckableList[i] == src ) continue ;
    if ( this.genericCheckableList[i].checked )
    {
      this.genericCheckableList[i].checked = false ;
      setButtonDecoration ( this.genericCheckableList[i], "normal", event ) ;
    }
  }
  src.checked = true ;
  setButtonDecoration ( src, "normal", event ) ;
};
CheckableGroup.prototype.checkableChecked = function ( ch )
{
  for ( var i = 0 ;  i < this.checkableList.length ; i++ )
  {
    if ( this.checkableList[i] == ch ) continue ;
    if ( this.checkableList[i].checked ) this.checkableList[i].jsPeer.setChecked ( false ) ;
  }
};
/**
 *  @constructor
 */
var ListenerContext = function ( method, htmlContainerElement, layoutContext )
{
  LC++ ;
  this.LC = LC ;
  this.htmlContainerElement = htmlContainerElement ;
  this.counter = 0 ;
  this.itemListenerPeers = [] ;
  this.changeListener = null ;
  this.containerXml = null ;
  if ( htmlContainerElement ) this.containerXml = new TXml ( htmlContainerElement ) ;
  this.idList = [] ;
  this.pbList = [] ;
  this.componentList = [] ;
  this.definition = null ;
  this._numberOfExternalListener = 0 ;
  this._allIdsResolved = false ;

  if ( typeof ( method ) == 'string' )
  {
    this.definition = method ;
    method = method.trim() ;
    var handlePosition = method.indexOf ( "handle:" ) ;
    var jsPosition = method.indexOf ( "javascript:" ) ;
    var done = false ;
    if ( method == "true" )
    {
      done = true ;
    }
    if ( handlePosition >= 0 )
    {
      var p1 = method.indexOf ( ':', handlePosition ) ;
      if ( ! this.containerXml )
      {
        if ( p1 < 0 ) throw "onchange: Internal error: Missing htmlContainerElement for: '" + method + "'" ;
      }
      if ( p1 < 0 ) throw "onchange: Missing : ( colon ) in value: '" + method + "'" ;
      var p2 = method.indexOf ( ';', p1 ) ;

      var str = null ;
      if ( p2 > 0 ) str = method.substring ( p1 + 1, p2 ) ;
      else          str = method.substring ( p1 + 1 ) ;
      str = str.trim() ;

      if ( str.indexOf ( ' ' ) < 0 )
      {
        this.idList.push ( str ) ;
      }
      else
      {
        var a = str.split ( " " ) ;
        for ( var i = 0 ; i < a.length ; i++ )
        {
          str = a[i].trim() ;
          if ( str ) this.idList.push ( str ) ;
        }
      }
      done = true ;
    }
    if ( jsPosition >= 0 )
    {
      var p1 = method.indexOf ( ':', jsPosition ) ;
      if ( p1 < 0 ) throw "onchange: Missing : ( colon ) in value: '" + method + "'" ;
      var p2 = method.lastIndexOf ( ';', p1 ) ;

      var str = null ;
      if ( p2 == method.charAt ( method.length-1 ) ) str = method.substring ( p1 + 1, p2 ) ;
      else          str = method.substring ( p1 + 1 ) ;
      str = str.trim() ;
      this.changeListener = new TFunctionExecutor ( str, layoutContext ) ;
      done = true ;
    }
    if ( ! done )
    {
      this.changeListener = new TFunctionExecutor ( method, layoutContext ) ;
    }
  }
} ;
ListenerContext.prototype =
{
  toString: function()
  {
    return "(ListenerContext)"
         + "[" + this.definition + "]"
         ;
  },
  flush: function()
  {
    if  ( this.changeListener ) this.changeListener.flush() ;
    this.changeListener = null ;
    this.htmlContainerElement = null ;
    if ( this.containerXml ) this.containerXml.flush() ;
    this.containerXml = null ;
    if ( this.itemListenerPeers ) this.itemListenerPeers.length = 0 ;
    this.itemListenerPeers = null ;
    if ( this.idList ) this.idList.length = 0 ;
    this.idList = null ;
    if ( this.pbList ) this.pbList.length = 0 ;
    this.pbList = null ;
    this.componentList.length = 0 ;
  },
  check: function()
  {
    this._execute ( new TEvent() ) ;
  },
  changed: function()
  {
    this._changed ( null ) ;
  },
  _containerRendered: function()
  {
    if ( ! this.htmlContainerElement ) return ;
    if ( ! this.idList.length ) return ;

    this._allIdsResolved = true ;
    for ( var i = 0 ; i < this.idList.length ; i++ )
    {
      var e = document.getElementById ( this.idList[i] ) ;
      if ( ! e )
      {
        e = new TContainer ( this.containerXml.getDom() ).getElement(this.idList[i]) ;
        if ( ! e )
        {
          this._allIdsResolved = false ;
          this.componentList.push ( "" ) ;
          this.pbList.push ( "" ) ;
          continue ;
        }
      }
      if ( e.jsPeer && e.jsPeer.setEnabled )
      {
        this.addComponent ( e.jsPeer  ) ;
        this.pbList.push ( "" ) ;
      }
      else
      {
        this.pbList.push ( new TButton ( e ) ) ;
        this.componentList.push ( "" ) ;
      }
    }
    if ( ! this._numberOfExternalListener )
    {
      var newState = this.containerXml.isMandatoryOk(null,null) ;
      for ( var i = 0 ; i < this.pbList.length ; i++ )
      {
        if ( ! this.pbList[i] ) continue ;
        this.pbList[i].setEnabled ( newState ) ;
      }
//      for ( var i = 0 ; i < this.componentList.length ; i++ )
//      {
//        this.componentList[i].setEnabled ( newState ) ;
//      }
    }
  },
  _execute: function ( ev )
  {
    var listenerRC = null ;
    if ( this.changeListener )
    {
      listenerRC = this.changeListener.executeWithEvent ( ev ) ;
    }
    if ( ! this._allIdsResolved )
    {
      for ( var i = 0 ; i < this.idList.length ; i++ )
      {
        if ( this.pbList[i] || this.componentList[i] ) continue ;
        var e = document.getElementById ( this.idList[i] ) ;
        if ( ! e )
        {
          e = new TContainer ( this.containerXml.getDom() ).getElement(this.idList[i]) ;
          if ( ! e )
          {
            continue ;
          }
        }
        if ( e.jsPeer && e.jsPeer.setEnabled )
        {
          this.componentList[i] = e.jsPeer ;
        }
        else
        {
          this.pbList[i] = new TButton ( e ) ;
        }
      }
    }
    this._allIdsResolved = true ;
    if ( this.pbList.length == 0 && this.componentList.length == 0 ) return ;

    if ( ev.isReset() )
    {
      for ( var i = 0 ; i < this.pbList.length ; i++ )
      {
        if ( ! this.pbList[i] ) continue ;
        this.pbList[i].setEnabled ( false ) ;
      }
      for ( var i = 0 ; i < this.componentList.length ; i++ )
      {
        if ( ! this.componentList[i] ) continue ;
        this.componentList[i].setEnabled ( false ) ;
      }
      return ;
    }
    var newState = this.containerXml.isMandatoryOk(null,ev) ;
    if ( typeof ( listenerRC ) == 'boolean' )
    {
      if ( ! listenerRC ) newState = false ;
      else newState = true ;
    }
    for ( var i = 0 ; i < this.pbList.length ; i++ )
    {
      if ( ! this.pbList[i] ) continue ;
      this.pbList[i].setEnabled ( newState ) ;
    }
    for ( var i = 0 ; i < this.componentList.length ; i++ )
    {
      if ( ! this.componentList[i] ) continue ;
      this.componentList[i].setEnabled ( newState ) ;
    }
  },
  _changed: function ( event )
  {
    var ev = new TEvent ( event, TEvent.prototype.CHANGED ) ;
    if  ( ev.getSource() && ( ev.getSource().disabled || ev.getSource().readOnly ) ) return ;
    this.counter++ ;
    this._execute ( ev ) ;
  },
  reset: function ( event )
  {
    this.counter = 0 ;
    var ev = new TEvent ( event, TEvent.prototype.RESET ) ;
    ev.setType ( TEvent.prototype.RESET ) ;
    this._execute ( ev ) ;
  },
  hasChanged: function()
  {
    return this.counter != 0 ;
  },
  addComponent: function ( jsComponent )
  {
    this.componentList.push ( jsComponent ) ;
  },
  addOnKeyUpEvent: function ( ch )
  {
    TGui.addEventListener ( ch, "keyup", this.keyUp.bindAsEventListener ( this ) ) ;
  },
  addOnChangeEvent: function ( ch )
  {
    TGui.addEventListener ( ch, "change", this.onChange.bindAsEventListener ( this ) ) ;
  },
  addOnMouseUp: function ( ch )
  {
    TGui.addEventListener ( ch, "mouseup", this.onMouseUp.bindAsEventListener ( this ) ) ;
  },
  addItemListenerTo: function ( jsPeer )
  {
    if ( ! jsPeer.addItemListener ) return ;
    this.itemListenerPeers.push ( jsPeer ) ;
    jsPeer.addItemListener ( this, this.itemStateChanged ) ;
    this._numberOfExternalListener++ ;
  },
  addPropertyChangeListenerTo: function ( jsPeer )
  {
    jsPeer.addPropertyChangeListener ( this, this.propertyChange ) ;
    this._numberOfExternalListener++ ;
  },
  propertyChange: function ( jsEvent )
  {
    this._changed  ( jsEvent.getEvent() ) ;
  },
  itemStateChanged: function ( jsEvent )
  {
    if ( jsEvent.isItemSelected() )
    {
      this._changed  ( jsEvent.getEvent() ) ;
    }
    else
    {
      var reset = true ;
      for ( var i = 0 ; i < this.itemListenerPeers.length ; i++ )
      {
        if ( this.itemListenerPeers[i].getSelectedItem() )
        {
          reset = false ;
          break ;
        }
      }
      if ( reset ) this.reset ( jsEvent ) ;
    }
  },
  keyUp: function ( event )
  {
    var ev = new TEvent ( event ) ;
    if ( ev.isEnter() )
    {
      if ( ev.getSource().nodeName != "TEXTAREA" ) return ;
    }
    var kc = ev.getKeyCode() ;
    if (  kc == 27 // isEscape
       || kc == 33
       || kc == 34
       || kc == 35
       || kc == 36
       || kc == 37 // isCursorLeft
       || kc == 38 // isCursorUp
       || kc == 39 // isCursorRight
       || kc == 40 // isCursorRight
       || kc == 45
       || kc == 144 // NUM
       ) return ;
    if ( ev.isCtrl() )
    {
      if ( ev.getCharCode() == 'C' ) return ;
      if ( ev.getCharCode() == 'A' ) return ;
      if ( ev.isAlt() ) return ;
    }
    if ( kc == 16 ) return ; // shift only
    if ( kc == 17 ) return ; // CTRL only
    if ( kc == 18 ) return ;
    if ( kc == 20 ) return ;
    if ( kc == 9 )
    {
      if ( ev.getSource().nodeName != "TEXTAREA" ) return ;
    }
    this._changed ( event ) ;
  },
  onChange: function ( event )
  {
    this._changed ( event ) ;
  },
  onMouseUp: function ( event )
  {
    this._changed ( event ) ;
  }
} ;
var LayoutContext = function()
{
  this.jsClassName = "LayoutContext" ;
  this.listenerContext = null ;
  this.firstTextField = null ;
  this.firstINPUT = null ;
  this.firstBUTTON = null ;
  this.pageletStack = [] ;
} ;
LayoutContext.prototype =
{
  toString: function()
  {
    var str = "(" + this.jsClassName + ")" ;
    for ( var i = 0 ; i < this.pageletStack.length ; i++ )
    {
      str += "\n  " + "[" + i + "]" + this.pageletStack[i] ;
    }
    return str ;
  },
  getListenerContext: function()
  {
    return this.listenerContext ;
  },
  setListenerContext: function ( listenerContext )
  {
    this.listenerContext = listenerContext ;
  },
  pushPagelet: function ( pl )
  {
    if ( this.pageletStack.length )
    {
       var ppl = this.pageletStack[this.pageletStack.length-1] ;
       if ( typeof ( ppl.addChild ) == 'function' )
       {
         ppl.addChild ( pl ) ;
       }
       else
       if ( typeof ( pl.setParent ) == 'function' )
       {
         pl.setParent ( ppl ) ;
       }
    }
    this.pageletStack.push ( pl ) ;
  },
  popPagelet: function ( pl )
  {
    if ( ! this.pageletStack.length ) return ;
    this.pageletStack.length = this.pageletStack.length-1 ;
  },
  getPagelet: function ( name, methodName )
  {
    if ( ! this.pageletStack.length ) return null ;
    if ( ! methodName )
    {
      return this.pageletStack[this.pageletStack.length-1] ;
    }
    for ( var i = this.pageletStack.length-1 ; i >= 0 ; i-- )
    {
      var f = this.pageletStack[i][methodName] ;
      if ( typeof ( f ) == 'function' ) return this.pageletStack[i] ;
    }
    return null ;
  }
} ;

/**
 *  Global singleton <b>WM</b>
 *  @constructor
 */
var WindowManager = function()
{
  this.windows = [] ;
  this.savedWindowBounds = [] ;
};
WindowManager.prototype.getSavedWindowBounds = function ( winId )
{
  return this.savedWindowBounds[winId] ;
};
WindowManager.prototype.setSavedWindowBounds = function ( winId, bounds )
{
  this.savedWindowBounds[winId] = bounds ;
};
WindowManager.prototype.getWindows = function()
{
  return this.windows ;
};
WindowManager.prototype.getNumberOfWindows = function()
{
  return this.windows.length ;
};
WindowManager.prototype.addWindow = function ( window )
{
  this.windows.push ( window ) ;
};
WindowManager.prototype.openWindow = function ( name )
{
  var w = new TWindow ( name ) ;
  w.create() ;
  w.show() ;
  return w ;
};
WindowManager.prototype.closeWindow = function ( element )
{
  var w = this.getWindow ( element ) ;
  if ( w ) w.close() ;
};
WindowManager.prototype.getWindow = function ( id )
{
  if ( typeof ( id ) == 'string' )
  {
    var e = document.getElementById ( id ) ;
//TSys.logInternal = false ;
    for ( var i = 0 ; i < this.windows.length ; i++ )
    {
      if ( this.windows[i].getId() == id ) return this.windows[i] ;
      if ( this.windows[i].getName() == id ) return this.windows[i] ;
    }
    if ( e && e.jsPeer ) return e.jsPeer ;
    return ;
  }
  var w = null ;
  if ( typeof ( id ) == 'object' )
  {
    var ch = id ;
    while ( ch )
    {
      if ( ch.xPseudoTopWindow  )
      {
        w = ch.jsPeer ;
        break ;
      }
      ch = ch.parentNode ;
    }
  }
  return w ;
};
WindowManager.prototype.removeWindow = function ( ww )
{
  this.activeWindow = null ;
  for ( var i = 0 ; i < this.windows.length ; i++ )
  {
    var w = this.windows[i] ;
    if ( w === ww )
    {
      this.windows.splice ( i, 1 ) ;
      if ( this.windows.length > 0 )
      {
        this.toFront ( this.windows[this.windows.length-1] ) ;
      }
      break ;
    }
  }
};
WindowManager.prototype.getWindowFromPosition = function ( x, y )
{
  for ( var i = this.windows.length - 1 ; i >= 0 ; i-- )
  {
    var w = this.windows[i] ;
    if (  x > w.dom.offsetLeft
       && x < w.dom.offsetLeft + w.dom.offsetWidth
       && y > w.dom.offsetTop
       && y < w.dom.offsetTop + w.dom.offsetHeight
       )
    {
      return w ;
    }
    if ( w.isModal() ) break ;
  }
  return null ;
};
WindowManager.prototype.toFront = function ( w )
{
  if ( ! w.isModal() && w !== this.windows [ this.windows.length - 1 ]  )
  {
    for ( var i = 0 ; i < this.windows.length ; i++ )
    {
      if ( w === this.windows[i] )
      {
        this.windows.splice ( i, 1 ) ;
        this.windows.push ( w ) ;
        break ;
      }
    }
  }
  var zIndex = TGui.zIndexWindow ;
  var lastModalDiv = null ;
  this.activeWindow = null ;
  for ( var i = 0 ; i < this.windows.length ; i++ )
  {
    if ( this.windows[i].isAlwaysOnTop() )
    {
      this.windows[i].setZIndex ( TGui.zIndexWindowAlwaysOnTop ) ;
    }
    else
    {
      this.windows[i].setZIndex ( zIndex ) ;
    }
    if ( i == this.windows.length-1 )
    {
      this.windows[i]._setActivated ( true ) ;
      this.activeWindow = this.windows[i] ;
    }
    else this.windows[i]._setActivated ( false ) ;
    if ( this.windows[i].isModal() )
    {
      lastModalDiv = this.windows[i].mdiv ;
      lastModalDiv.style.visibility = "hidden" ;
      zIndex += 2 ;
    }
    else zIndex++ ;
  }
  if ( lastModalDiv ) lastModalDiv.style.visibility = "visible" ;
};
WindowManager.prototype.adjustMaximizedWindows = function()
{
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  for ( var i = 0 ; i < this.windows.length ; i++ )
  {
    var w = this.windows[i] ;
    if ( w && w.isMaximizedState )
    {
      if ( w.maximizedType == 1 )
      {
        w.setBounds ( 0, 0, browserWindowSize.width, browserWindowSize.height ) ;
      }
      else
      if ( w.maximizedType == 2 )
      {
        w.setBounds ( 0, w.normalBounds.y, browserWindowSize.width, w.normalBounds.height ) ;
      }
      else
      if ( w.maximizedType == 3 )
      {
        w.setBounds ( w.normalBounds.x, 0, w.normalBounds.width, browserWindowSize.height ) ;
      }
    }
    else
    {
      if ( w.dom.xConstraints ) w._pageResized() ;
    }
  }
};
WindowManager.prototype.closeAllWindows = function()
{
  for ( var i = 0 ; i < this.windows.length ; i++ )
  {
    var w = this.windows[i] ;
    if ( w ) w.closeImediately() ;
  }
  this.windows = [] ;
};
WindowManager.prototype.getTopWindow = function()
{
  if ( ! this.windows.length ) return ;
  return this.windows[this.windows.length-1] ;
};
var TWM = new WindowManager() ;

/**
 *  Global singleton <b>TGui</b>
 *  @constructor
 */
var TGuiClass = function()
{
  this.M_width  = 10 ;
  this.M_height = 14 ;
  this.BLANK_width  = 10 ;
  this.BLANK_height = 14 ;
  this.pushButtonMinWidth = 40 ;
  this.pushButtonContentMinHeight = 16 ;
  this.notebookButtonMinWidth = 40 ;
  this.notebookButtonContentMinHeight = 16 ;
  this.mainPadding = 8 ;

  this.zIndexWindow = 63001 ;
  this.zIndexWindowActive = 63002 ;
  this.zIndexMDivModalDialog = 64000 ;
  this.zIndexUserDialog = 64054 ;
  this.zIndexMDivUserDialog = 64050 ;
  this.zIndexWorkingPanel = 64061 ;
  this.zIndexMDivWorkingPanel = 64060 ;
  this.zIndexWindowAlwaysOnTop = 64062 ;
  this.zIndexDock = 64063 ;
  this.zIndexMenu = 64064 ;
  this.zIndexCalendar = 64065 ;
  this.zIndexTooltip = 64070 ;
  this.zIndexNote = 64070 ;
  this.zIndexDnD = 64071 ;

  this.currentZIndexModalDialog = this.zIndexMDivModalDialog ;

  this.guiElementClassNames = new Array() ;
  this.guiElementClassNames["ToolbarButton"] = true ;
  this.guiElementClassNames["ToolbarToggle"] = true ;
  this.guiElementClassNames["ToolbarButtonSmall"] = true ;
  this.guiElementClassNames["ToolbarToggleSmall"] = true ;
  this.guiElementClassNames["PushButton"] = true ;
  this.guiElementClassNames["NotebookButton"] = true ;
  this.guiElementClassNames["Label"] = true ;
  this.guiElementClassNames["TitleLabel"] = true ;
  this.guiElementClassNames["Checkbox"] = true ;
  this.guiElementClassNames["TextField"] = true ;
  this.guiElementClassNames["TextArea"] = true ;
  this.guiElementClassNames["Choice"] = true ;
  this.guiElementClassNames["List"] = true ;
  this.guiElementClassNames["Anchor"] = true ;
  this.guiElementClassNames["Tree"] = true ;
  this.guiElementClassNames["TTree"] = true ;

  this.lastTooltipClosedMillis = new Date().getTime() ;
  this.externalTagDefinition = [] ;
  this.logWindowId = "System.Log.Window.Id" ;
  this._loginEndListener = [] ;
  this._saved =
  {
    onselectstart: undefined,
    ondrag: undefined,
    selectablestate: undefined
  } ;
  this._orientationListener = [] ;
  this._dialogDecorator = null ;
  this._windowDecorator = null ;
  this._menuAnimated = false ;
  this._windowAnimated = false ;
  this._fullAnimated = false ;
};
TGuiClass.prototype.isMenuAnimated = function()
{
  return this._menuAnimated || this._fullAnimated ;
};
TGuiClass.prototype.isWindowAnimated = function()
{
  return this._windowAnimated || this._fullAnimated ;
};
TGuiClass.prototype.getMinPageSize = function()
{
  if ( ! this._minSize )
  {
    this._minSize = new TDimension() ;
  }
  if ( Tango.ua.mobile )
  {
    var bws = this.getBrowserWindowSize() ;
    if ( typeof ( TSys._fminPageWidthMobile ) == 'function' )
    {
      try
      {
        this._minSize.width = TSys._fminPageWidthMobile ( bws ) ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
        this._minSize.width = bws.width ;
      }
    }
    else
    if ( ! TSys._minPageWidthMobile )
    {
      this._minSize.width = bws.width ;
    }
    else
    {
      this._minSize.width = TSys._minPageWidthMobile ;
    }

    if ( typeof ( TSys._fminPageWidthMobile ) == 'function' )
    {
      try
      {
        this._minSize.height = TSys._fminPageHeightMobile ( bws ) ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
        this._minSize.height = 2 * bws.height ;
      }
    }
    else
    if ( ! TSys._minPageHeightMobile )
    {
      this._minSize.height = 2 * bws.height ;
    }
    else
    {
      this._minSize.height = TSys._minPageHeightMobile ;
    }
  }
  else
  {
    this._minSize.width = TSys._minPageWidth ;
    this._minSize.height = TSys._minPageHeight ;
  }
  return this._minSize ;
} ;
TGuiClass.prototype.addOrientationListener = function ( functionExecutor )
{
  this._orientationListener.push ( functionExecutor ) ;
};
TGuiClass.prototype.removeOrientationListener = function ( functionExecutor )
{
  for ( var i = 0 ; i < this._orientationListener.length ; i++ )
  {
    if ( functionExecutor === this._orientationListener[i] )
    {
      this._orientationListener.splice ( i, 1 ) ;
      break ;
    }
  }
};
TGuiClass.prototype._fireOrientationChanged = function()
{
  for ( var i = 0 ; i < this._orientationListener.length ; i++ )
  {
    try
    {
      this._orientationListener[i].execute() ;
    }
    catch ( exc )
    {
      TSys.log ( "" + exc ) ;
    }
  }
};
TGuiClass.prototype.setSelectable = function ( state )
{
  if ( ! state )
  {
    if ( document.onselectstart !== undefined )
    {
      if ( this._saved.onselectstart === undefined )
      {
        this._saved.onselectstart = document.onselectstart;
      }
      document.onselectstart = function () { return false; };
    }
    if ( document.ondrag !== undefined )
    {
      if ( this._saved.ondrag === undefined )
      {
        this._saved.ondrag = document.ondrag;
      }
      document.ondrag = function () { return false; };
    }
    return ;
  }
  if ( this._saved.onselectstart !== undefined )
  {
    document.onselectstart = this._saved.onselectstart;
  }
  if ( this._saved.ondrag !== undefined )
  {
    document.ondrag = this._saved.ondrag;
  }
};
TGuiClass.prototype.hasCanvas = function()
{
  if ( typeof ( this._hasCanvas ) == 'boolean' ) return this._hasCanvas ;
  var c = document.createElement ( "canvas" ) ;
  if ( c )
  {
    if ( c.getContext ) this._hasCanvas = true ;
  }
  else this._hasCanvas = false ;
  return this._hasCanvas ;
};
TGuiClass.prototype.log = function ( text )
{
  if ( this._creating_TLogWindow ) return ;
  this.getLogWindow().println ( text ) ;
};
TGuiClass.prototype.println = function ( text )
{
  this.getLogWindow().println ( text ) ;
};
TGuiClass.prototype.print = function ( text )
{
  this.getLogWindow().print ( text ) ;
};
TGuiClass.prototype.newLine = function()
{
  this.getLogWindow().newLine() ;
};
TGuiClass.prototype.getLogWindow = function()
{
  var lw = TWM.getWindow ( this.logWindowId ) ;
  if ( ! lw )
  {
    lw = new TLogWindow ( this.logWindowId ) ;
    lw.setAlwaysOnTop ( true ) ;
  }
  return lw ;
};
TGuiClass.prototype.addTagDefinition = function ( tagName, axlSource )
{
  this.externalTagDefinition[tagName] = axlSource ;
};
TGuiClass.prototype.getTagDefinition = function ( tagName )
{
  return this.externalTagDefinition[tagName] ;
};
TGuiClass.prototype.toggleCheckbox = function ( checkboxId )
{
  var e = document.getElementById ( checkboxId ) ;
  if ( e.disabled ) return ;
  if ( e.type == 'radio' )
  {
    if ( ! e.checked ) e.checked = true ;
  }
  else
  {
    e.checked = ! e.checked ;
  }
};
TGuiClass.prototype.setDialogBackgroundOpacity = function ( event )
{
  var e = new TEvent ( event ) ;
  var w = e.getWindow() ;
  var vals = e.getValues() ;
  var opacity = vals.getFloat ( "DialogBackgroundOpacity", 0.0 ) ;
  w.setBackgroundOpacity ( opacity ) ;
};
TGuiClass.prototype.preferencesCustomizeSave = function ( event )
{
  var e = new TEvent ( event ) ;
  var w = e.getWindow() ;
  var pOpts = TSys.getPreferenceOptions() ;
  pOpts.removeAllChildren() ;
  w.getValues(pOpts) ;
  w.close() ;
};
TGuiClass.prototype.preferencesCustomize = function ( event )
{
  var d = new TWindow ( "TDialog.Preferences.Customize" ) ;
  d.create() ;
  d.setValues ( TSys.getPreferenceOptions() ) ;
  d.show() ;
};
TGuiClass.prototype.getModalDialogZIndex = function()
{
  var z = this.currentZIndexModalDialog ;
  this.currentZIndexModalDialog++ ;
  return z ;
};
TGuiClass.prototype.releaseModalDialogZIndex = function()
{
  this.currentZIndexModalDialog-- ;
};
TGuiClass.prototype.createIframeWindow = function ( url, title, singleton, img )
{
  if ( ! title || String ( title ) == 'null' ) title = url ;
  var id = url.replace ( /\//g, '_' ).replace ( /:/g, '_' ).replace ( /\=/g, '_' ).replace ( /&/g, '_' ).replace ( /,/g, "_" ).replace ( /\?/g, "_" ) ;
  if ( singleton )
  {
    var w = this.getWindow ( id ) ;
    if ( w ) return w ;
  }
  if ( typeof ( img ) == "string" )
  {
    if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
    img = " img='" + img + "'" ;
  }
  else
  {
    img = "" ;
  }
  url = url.replace ( /&/g, "&amp;" ) ;
  var s = ""
        + "<xml>\n"
        + "  <Window resizable='true' title='" + title + "' id='" + id + "' " + img + " >\n"
        + "    <Container right='-0' bottom='-0' name='Form' style='width:500px;height:400px;' >\n"
        + "<iframe src='" + url + "' style='margin:0px;border:0px;' bottom='-0' right='-0'>\n"
        + "</iframe>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  var w = new TWindow ( dom ) ;
  w.create() ;
  w.show() ;
  return w ;
};
TGuiClass.prototype.selectOrAddMultiform = function ( multiformId, idToBeVisible, callback )
{
  var m = this.getPeerById ( multiformId ) ;
  if ( ! m ) return false ;
  var attributes = null ;
  return m.selectOrAdd ( idToBeVisible, attributes, null, callback ) ;
};
TGuiClass.prototype.selectMultiform = function ( multiformId, idToBeVisible )
{
  var m = this.getPeerById ( multiformId ) ;
  if ( ! m ) return false ;
  return m.select ( idToBeVisible ) ;
};
TGuiClass.prototype.getPeerById = function ( id )
{
  if ( typeof ( id ) != "string" )
  {
    throw "TGui.getPeerById(): Missing or invalid id: " + id ;
  }
  var e = document.getElementById ( id ) ;
  if ( ! e )
  {
//    TSys.log ( "TGui.getPeerById(): element for '" + id + "' not found." ) ;
    return null ;
  }
  var peer = e.jsPeer ;
  if ( ! peer )
  {
    if ( e.nodeName.toUpperCase() == 'IFRAME' && ! e.doNotTouch )
    {
      var doc = e.contentDocument;
      try
      {
        if ( ! doc ) doc = e.contentWindow.document;
        if ( doc && doc.body ) peer = doc.body.jsPeer ;
      }
      catch ( exc )
      {
        e.doNotTouch = true ;
      }
    }
  }
  if ( ! peer )
  {
    TSys.log ( "TGui.getPeerById(): element id='" + id + "' has no peer." ) ;
    return null ;
  }
  return peer ;
};
TGuiClass.prototype.getDragSource = function ( id )
{
  var e = null ;
  if ( typeof ( id ) == "string" )
  {
    e = document.getElementById ( id ) ;
  }
  else e = id ;
  if ( e ) return e.dndSource ;
  return ;
};
TGuiClass.prototype.getDropTarget = function ( id )
{
  var e = null ;
  if ( typeof ( id ) == "string" )
  {
    e = document.getElementById ( id ) ;
  }
  else e = id ;
  if ( e ) return e.dndTarget ;
  return ;
};
var TPersistentData = function ( baseXml )
{
  this.jsClassName = "TPersistentData" ;
  this.baseXml = baseXml ;
};
TPersistentData.prototype =
{
  isEmpty: function()
  {
    if ( ! this.baseXml ) return true ;
    return this.baseXml.isEmpty() ;
  },
  remove: function ( name )
  {
    var e = this.baseXml.getXml ( name ) ;
    if ( ! e ) return ;
    e.remove() ;
  },
  setValue: function ( name, value )
  {
    var e = this.baseXml.getXml ( name ) ;
    if ( e )
    {
      if ( value ) e.setContent ( value ) ;
      else         e.remove() ;
    }
    else this.baseXml.addDom ( name, value ) ;
  },
  getValue: function ( name )
  {
    if ( ! name ) return null ;
    if ( ! this.baseXml ) return null ;
    var e = this.baseXml.getXml ( name ) ;
    if ( ! e ) return null ;
    return e.getContent() ;
  },
  getElement: function ( path )
  {
    if ( ! path ) return null ;
    if ( ! this.baseXml ) return null ;
    return this.baseXml.getXml ( path ) ;
  },
  ensureXml: function ( path )
  {
    if ( ! path ) return null ;
    if ( ! this.baseXml ) return null ;
    return this.baseXml.ensureXml ( path ) ;
  },
  toString: function()
  {
    return "(" + this.jsClassName + ")\n"
         + String ( this.baseXml )
         ;
  }
} ;

TGuiClass.prototype.chooseTheme = function()
{
  new ACThemeChooser().openWindow() ;
};
TGuiClass.prototype.collectPersistentData = function()
{
  var elem = document.getElementsByTagName ( "body" )[0] ;
  this._collectPersistentData ( TSys.persistentData, elem, true ) ;
};
TGuiClass.prototype._collectPersistentData = function ( persistentData, elem, rootIsBody )
{
  if ( ! elem ) return ;
  if ( rootIsBody && elem.id === "System.Log.Window.Id" ) return ;
  var ch = elem.firstChild ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ; 
      continue ;
    }
  // this.logWindowId = "System.Log.Window.Id" ;
    if ( ch.id === "System.Log.Window.Id" )
    {
      ch = ch.nextSibling ; 
      continue ;
    }

    if ( ch.name && ch.xIsPersistent )
    {
      if (  ch.xClassName == "Date"
         || ch.xClassName == "DateTime"
         )
      {
        var ds = new TXml(ch).getDateStringFromDate ( ch ) ;
        persistentData.setValue ( ch.name, ds ) ;
        ch = ch.nextSibling ; 
        continue ;
      }
      if ( ch.type )
      {
        var val = null ;
        if ( ch.type == 'select-one' )
        {
          if ( TSys.isString ( ch.xdefault ) )
          {
            if ( ch.selectedIndex > 0 )
            {
              persistentData.setValue ( ch.name, "" + ch.selectedIndex ) ;
            }
            else
            {
              persistentData.remove ( ch.name ) ;
            }
          }
          else
          if ( ch.selectedIndex > 0 )
          {
            persistentData.setValue ( ch.name, "" + ch.selectedIndex ) ;
          }
          else
          {
            persistentData.remove ( ch.name ) ;
          }
        }
        else
        if ( ch.type == 'hidden' )
        {
//log ( ch.name + ": " + ch.value ) ;
        }
        else
        if ( ch.type == 'checkbox' )
        {
          if ( ch.checked ) persistentData.setValue ( ch.name, "checked" ) ;
          else              persistentData.remove ( ch.name ) ;
        }
        else
        if ( ch.type == 'radio' )
        {
          if ( ch.checked ) persistentData.setValue ( ch.name, "checked" ) ;
          else              persistentData.remove ( ch.name ) ;
        }
        else
        if ( ch.type == 'text' )
        {
//log ( ch.name + ": " + ch.value ) ;
          if ( ! ch.mandatoryTextDisplayed && ch.value && ch.value.length > 0 )
          {
            persistentData.setValue ( ch.name, ch.value ) ;
          }
          else
          {
            persistentData.remove ( ch.name ) ;
          }
        }
        else
        if ( ch.type == 'textarea' )
        {
          TSys.addPersistentData ( ch.name, ch.value ) ;
          if ( ch.value && ch.value.length > 0 )
          {
          }
        }
        ch = ch.nextSibling ; 
        continue ;
      }
    }
    if ( ch.nodeName.toUpperCase() == "TABLE" )
    {
      ch = ch.nextSibling ; 
      continue ;
    }
    if ( ! this.guiElementClassNames[ch.xClassName] )
    {
      if ( ch.firstChild ) this._collectPersistentData ( persistentData, ch ) ;
    }
    ch = ch.nextSibling ; 
  }
};
TGuiClass.prototype.setImageSrc = function ( elem, type, state, width, height )
{
  var url = this.buildThemeImageUrl ( type, state, width, height ) ;
  if ( ! url ) return ;
  elem.src = url ;
};
TGuiClass.prototype.buildThemeBackgroundImageUrl = function ( type, state, width, height )
{
  var url = this.buildThemeImageUrl ( type, state, width, height ) ;
  if ( ! url ) return ;
  return "url(" + url + ")" ;
};
TGuiClass.prototype.buildThemeImageUrl = function ( type, state, width, height )
{
  var src = Tango.getThemeImageSrc ( type, state ) ;
  if ( src == 'none' )
  {
    return ;
  }
  var w = parseInt ( width ) ;
  var h = parseInt ( height ) ;

  var url = TSys.getImageFactoryServletName()
          + "?theme=" + Tango.getThemeName()
          + "&type=" + type
          + ( typeof ( state ) == 'undefined' ? "&state=normal" : "&state=" + state )
          + ( isNaN ( w ) ? "" : "&width=" + w )
          + ( isNaN ( h ) ? "" : "&height=" + h )
          ;
  return url ;
};
TGuiClass.prototype.buildImageUrl = function ( file )
{
  if ( file.indexOf ( "/" ) < 0 ) file = "/img/" + file ;
  if ( file.charAt ( 0 ) != "/" ) file = "/" + file ;
  return TSys.getImageFactoryServletName() + file ;
};
TGuiClass.prototype.buildScaledImageUrl = function ( descriptor, filePath )
{
  if ( ! descriptor ) return null ;
  if ( typeof ( descriptor ) == 'string' )
  {
    descriptor = descriptor.trim() ;
    if ( descriptor.charAt ( 0 ) != "{" || descriptor.charAt ( descriptor.length - 1 ) != "}" ) return null ;
    descriptor = TSys.eval ( descriptor ) ;
  }
  if ( !filePath && descriptor.root ) filePath = descriptor.root ;
  if ( ! filePath ) filePath = "img" ;
  filePath = filePath.trim() ;
  if ( filePath.charAt ( 0 ) != "/" ) filePath = "/" + filePath ;
  var file = descriptor.src ;
  if ( ! file ) return null ;
  if ( file.indexOf ( "/" ) < 0 )
  {
    file = filePath + "/" + file ;
  }
  if ( file.charAt ( 0 ) != "/" ) file = "/" + file ;
  var url = TSys.getImageFactoryServletName() + file + "?type=scaledImage&" ;
  var str = "" ;
  var b = descriptor ;
  if ( descriptor.border ) b = descriptor.border ;
  if ( typeof ( b.top ) == 'number' ) { if ( str.length ) str += "&" ; str += "border-top=" + b.top ;}
  if ( typeof ( b.left ) == 'number' ) { if ( str.length ) str += "&" ; str += "border-left=" + b.left ;}
  if ( typeof ( b.bottom ) == 'number' ) { if ( str.length ) str += "&" ; str += "border-bottom=" + b.bottom ;}
  if ( typeof ( b.right ) == 'number' ) { if ( str.length ) str += "&" ; str += "border-right=" + b.right ;}
  if ( typeof ( descriptor.opacity ) == 'number' ) { if ( str.length ) str += "&" ; str += "opacity=" + descriptor.opacity ;}
  if ( typeof ( descriptor.reflection ) == 'boolean' ) { if ( str.length ) str += "&" ; str += "reflection=true" ;}
  if ( typeof ( descriptor.part ) == 'string' ) { if ( str.length ) str += "&" ; str += "part=" + descriptor.part ;}
  if ( typeof ( descriptor.width ) == 'number' ) { if ( str.length ) str += "&" ; str += "width=" + descriptor.width ;}
  if ( typeof ( descriptor.height ) == 'number' ) { if ( str.length ) str += "&" ; str += "height=" + descriptor.height ;}
  if ( typeof ( descriptor.disabled ) == 'boolean' ) { if ( str.length ) str += "&" ; str += "disabled=true" ;}
  if ( typeof ( descriptor.highlighted ) == 'boolean' ) { if ( str.length ) str += "&" ; str += "highlighted=true" ;}
  if ( typeof ( descriptor.high ) == 'boolean' ) { if ( str.length ) str += "&" ; str += "highlighted=true" ;}
  if ( typeof ( descriptor.script ) == 'string' ) { if ( str.length ) str += "&" ; str += "script=" + encodeURIComponent (descriptor.script) ;}
  if ( descriptor.parameter && typeof ( descriptor.parameter ) == 'object' )
  {
    for ( var key in descriptor.parameter )
    {
      var v = descriptor.parameter[key] ;
      if ( typeof ( v ) == 'string' || typeof ( v ) == 'number' || typeof ( v ) == 'boolean' )
      {
        if ( str.length ) str += "&" ;
	str += key + "=" + encodeURIComponent ( String ( v ) ) ;
      }
    }
  }
  url += str ;
  return url ;
};
TGuiClass.prototype.createOpacityStyleValue = function ( opacity )
{
  if ( isNaN ( opacity ) ) opacity = parseFloat ( opacity ) ;
  if ( isNaN ( opacity ) ) return 1 ;

  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 )
  {
    if ( opacity > 1.0 ) opacity /= 100.0 ;
    opacity = Math.max ( 0.1, opacity ) ;
    opacity = Math.min ( 1.0, opacity ) ;
    opacity = opacity * 100 ;
    return opacity.toFixed(0) ;
  }
  else
  {
    if ( opacity > 1.0 ) opacity /= 100.0 ;
    opacity = Math.max ( 0.0, opacity ) ;
    return Math.min ( 1.0, opacity ) ;
  }
};
TGuiClass.prototype.setOpacity = function ( elem, opacity )
{
  if ( isNaN ( opacity ) ) opacity = parseFloat ( opacity ) ;
  if ( isNaN ( opacity ) ) return ;

  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 )
  {
    if ( opacity > 1.0 ) opacity /= 100.0 ;
    opacity = Math.max ( 0.1, opacity ) ;
    opacity = Math.min ( 1.0, opacity ) ;
    opacity = opacity * 100 ;
    var str = opacity.toFixed(0) ;
    elem.style.filter = "alpha(opacity=" + str + ")" ;
  }
  else
  {
    if ( opacity > 1.0 ) opacity /= 100.0 ;
    opacity = Math.max ( 0.0, opacity ) ;
    opacity = Math.min ( 1.0, opacity ) ;
    elem.style.opacity = opacity ;
  }
};
function setButtonDecoration ( htmlElem, state, event )
{
  if ( TSys.finished ) return ;
  var width  = htmlElem.offsetWidth ;
  var height = htmlElem.offsetHeight ;
  var clazz = htmlElem.xClassName ;
  if ( ! clazz ) clazz = htmlElem.className ;
  if ( ! clazz ) clazz = "PushButton" ;
  if ( clazz == "Button" ) clazz = "PushButton" ;
  var ev ;
  if ( event )
  {
    ev = new TEvent ( event ) ;
    if ( event.type == 'mouseover' )
    {
      if ( htmlElem.xInside )
      {
        return ;
      }
    }
    if ( event.type == 'mouseout' )
    {
      if ( TGui.getBoundsOnPageOf(htmlElem).inside ( ev.getX(), ev.getY() ) )
      {
        return ;
      }
    }
  }
  if ( htmlElem.checked )
  {
    state = "checked" ;
  }
  else
  if ( htmlElem.checkable && ! state )
  {
    state = "normal" ;
  }
  var url = null ;

  if ( state !== "focused" )
  {
    htmlElem.xPressed = false ;
    htmlElem.xInside = false ;
  }
  if ( ev && TGui.getBoundsOnPageOf(htmlElem).inside ( ev.getX(), ev.getY() ) )
  {
    htmlElem.xInside = true ;
  }
  var pxml = null ;
  if (  clazz === "PushButton"
     || clazz === "ToolbarButton"
     || clazz === "ToolbarButtonSmall"
     || clazz === "ToolbarToggle"
     || clazz === "ToolbarToggleSmall"
     )
  {
    if ( htmlElem.disabled )
    {
      state = "disabled" ;
    }
    pxml = Tango.getThemeXml ( clazz ) ;
    if ( pxml && pxml.getBoolAttribute ( "pure-css", false ) )
    {
      var cl = clazz ;
      var usecl = pxml.getAttribute ( "use" ) ;
      if ( usecl ) cl = usecl ;
      var pxml2 = null ;
      if ( state != "focused" && htmlElem.defaultButton )
      {
        pxml2 = Tango.getThemeXml ( cl, "default" ) ;
      }
      if ( ! pxml2 ) pxml2 = Tango.getThemeXml ( cl, state ) ;
      var c = null ;
      if ( pxml2 ) c = pxml2.getAttribute ( "class" ) ;
      if ( c )
      {
        htmlElem.style.backgroundImage = "" ;
        htmlElem.className = c ;
      }
      return ;
    }
  }
  if ( state === "focused" )
  {
// if ( event ) log ( "event.type=" + event.type + ", state=" + state ) ;
    pxml = Tango.getThemeXml ( clazz, "focused" ) ;
    if ( pxml )
    {
      url = TGui.buildThemeImageUrl ( clazz, "focused", width, height ) ;
      if ( url )
      {
        htmlElem.style.backgroundImage = "url(" + url + ")" ;
      }
    }
    if ( clazz === "PushButton" )
    {
      htmlElem.className = "ThemePushButtonFocused" ;
    }
    return ;
  }

  if ( htmlElem.disabled )
  {
    htmlElem.className = "Theme" + clazz + "Disabled" ;
    state = "disabled" ;
    url = TGui.buildThemeBackgroundImageUrl ( clazz, state, width, height ) ;
    if ( htmlElem.eImg ) TGui.setOpacity ( htmlElem.eImg, 0.5 ) ;
    if ( htmlElem.eCloser ) TGui.setOpacity ( htmlElem.eCloser, 0.5 ) ;
  }
  else
  {
    var st = state ;
    if ( htmlElem.defaultButton && st != "pressed" && st != 'disabled' && st != 'inside' )
    {
      st = "focused" ;
      var txml = Tango.getThemeXml ( "PushButton", "default" ) ;
      if ( ! txml )
      {
        url = TGui.buildThemeImageUrl ( clazz, "inside", width, height ) ;
        if ( url ) url = "url(" + url + ")" ;
      }
      else
      {
        url = TGui.buildThemeBackgroundImageUrl ( clazz, "default", width, height ) ;
      }
    }
    else
    {
      url = TGui.buildThemeBackgroundImageUrl ( clazz, st, width, height ) ;
    }
    if ( st == "focused" )  htmlElem.className = "Theme" + clazz + "Focused" ;
    else
    if ( st == "inside" )  htmlElem.className = "Theme" + clazz + "Inside" ;
    else
    if ( st == "pressed" ) htmlElem.className = "Theme" + clazz + "Pressed" ;
    else
    if ( st == "checked" ) htmlElem.className = "Theme" + clazz + "Checked" ;
    else
    if ( st == "disabled" ) htmlElem.className = "Theme" + clazz + "Disabled" ;
    else
    if ( st == "blur" ) htmlElem.className = "ThemePushButton" ;
    else                htmlElem.className = "Theme" + clazz ;

    if ( event && event.type == "mouseup" )
    {
      TGui.lastMouseupButton = htmlElem ;
    }
    else
    {
      TGui.lastMouseupButton = undefined ;
    }
    if ( htmlElem.eImg )
    {
      if ( state == "disabled" ) TGui.setOpacity ( htmlElem.eImg, 0.5 ) ;
      else                       TGui.setOpacity ( htmlElem.eImg, 1.0 ) ;
    }
    if ( htmlElem.eCloser )
    {
      if ( state == "disabled" ) TGui.setOpacity ( htmlElem.eCloser, 0.5 ) ;
      else                       TGui.setOpacity ( htmlElem.eCloser, 1.0 ) ;
    }
    if ( st == "inside" ) htmlElem.xInside = true ;
    if ( st == "pressed" ) htmlElem.xPressed = true ;
  }
  if ( htmlElem.xThemeStyle )
  {
    var ts = htmlElem.xThemeStyle ;
		var y = 0 ;
    if ( state == 'pressed' )
    {
      if ( htmlElem.eTxt )
      {
        htmlElem.eTxt.style.top = ( ts.txtY + ts.shiftY ) + "px" ;
        htmlElem.eTxt.style.left = ( ts.txtX + ts.shiftX ) + "px" ;
      }
      if ( htmlElem.eImg )
      {
        htmlElem.eImg.style.top = ( ts.imgY + ts.shiftY ) + "px" ;
        htmlElem.eImg.style.left = ( ts.imgX + ts.shiftX ) + "px" ;
      }
      if ( htmlElem.eCloser )
      {
        htmlElem.eCloser.style.top = ( ts.closerY + ts.shiftY ) + "px" ;
        htmlElem.eCloser.style.left = ( ts.closerX + ts.shiftX ) + "px" ;
      }
    }
    else
    {
      if ( htmlElem.eTxt )
      {
        htmlElem.eTxt.style.top = ts.txtY + "px" ;
        htmlElem.eTxt.style.left = ( ts.txtX ) + "px" ;
      }
      if ( htmlElem.eImg )
      {
        htmlElem.eImg.style.top = ( ts.imgY ) + "px" ;
        htmlElem.eImg.style.left = ( ts.imgX ) + "px" ;
      }
      if ( htmlElem.eCloser )
      {
        htmlElem.eCloser.style.top = ( ts.closerY ) + "px" ;
        htmlElem.eCloser.style.left = ( ts.closerX ) + "px" ;
      }
    }
  }
  if ( Tango.ua.useGenericButtons )
  {
    if ( document.activeElement == htmlElem )
    {
      if ( event && event.type == 'mouseout' )
      {
        TGlobalEventHandler._onfocus ( event, true ) ;
        return ;
      }
    }
  }
  if ( url ) htmlElem.style.backgroundImage = url ;
}
TGuiClass.prototype.getContainerFromEvent = function ( event )
{
  var p = this.getContainerDomFromEvent ( event ) ;
  if ( p ) return new TContainer ( p ) ;
  return null ;
};
TGuiClass.prototype.getContainerXml = function ( event )
{
  var p = this.getContainerDomFromEvent ( event ) ;
  if ( p ) return new TXml ( p ) ;
  return null ;
};
TGuiClass.prototype.getWindow = function ( id )
{
  return TWM.getWindow ( id ) ;
};
TGuiClass.prototype.openWindow = function ( name )
{
  return TWM.openWindow ( name ) ;
};
TGuiClass.prototype.closeWindow = function ( event )
{
  this.closeTopWindow ( event ) ;
};
TGuiClass.prototype.closeTopWindow = function ( event )
{
  if ( ! event ) return ;
  if ( event.type )
  {
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    TWM.closeWindow ( src ) ;
    return ;
  }
  if ( typeof ( event.getSource ) == 'function' )
  {
    var src = event.getSource() ;
    TWM.closeWindow ( src ) ;
    return ;
  }
  if ( event.nodeType && event.nodeName )
  {
    var src = event ;
    TWM.closeWindow ( src ) ;
  }
};
TGuiClass.prototype.getContainerDomFromEvent = function ( event, ignoreName )
{
  var p = null ;
  if ( event instanceof TEvent )
  {
    p = event.getSource() ;
  }
  else
  {
    var ev = new TEvent ( event ) ;
    p = ev.getSource() ;
  }
  return this.getContainerDomFromElement ( p, ignoreName ) ;
};
TGuiClass.prototype.getContainerDomFromElement = function ( p, ignoreName )
{
  var name = null ;
  if ( typeof ( ignoreName ) == 'boolean' ) ignoreName = true ;
  else
  if ( typeof ( ignoreName ) == 'string' ) { name = ignoreName ; ignoreName = false ; }
  while ( p )
  {
    if ( p.xClassName == 'Window' ) return p ;
    if (  p.xClassName == 'Container'
       || p.xClassName == 'MultiformBody'
       || p.xClassName == 'NotebookBody'
       )
    {
      if ( ignoreName ) return p ;
      if ( name )
      {
        if ( name == p.name ) return p ;
        p = p.parentNode ;
        continue ;
      }
      if ( p.name ) return p ;
    } 
    if ( p.nodeName == 'BODY' ) break ;
    p = p.parentNode ;
    if ( ! p ) break ;
    if ( p.nodeName == 'BODY' ) break ;
  }
  return p ;
};
TGuiClass.prototype.getBackground = function()
{
  return this.getComputedStyle ( document.getElementsByTagName ( "body" )[0], "background-color" ) ;

};
TGuiClass.prototype.getForeground = function()
{
  return this.getComputedStyle ( document.getElementsByTagName ( "body" )[0], "color" ) ;

};
var TCreateHtmlContext = function()
{
  this.jsClassName = "TCreateHtmlContext" ;
  this.listLabelState = 1 ;
  this.windowId = null ;
  this.onLoadList = [] ;
  this.pageletStack = [] ;
};
TCreateHtmlContext.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
TCreateHtmlContext.prototype.executeOnLoad = function()
{
  var ev = new TLoadEvent() ;
  for ( var i = 0 ; i < this.onLoadList.length ; i++ )
  {
    var fe = this.onLoadList[i] ;
    if ( fe.tempId ) ev.setHtmlSource ( document.getElementById ( fe.tempId ) ) ;
    else             ev.setHtmlSource ( null ) ;
    fe.tempId = null ;
    this.onLoadList[i].executeWithEvent ( ev ) ;
    this.onLoadList[i].flush() ;
  }
  this.onLoadList.length = 0 ;
};
TCreateHtmlContext.prototype.addOnLoad = function ( str, id, createHtmlContext )
{
  var fe = new TFunctionExecutor ( str, createHtmlContext ) ;
  if ( id )
  {
    fe.tempId = id ;
  }
  this.onLoadList.push ( fe ) ;
};
TCreateHtmlContext.prototype.pushPagelet = function ( pl )
{
  this.pageletStack.push ( pl ) ;
};
TCreateHtmlContext.prototype.popPagelet = function ( pl )
{
  if ( ! this.pageletStack.length ) return ;
  this.pageletStack.length = this.pageletStack.length-1 ;
};
TCreateHtmlContext.prototype.getPagelet = function ( name, methodName )
{
  if ( ! this.pageletStack.length ) return null ;
  if ( ! methodName )
  {
    return this.pageletStack[this.pageletStack.length-1] ;
  }
  for ( var i = this.pageletStack.length-1 ; i >= 0 ; i-- )
  {
    var f = this.pageletStack[i][methodName] ;
    if ( typeof ( f ) == 'function' ) return this.pageletStack[i] ;
  }
  return null ;
};

TGuiClass.prototype.getMain = function()
{
  return this.Main ;
};
TGuiClass.prototype.getDesktopElement = function()
{
  if ( ! this.desktopElement )
  {
    if ( ! this.Main ) return document.body ;
    return this.getMain() ;
  }
  return this.desktopElement ;
};
TGuiClass.prototype.setDesktopElement = function ( desktopElement )
{
  if ( ! desktopElement )
  {
    this.desktopElement = undefined ;
    return ;
  }
  if ( typeof ( desktopElement ) == 'string' )
  {
    this.desktopElement = document.getElementById ( desktopElement ) ;
  }
  else
  if ( typeof ( desktopElement ) == 'object' && typeof ( desktopElement.nodeType ) == 'number' )
  {
    this.desktopElement = desktopElement ;
  }
};
TGuiClass.prototype._installWindowFocusHandler = function()
{
  this._windowFocusHandlerInstalled = true ;
//  document.getElementsByTagName ( "body" )[0].onfocus = function ( event )
  window.onfocus = function ( event )
  {
//log ( "--------window.onfocus---------" ) ;
  } ;
  window.onblur = function ( event )
  {
//log ( "--------window.onblur---------" ) ;
  } ;
} ;
TGuiClass.prototype.createHtmlElements = function ( xmlDom )
{
  if ( ! this._windowFocusHandlerInstalled )
  {
    this._installWindowFocusHandler() ;
  }
  if ( ! Tango.isThemeCssLoaded() )
  {
    var wc = TSys.getWebConfig() ;
		var thiz = this ;
    var dtn = Tango.getThemeName() ;
		if ( dtn == 'default' ) dtn = wc.getDefaultThemeName() ;
    TSys.setTheme ( dtn ) ;
		thiz.__createHtmlElements ( xmlDom ) ;
		/*
    TSys.setTheme ( dtn, function()
		{
			thiz.__createHtmlElements ( xmlDom ) ;
		}	) ;
		*/
  }
	else
	{
  	this.__createHtmlElements ( xmlDom ) ;
	}
} ;
TGuiClass.prototype.__createHtmlElements = function ( xmlDom )
{
  var titleConstraints = null ;
  var menubarConstraints = null ;
  var toolbarConstraints = null ;

  var sHtml = "" ;
  var xml = new TXml ( xmlDom ) ;
  var title = xml.getDom ( "Title" ) ;
  if ( title ) //&& title.firstChild )
  {
    var style = title.getAttribute ( "style" ) ;
    if ( style && style.indexOf ( "right" ) >= 0 )
    {
      var aResult = this.parseStyle ( style, "right" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        toolbarConstraints = new TConstraints() ;
        toolbarConstraints.parseRight ( aResult[1] ) ;
      }
    }
    sHtml += "<div id='Title' class='ThemeTitle' " ;
    if ( style ) sHtml += "style='" + style + ";position:absolute;padding:0px;'" ;
    else         sHtml += "style='position:absolute;padding:0px;'" ;
    sHtml += " ></div>\n" ;
  }
  else
  {
    title = null ;
  }

  var menubar = xml.getDom ( "Menubar" ) ;
  if ( menubar && menubar.firstChild )
  {
    sHtml += "<div id='Menubar' class='ThemeMenubar' " ;
    var style = menubar.getAttribute ( "style" ) ;
    if ( style && style.indexOf ( "right" ) >= 0 )
    {
      var aResult = this.parseStyle ( style, "right" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        menubarConstraints = new TConstraints() ;
        menubarConstraints.parseRight ( aResult[1] ) ;
      }
    }
    if ( style ) sHtml += "style='" + style + "'" ;
    sHtml += " ></div>\n" ;
  }
  else
  {
    menubar = null ;
  }

  var toolbar = xml.getDom ( "Toolbar" ) ;
  if ( toolbar )
  {
    var style = toolbar.getAttribute ( "style" ) ;
    if ( style && style.indexOf ( "right" ) >= 0 )
    {
      var aResult = this.parseStyle ( style, "right" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        toolbarConstraints = new TConstraints() ;
        toolbarConstraints.parseRight ( aResult[1] ) ;
      }
    }
    sHtml += "<div id='Toolbar' class='ThemeToolbar' " ;
    if ( style ) sHtml += "style='" + style + ";position:absolute;'" ;
    else         sHtml += "style='position:absolute;'" ;
    sHtml += " ></div>\n" ;
  }
  var main = xml.getDom ( "main" ) ;
  if ( main )
  {
    sHtml += "<div id='Main' class='Main' style='left:0px;padding:4px;width:99%;' ></div >\n" ;
  }
  var body = document.getElementsByTagName ( "body" )[0] ;
  if ( Tango.ua.mobile )
  {
    body.className = "ThemeMobileBody" ;
  }
  else
  {
    body.className = "ThemeBody" ;
  }
  body.xClassName = "Body" ;
  body.innerHTML = sHtml ;
  body.style.padding = "0px" ;
  body.style.margin = "0px" ;

  var span = document.createElement ( "span" ) ;
  var tn = document.createTextNode ( "M" ) ;
  span.style.padding = "0px" ;
  span.style.margin = "0px" ;
  span.appendChild ( tn ) ;
  body.appendChild ( span ) ;
  
  this.M_width = span.offsetWidth ;
  this.M_height = span.offsetHeight ;

  span.innerHTML = "&nbsp;" ;

  this.BLANK_width = span.offsetWidth ;
  this.BLANK_height = span.offsetHeight ;

  body.removeChild ( span ) ;

  var yPos = 0 ;
  var ctx = new TCreateHtmlContext() ;
  if ( title )
  {
    var xElements = new TXEnum ( title ) ;
    var externalAttributes = new Array() ;
    var sHtml = this.createHtmlContainer ( xElements, externalAttributes, ctx ) ; // executeOnLoad DONE
    var e = document.getElementById ( "Title" ) ;
    this.Title = e ;
    e.style.position = "absolute" ;
    e.style.top = yPos + "px" ;
    if ( titleConstraints ) e.xConstraints = titleConstraints ;
    if ( this.getComputedStyleInt ( e, "left", -1 ) <= 0 ) e.style.left = "0px" ;
    e.className = "ThemeTitle" ;
    e.xClassName = "Title" ;
    e.innerHTML = sHtml ;
    var id = title.getAttribute ( "id" ) ;
    if ( ! id ) id = TSys.getTempId() ;
    var onload = title.getAttribute ( "onload" ) ;
    if ( onload ) ctx.addOnLoad ( onload, id ) ;

    var dim = this.layout ( e, externalAttributes ) ;
    var h = dim.height ;
    var hh = TGui.getComputedStyleInt ( e, "height", 0 ) ;
    hh += TGui.getComputedStyleInt ( e, "margin-bottom", 0 ) ;
    hh += TGui.getComputedStyleInt ( e, "margin-top", 0 ) ;
    e.style.height = hh + "px" ;
    yPos = hh ; // e.offsetHeight ;
  }
  if ( menubar )
  {
    var layoutContext = new LayoutContext() ;
    var e = document.getElementById ( "Menubar" ) ;
    TMenu = new Menubar ( new TXml ( menubar ), e ) ;
//    e.jsPeer = TMenu ;
    var externalAttributes = new Array() ;
    TMenu.layout ( e, externalAttributes, null, layoutContext ) ;
    this.Menubar = e ;
    if ( menubarConstraints ) e.xConstraints = menubarConstraints ;
    if ( this.getComputedStyleInt ( e, "left", -1 ) <= 0 ) e.style.left = "0px" ;
    e.style.position = "absolute" ;
    e.style.top = yPos + "px" ;
    yPos += e.offsetHeight ;
  }
  if ( toolbar )
  {
    var xElements = new TXEnum ( toolbar ) ;
    var externalAttributes = new Array() ;
    var sHtml = this.createHtmlContainer ( xElements, externalAttributes, ctx ) ; // executeOnLoad DONE
    var e = document.getElementById ( "Toolbar" ) ;
    if ( toolbarConstraints ) e.xConstraints = toolbarConstraints ;
    e.className = "ThemeToolbar" ;
    e.xClassName = "Toolbar" ;
    e.innerHTML = sHtml ;
    var id = toolbar.getAttribute ( "id" ) ;
    if ( ! id ) id = TSys.getTempId() ;
    var onload = toolbar.getAttribute ( "onload" ) ;
    if ( onload ) ctx.addOnLoad ( onload, id ) ;

    var dim = this.layout ( e, externalAttributes ) ;
    var h = dim.height - 4 - 4 ;
    e.style.height = h + "px" ;
    this.Toolbar = e ;
    if ( this.getComputedStyleInt ( e, "left", -1 ) <= 0 ) e.style.left = "0px" ;
    e.style.top = yPos + "px" ;
    yPos += e.offsetHeight ;
  }
  var focusElement = null ;
  var firstTextField = null ;
  var firstINPUT = null ;
  var firstBUTTON = null ;
  if ( main )
  {
    var xElements = new TXEnum ( main ) ;
    var style = main.getAttribute ( "style" ) ;
    var externalAttributes = new Array() ;
    var sHtml = this.createHtmlContainer ( xElements, externalAttributes, ctx ) ; // executeOnLoad DONE
    var e = document.getElementById ( "Main" ) ;
    e.className = "ThemeMain" ;
    e.xClassName = "Main" ;
//log ( sHtml ) ;
    e.innerHTML = sHtml ;
//xxx.xxx.xxx= 0.9 ;
    var id = main.getAttribute ( "id" ) ;
    if ( ! id ) id = TSys.getTempId() ;
    var onload = main.getAttribute ( "onload" ) ;
    if ( onload ) ctx.addOnLoad ( onload, id ) ;

    this.Main = e ;
//    if ( style && style.length > 0 ) this.Main.style = style ;
    this.Main.style.paddingTop = "0px" ;
    this.Main.style.paddingLeft = "0px" ;
    this.Main.style.paddingBottom = "0px" ;
    this.Main.style.paddingRight = "0px" ;
    this.Main.style.borderWidth = "0px" ;
    this.Main.style.margin = "0px" ;
    this.Main.style.position = "absolute" ;

    var dom = Tango.getThemeDom ( "Globals", "BackgroundImage" ) ;
    if ( dom )
    {
    }
    else
    {
      if ( style && style.indexOf ( "background-image" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "background-image" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          var url = aResult[1] ;
          this.Main.style.backgroundImage = url ;
        }
      }
      if ( style && style.indexOf ( "background-repeat" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "background-repeat" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          var url = aResult[1] ;
          this.Main.style.backgroundRepeat = url ;
        }
      }
      if ( style && style.indexOf ( "background-position" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "background-position" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          var url = aResult[1] ;
          this.Main.style.backgroundPosition = url ;
        }
      }
      if ( style && style.indexOf ( "background-size" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "background-size" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          var url = aResult[1] ;
          this.Main.style.WebkitBackgroundSize = url ;
          this.Main.style.OBackgroundSize = url ;
          this.Main.style.MozBackgroundSize = url ;
  //      this.Main.style.MsBackgroundSize = url ;
          this.Main.style.backgroundSize = url ;
        }
      }
    }

    var layoutContext = new LayoutContext() ;
    var dim = this.layout ( e, externalAttributes, null, layoutContext ) ;
    focusElement = layoutContext.focusElement ;
    firstTextField = layoutContext.firstTextField ;
    firstINPUT = layoutContext.firstINPUT ;
    firstBUTTON = layoutContext.firstBUTTON ;

    e.style.top = yPos + "px" ;
    var mainSize = this.calculateMainSize() ;
    this.Main.style.width  = mainSize.width + "px" ;
    this.Main.style.height = mainSize.height + "px" ;
    this.layoutConstraints ( this.Main, true ) ;

    yPos += e.offsetHeight ;
  }
  if ( ! focusElement ) focusElement = firstTextField ;
  if ( ! focusElement ) focusElement = firstINPUT ;
  if ( ! focusElement ) focusElement = firstBUTTON ;
  if ( focusElement )
  {
    var ch = focusElement ;
    var visible = true ;
    while ( ch )
    {
      if ( ch.nodeName.toUpperCase() == "BODY" ) break ;
      if ( ch.style.visibility == "hidden" )
      {
        var visible = false ;
        break ;
      }
      ch = ch.parentNode ;
    }
    if ( visible ) focusElement.focus() ;
  }

  resizeHandler ( null ) ;
  ctx.executeOnLoad() ;
};
TGuiClass.prototype.insertScalableBackgroundImage = function ( elem, type, preScaleWidth, preScaleHeight, elemBefore )
{
  var ch1 = elem.firstChild ;
  elem.xScalableBackgroundImage = true ;
  var eImg = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
  eImg.xImageType = type ;
  eImg.xLayoutIgnore = true ;

  if ( elemBefore )
  {
    elem.insertBefore ( eImg, elemBefore ) ;
  }
  else
  {
    if ( !ch1 ) elem.appendChild ( eImg ) ;
    else        elem.insertBefore ( eImg, ch1 ) ;
  }

  eImg.style.position = "absolute" ;
  eImg.style.top = "0px" ;
  eImg.style.left = "0px" ;
/*
  if ( preScaleWidth )
  {
    eImg.style.width = elem.offsetWidth + "px" ;
  }
  if ( preScaleHeight )
  {
    eImg.style.height = elem.offsetHeight + "px" ;
  }
*/
  eImg.xConstraints = new TConstraints() ;
  eImg.xConstraints.parseRight ( "-0" ) ;
  eImg.xConstraints.parseBottom ( "-0" ) ;
  eImg.src = TGui.buildThemeImageUrl ( type, "normal", preScaleWidth ? elem.offsetWidth : NaN, preScaleHeight ? elem.offsetHeight : NaN ) ;
  return eImg ;
};
function resizeHandler ( event, fireOrientationChanged )
{
  var mainSize = TGui.calculateMainSize() ;
  if ( ! mainSize ) return ;
  var orientationChanged = false ;
  if ( Tango.ua.mobile )
  {
    var bws = TGui.getBrowserWindowSize() ;
    if ( ! TGui._sizeAdjustmentInitialized )
    {
      TGui._sizeAdjustmentInitialized = true ;
    }
    if (  bws.width == TGui._previousBrowserWindowSize.height
       && bws.height == TGui._previousBrowserWindowSize.width
       )
    {
      orientationChanged = true ;
    }
    if ( TGui._previousWindowOrientation != window.orientation )
    {
      orientationChanged = true ;
    }
    TGui._previousBrowserWindowSize = bws ;
    TGui._previousWindowOrientation = window.orientation ;
  }
  if ( fireOrientationChanged ) orientationChanged = true ;
  var browserWindowSize = TGui.getAdjustedBrowserWindowSize() ;
//TSys.logInternal = false ;
  if ( TGui.Title  )
  {
    var w = TGui.getComputedStyleInt ( TGui.Title, "padding-left", 0 )
          + TGui.getComputedStyleInt ( TGui.Title, "padding-right", 0 )
          + TGui.getComputedStyleInt ( TGui.Title, "margin-left", 0 )
          + TGui.getComputedStyleInt ( TGui.Title, "margin-right", 0 )
          ;
    TGui.Title.style.width = ( browserWindowSize.width - w ) + "px" ;
  }
  if ( TGui.Menubar  )
  {
    TGui.Menubar.style.width = mainSize.width + "px" ;
  }
  if ( TGui.Toolbar )
  {
    var w = TGui.getComputedStyleInt ( TGui.Toolbar, "padding-left", 0 )
          + TGui.getComputedStyleInt ( TGui.Toolbar, "padding-right", 0 )
          + TGui.getComputedStyleInt ( TGui.Toolbar, "margin-left", 0 )
          + TGui.getComputedStyleInt ( TGui.Toolbar, "margin-right", 0 )
          + TGui.getComputedStyleInt ( TGui.Toolbar, "border-left", 0 )
          + TGui.getComputedStyleInt ( TGui.Toolbar, "border-right", 0 )
          ;

    TGui.Toolbar.style.width = ( browserWindowSize.width - w ) + "px" ;
  }

  var w = TGui.getComputedStyleInt ( TGui.Main, "padding-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "padding-right", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-right", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-right", 0 )
        ;
  var h = TGui.getComputedStyleInt ( TGui.Main, "padding-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "padding-bottom", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-bottom", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-bottom", 0 )
        ;

  var loc = TGui.getLocationOf ( TGui.Main ) ;
  TGui.Main.style.width  = ( browserWindowSize.width - w - 1 ) + "px" ;
  TGui.Main.style.height  = ( browserWindowSize.height - h - 1 - loc.y ) + "px" ;

  if ( ! TGui.firstLayoutDone )
  {
    var cs = null ;
    if ( TGui.Title )
    {
      if ( ! TGui.Title.xConstraints )
      {
        cs = new TConstraints() ;
        cs.parseRight ( "-0" ) ;
        TGui.Title.xConstraints = cs ;
      }
    }
    if ( TGui.Menubar )
    {
      if ( ! TGui.Menubar.xConstraints )
      {
        cs = new TConstraints() ;
        cs.parseRight ( "-0" ) ;
        TGui.Menubar.xConstraints = cs ;
      }
    }
    if ( TGui.Toolbar )
    {
      TGui.insertScalableBackgroundImage ( TGui.Toolbar, "Toolbar", true, false ) ;
      if ( ! TGui.Toolbar.xConstraints )
      {
        cs = new TConstraints() ;
        cs.parseRight ( "-0" ) ;
        TGui.Toolbar.xConstraints = cs ;
      }
    }
    if ( ! TGui.Main.xConstraints )
    {
      cs = new TConstraints() ;
      cs.parseRight ( "-0" ) ;
      cs.parseBottom ( "-1" ) ;
      TGui.Main.xConstraints = cs ;
    }
  }
  TGui.layoutConstraints ( document.body ) ;
/*
var mHight = TGui.Main.offsetHeight ;
log ( "mHight: " + mHight ) ;
for ( var ch = TGui.Main.firstChild ; ch ; ch = ch.nextSibling )
{
  var ymax = ch.offsetTop + ch.offsetHeight ;
log ( "--------------------" ) ;
log ( "ch.xClassName: " + ch.xClassName ) ;
log ( "ymax: " + ymax ) ;
log ( "ch.offsetTop: " + ch.offsetTop ) ;
log ( "ch.offsetHeight: " + ch.offsetHeight ) ;
}
*/

  TWM.adjustMaximizedWindows() ;
  var w = TWM.getWindows() ;
  for ( var i = 0 ; i < w.length ; i++ )
  {
    if ( w[i].mdiv )
    {
      w[i].mdiv.style.width = browserWindowSize.width + "px" ;
      w[i].mdiv.style.height = browserWindowSize.height + "px" ;
    }
  }
  if ( orientationChanged )
  {
    TGui._fireOrientationChanged() ;
  }
}
window.onresize = resizeHandler ;
window.onorientationchange = function(event)
{
  var orientation = window.orientation;
  resizeHandler ( event, true ) ;
};

TGuiClass.prototype.calculateMainSize = function()
{
  var browserWindowSize = TGui.getAdjustedBrowserWindowSize() ;
  var loc = this.getLocationOf ( this.Main ) ;
  if ( ! loc ) return null ;
  return new TDimension ( browserWindowSize.width - this.mainPadding - loc.x, browserWindowSize.height - this.mainPadding - loc.y ) ;
/*
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  var w = TGui.getComputedStyleInt ( TGui.Main, "padding-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "padding-right", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-right", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-left", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-right", 0 )
        ;
  var h = TGui.getComputedStyleInt ( TGui.Main, "padding-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "padding-bottom", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "margin-bottom", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-top", 0 )
        + TGui.getComputedStyleInt ( TGui.Main, "border-bottom", 0 )
        ;

  var loc = this.getLocationOf ( this.Main ) ;
  return new TDimension ( browserWindowSize.width - w - 1, browserWindowSize.height - h - 1 - loc.y ) ;
*/
};
TGuiClass.prototype.translateImageName = function ( img )
{
  if ( ! img ) return img ;
  var str = img.trim() ;
  if ( str[0] == "{" && str.charAt ( str.length-1 ) == "}" )
  {
    var o = TSys.eval ( str ) ;
    if ( typeof ( o.src ) == 'string' )
    {
      return TGui.buildScaledImageUrl ( o ) ;
    }
  }
  if ( img.indexOf ( "ImageFactory?" ) === 0 ) return img ;
  var feImg = TSys.tryFunctionExecutor ( img ) ;
  if ( feImg )
  {
//log ( img ) ;
    return feImg.execute() ;
  }
  if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
  if ( img.startsWith ( "Tango/" ) )
  {
    var aa = img.split ( "/" ) ;
    if ( aa.length == 3 )
    {
      return TGui.buildThemeImageUrl ( aa[1], aa[2], NaN, NaN ) ;
    }
  }
  return img ;
};
TGuiClass.prototype._addPeer = function ( a, xCont )
{
  var peer = xCont.getAttribute ( "peer" ) ;
  if ( peer )
  {
    var fe = TSys.tryFunctionExecutor ( peer, new TXml ( xCont ) ) ;
    if ( ! fe ) return ;
    a["jsPeer"] = fe.execute ( xCont ) ;
    if ( ! a["jsPeer"] )
    {
      a["jsPeer"] = fe.object ;
      fe.flush() ;
      if ( ! a["jsPeer"] ) return ;
    }
    if ( typeof ( a["jsPeer"].isPagelet ) == 'function' )
    {
      a["pagelet"] = a["jsPeer"] ;
    }
  }
  var pagelet = xCont.getAttribute ( "pagelet" ) ;
  if ( pagelet )
  {
    var fe = TSys.tryFunctionExecutor ( pagelet, new TXml ( xCont ) ) ;
    if ( ! fe ) return ;
    a["jsPeer"] = fe.execute ( xCont ) ;
    if ( ! a["jsPeer"] )
    {
      a["jsPeer"] = fe.object ;
      fe.flush() ;
      if ( ! a["jsPeer"] ) return ;
    }
    if ( a["jsPeer"] && typeof ( a["jsPeer"] ) == 'object' )
    {
      if ( typeof ( a["jsPeer"].isPagelet ) != 'function' )
      {
        a["jsPeer"].isPagelet = function() { return true; } ;
      }
      a["pagelet"] = a["jsPeer"] ;
    }
  }
};
TGuiClass.prototype._addPeerFromString = function ( a, str, xElem )
{
  var fe = TSys.tryFunctionExecutor ( str, new TXml ( xElem ) ) ;
  if ( ! fe ) return ;
  a["jsPeer"] = fe.execute ( xElem ) ;
  if ( ! a["jsPeer"] )
  {
    a["jsPeer"] = fe.object ;
    fe.flush() ;
    if ( ! a["jsPeer"] ) return ;
  }
  if ( a["jsPeer"] && typeof ( a["jsPeer"] ) == 'object' )
  {
    if ( typeof ( a["jsPeer"].isPagelet ) != 'function' )
    {
      a["jsPeer"].isPagelet = function() { return true; } ;
    }
    a["pagelet"] = a["jsPeer"] ;
  }
};
TGuiClass.prototype.createHtmlContainer = function ( xElements, externalAttributes, ctx, extImgArray, sHtmlArray  )
{
  var ctxIsLocal = false ;
  if ( ! ctx ) { ctxIsLocal = true ; ctx = new TCreateHtmlContext() ; }
  if ( ! extImgArray ) extImgArray = new Array() ;

  var returnString = false ;
  if ( ! sHtmlArray )
  {
    sHtmlArray = new Array() ;
    returnString = true ;
  }
  var pendingTab = ctx.pendingTab ;
  ctx.pendingTab = undefined ;
  var fontSize = this.getComputedStyleInt ( document.getElementsByTagName ( "body" )[0], "font-size", 0 ) ;
  if ( !isNaN ( fontSize ) && fontSize > 0 )
  {
    fontSize = "font-size:" + fontSize + "px;" ;
  }
  else
  {
    fontSize = "" ;
    var font = this.getComputedStyle ( document.getElementsByTagName ( "body" )[0], "font" ) ;
    if ( font ) fontSize = "font:" + font + ";" ;
  }
  while ( xElements.hasNext() )
  {
    var xElem = xElements.next() ;

    if ( xElem.nodeType == DOM_CDATA_SECTION_NODE )
    {
      sHtmlArray.push ( xElem.nodeValue ) ;
      ctx.xContentIsHtml = true ;
      continue ;
    }
    if ( xElem.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( xElem.getAttribute ( "ignore" ) )
    {
      continue ;
    }

    var tagName = xElem.nodeName ;
    var TAGNAME = tagName.toUpperCase() ;
    if ( tagName == "br" )
    {
      sHtmlArray.push ( "<br/>" ) ;
      continue ;
    }
    if ( tagName == "tab" )
    {
      pendingTab = new Array() ;
      var name = xElem.getAttribute ( "name" ) ;
      if ( name ) pendingTab["name"] = name ;
      var x = xElem.getAttribute ( "x" ) ;
      var X = xElem.getAttribute ( "X" ) ;
      if ( x )
      {
        if ( x.indexOf ( "+" ) == 0 && x.length > 1 )
        {
          x = x.substring ( 1 ) ;
          var ix = parseInt ( x ) ;
          if ( ix >= 0 )
          {
            pendingTab["relative"] = true ;
            pendingTab["x"] = ix ;
          }
        }
        else
        {
          var ix = parseInt ( x ) ;
          if ( ix >= 0 )
          {
            pendingTab["absolute"] = true ;
            pendingTab["x"] = ix ;
          }
        }
      }
      else
      if ( X )
      {
        if ( X.indexOf ( "+" ) == 0 && X.length > 1 )
        {
          X = X.substring ( 1 ) ;
          var ix = parseInt ( X ) ;
          if ( ix >= 0 )
          {
            pendingTab["relative"] = true ;
            pendingTab["X"] = ix ;
          }
        }
        else
        {
          var ix = parseInt ( X ) ;
          if ( ix >= 0 )
          {
            pendingTab["absolute"] = true ;
            pendingTab["X"] = ix ;
          }
        }
      }
      continue ;
    }
    if ( TAGNAME == "GROUP" )
    {
      var oldGroup = ctx.checkableGroup ;
      ctx.checkableGroup = new CheckableGroup ( xElem.getAttribute ( "name" ) ) ;
      this.createHtmlContainer ( new TXEnum ( xElem ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      ctx.checkableGroup = oldGroup ;
      continue ;
    }
    var a = new Array();
    var tempId = TSys.getTempId() ;
    externalAttributes[tempId] = a ;

    var id = xElem.getAttribute ( "id" ) ;
    clazz = xElem.getAttribute ( "class" ) ;
    if ( ! clazz || clazz.lenght == 0 )
    {
      clazz = tagName ;
    }
    var text = xElem.getAttribute ( "text" ) ;
    if ( text && text.indexOf ( '%' ) == 0 )
    {
      text = TSys.translate ( text ) ;
    }
    var title = xElem.getAttribute ( "title" ) ;
    var img     = xElem.getAttribute ( "img" ) ;
    if ( img )
    {
      img = this.translateImageName ( img ) ;
      var II = new Image() ;
      II.src = img ;
      extImgArray.push ( II ) ;
    }
    var xConstraints = null ;

    var onclick = xElem.getAttribute ( "onclick" ) ;
    a["hidden"] = xElem.getAttribute ( "hidden" ) == "true" ? true : false ;
    var ondblclick = xElem.getAttribute ( "ondblclick" ) ;
    var onchange = xElem.getAttribute ( "onchange" ) ;
    var onload = xElem.getAttribute ( "onload" ) ;
    var action = xElem.getAttribute ( "action" ) ;
    var onkeydown = xElem.getAttribute ( "onkeydown" ) ;
    var onkeyup = xElem.getAttribute ( "onkeyup" ) ;

    var delay = xElem.getAttribute ( "delay" ) ;
    if ( delay === "true" ) delay = 500 ;
    else delay = parseInt ( delay ) ;
    if ( ! isNaN ( delay ) ) a["delay"] = delay ; 

    var checkable = xElem.getAttribute ( "checkable" ) ;
    if ( checkable == "true" )
    {
      a["checkable"] = true ;
      if ( xElem.getAttribute ( "checked" ) == "true" ) a["checked"] = true ;
      if ( ctx.checkableGroup ) a["CheckableGroup"] = ctx.checkableGroup ;
    }

    var disabled = xElem.getAttribute ( "disabled" ) ;
    var readonly = xElem.getAttribute ( "readonly" ) ;
    if ( typeof ( readonly ) != 'string' )
    {
      var editable = xElem.getAttribute ( "editable" ) ;
      if ( String ( editable ) == 'false' ) readonly = true ;
    }
    if ( String ( disabled ) == 'true' ) a["disabled"] = true ;

    var xdefault = xElem.getAttribute ( "default" ) ;
    var xdefaultIsNull = null ;
    if ( xdefault == "null" )
    {
      a["xdefaultIsNull"] = true ;
      xdefault = null ;
    }
    else
    {
      if ( typeof ( xdefault ) == 'string' ) a["xdefault"] = xdefault ;
      else                                   xdefault = null ;
      xdefaultIsNull = xElem.getAttribute ( "defaultIsNull" ) ;
      if ( ! xdefaultIsNull ) xdefaultIsNull = xElem.getAttribute ( "default-is-null" ) ;
      if ( xdefaultIsNull == 'true' ) a["xdefaultIsNull"] = xdefaultIsNull ;
    }

    var width = xElem.getAttribute ( "width" ) ;
    this._addPeer ( a, xElem ) ;
    if (  tagName == "Container" )
		{
			if ( ! a["jsPeer"] )
			{
      	if ( xElem.firstChild )
      	{
        	for ( var ch = xElem.firstChild ; ch ; ch = ch.nextSibling )
        	{
          	if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        		if ( ch.nodeName == "Script" )
        		{
        			if ( ch.firstChild.nodeType == DOM_CDATA_SECTION_NODE )
							{
            		var str = ch.firstChild.nodeValue ;
								this._addPeerFromString ( a, str, xElem ) ;
        			}
        		}
          	break ;
        	}
      	}
     }
		}
    var height = xElem.getAttribute ( "height" ) ;
    var right  = xElem.getAttribute ( "right" ) ;
    var center  = xElem.getAttribute ( "center" ) ;
    var bottom  = xElem.getAttribute ( "bottom" ) ;
    var extendedType  = xElem.getAttribute ( "extendedType" ) ;
    if ( extendedType ) a["extendedType"] = extendedType ;
    a["reverse"] = xElem.getAttribute ( "reverse" ) ;
    a["stacked"] = xElem.getAttribute ( "stacked" ) ;

    var popup = xElem.getAttribute ( "popup" ) ;
    if ( popup ) a["popup"] = new PopupMenuWrapper ( popup ) ;

    var style = xElem.getAttribute ( "xstyle" ) ;
    if ( ! style ) style = xElem.getAttribute ( "style" ) ;
    var overflowTooltip = false ;

    if ( typeof ( style ) == 'string' && style.length > 0 )
    {
      if ( style.indexOf ( "opacity" >= 0 ) )
      {
        var aResult = this.parseStyle ( style, "opacity" ) ;
        if ( aResult )
        {
          style = aResult[0] + "opacity:" + aResult[1] + ";" ;
        }
      }
      if ( style.indexOf ( "margin-right" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "margin-right" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          var npx = parseInt ( aResult[1] ) ;
          if ( ! isNaN ( npx ) )
          {
            a["marginRight"] = npx ;
          }
        }
      }
      if ( style.indexOf ( "attach-right" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "attach-right" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          if ( aResult[1] == "true" ) xConstraints.setRightAttachComponent() ;
        }
      }
      if ( style.indexOf ( "right" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "right" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          xConstraints.parseRight ( aResult[1] ) ;
        }
      }
      if ( style.indexOf ( "attach-bottom" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "attach-bottom" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          if ( aResult[1] == "true" ) xConstraints.setBottomAttachComponent() ;
        }
      }
      if ( style.indexOf ( "bottom" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "bottom" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          xConstraints.parseBottom ( aResult[1] ) ;
        }
      }
      if ( style.indexOf ( "align-center" ) >= 0 )
      {
        var aResult = this.parseStyle ( style, "align-center" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          xConstraints.parseCenter ( aResult[1] ) ;
        }
      }
      if ( style.indexOf ( "overflow" ) >= 0 && style.indexOf ( "tooltip" ) > style.indexOf ( "overflow" ) )
      {
        var aResult = this.parseStyle ( style, "overflow" ) ;
        if ( aResult )
        {
          if ( aResult[1] === 'tooltip' )
          {
            overflowTooltip = true ;
            style = aResult[0] ;
          }
        }
      }
    }
    if ( ! style ) style = null ;
    else
    if ( style.charAt ( style.length - 1 ) != ';' ) style += ';' ;

    if ( typeof ( center ) == 'string' && center.length > 0 )
    {
      if ( ! xConstraints )
      {
        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
      }
      xConstraints.parseCenter ( center ) ;
    }
    if ( typeof ( right ) == 'string' && right.length > 0 )
    {
      if ( ! xConstraints )
      {
        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
      }
      xConstraints.parseRight ( right ) ;
    }
    if ( typeof ( bottom ) == 'string' && bottom.length > 0 )
    {
      if ( ! xConstraints )
      {
        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
      }
      xConstraints.parseBottom ( bottom ) ;
    }
    if ( xElem.getAttribute ( "bottomAttachComponent" ) )
    {
      if ( ! xConstraints )
      {
        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
      }
      xConstraints.setBottomAttachComponent() ;
    }
    if ( xElem.getAttribute ( "rightAttachComponent" ) )
    {
      if ( ! xConstraints )
      {
        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
      }
      xConstraints.setRightAttachComponent() ;
    }

    var name = xElem.getAttribute ( "name" ) ;
    var path = xElem.getAttribute ( "path" ) ;
    var value = xElem.getAttribute ( "value" ) ;
    var tooltip = xElem.getAttribute ( "tooltip" ) ;
    if ( Tango.ua.mobile ) tooltip = null ;
    var note = xElem.getAttribute ( "note" ) ;
    if ( Tango.ua.mobile ) note = null ;
    var mandatory = xElem.getAttribute ( "mandatory" ) ;
    if ( ! mandatory ) mandatory = xElem.getAttribute ( "placeholder" ) ;
    if ( ! mandatory ) mandatory = xElem.getAttribute ( "required" ) ;
    var valueHook = xElem.getAttribute ( "value-hook" ) ;
    if ( valueHook ) a["valueHook"] = valueHook ;
    var mandatoryCheck = xElem.getAttribute ( "mandatory-check" ) ;
    var mandatoryStyleName = xElem.getAttribute ( "mandatory-style-name" ) ;
    var mandatoryBlurStyleName = xElem.getAttribute ( "mandatory-blur-style-name" ) ;
    var normalStyleName = xElem.getAttribute ( "normal-style-name" ) ;
    if ( ! mandatory || mandatory == "false" ) mandatory = null ;

    if ( tooltip == 'mandatory' ) tooltip = mandatory ;
    if ( note == 'mandatory' ) note = mandatory ;

    var autofocus = xElem.getAttribute ( "autofocus" ) ;
    /*
     * <input type="text" pattern="[a-z]{3}[0-9]{3}"> TODO
     */

    if ( ! autofocus ) autofocus = xElem.getAttribute ( "focus" ) ;

    if ( xElem.firstChild )
    {
      for ( var ch = xElem.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ! Tango.ua.mobile )
        {
          if ( ch.nodeName == "Tooltip" )
          {
            tooltip = ch.firstChild.nodeValue ;
            continue ;
          }
          if ( ch.nodeName == "Note" )
          {
            note = ch.firstChild.nodeValue ;
            continue ;
          }
        }
        if ( ch.nodeName == "Mappings" )
        {
          var en = new TXEnum ( ch, "option" ) ;
          var xMappings = null ;
          while ( en.hasNext() )
          {
            var d = new TXml ( en.next() ) ;
            var v = d.getAttribute ( "value" ) ;
            var n = d.getContent() ;
            if ( ! v ) v = n ;
            if ( ! n ) continue ;
            if ( ! xMappings ) xMappings = [] ;
            xMappings[v] = n ;
          }
          if ( xMappings ) a["xMappings"] = xMappings ;
          continue ;
        }
        if ( ch.nodeName == "Properties" )
        {
          var xProperties = null ;
          for ( var prop = ch.firstChild ; prop ; prop = prop.nextSibling )
          {
            if ( prop.nodeType != DOM_ELEMENT_NODE ) continue ;
            var n = prop.tagName ;
            var v = "" ;
            if ( prop.firstChild )
            {
              if ( typeof ( prop.firstChild.nodeValue ) != 'undefined' ) v = prop.firstChild.nodeValue ;
            }
            if ( ! xProperties ) xProperties = [] ;
            xProperties[n] = v ;
          }
          if ( xProperties ) a["xProperties"] = xProperties ;
          continue ;
        }
        if ( ch.nodeName == "PopupMenu" )
        {
          a["popup"] = new PopupMenuWrapper ( new TXml ( xElem ) ) ;
          continue ;
        }
        if ( ch.nodeType == DOM_ELEMENT_NODE )
        {
          break ;
        }
      }
    }
    if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
    if ( id )
    {
      a["orgId"] = id ;
      if ( onload ) ctx.addOnLoad ( onload, id, ctx ) ;
    }
    else
    {
      if ( onload )
      {
        ctx.addOnLoad ( onload, tempId, ctx ) ;
      }
    }
    if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
    if ( path ) a["path"] = path ;
    if ( name ) a["name"] = name ;
    if ( tooltip ) a["tooltip"] = tooltip ;
    if ( note ) a["note"] = note ;
    if ( autofocus ) a["autofocus"] = autofocus ;
    var type = xElem.getAttribute ( "type" ) ;
    var xsi_type = xElem.getAttribute ( "xsi-type" ) ;

    if ( type == 'date' || type == 'datetime' )
    {
      xsi_type = "xsd-" + type ; type = null ;
    }
    if ( xsi_type )
    {
      a["xsi-type"] = xsi_type ;
    }

    if ( pendingTab )
    {
      a["pendingTab"] = pendingTab ;
      pendingTab = null ;
    }
    var resettable = xElem.getAttribute ( "reset" ) ;
    if ( resettable )
    {
      if ( resettable == "true" ) a["resettable"] = true ;
			else
      if ( resettable == "false" ) a["resettable"] = false ;
    }
    var resetIndex = xElem.getAttribute ( "reset-index" ) ;
    if ( resetIndex )
    {
      var n = parseInt ( resetIndex ) ;
      if ( ! isNaN ( n ) )
      {
        a["resetIndex"] = n ;
      }
    }
    if ( action ) a["action"] = action ;
    if ( onkeyup ) a["onkeyup"] = onkeyup ;
    if ( onkeydown ) a["onkeydown"] = onkeydown ;
    var persistent = xElem.getAttribute ( "persistent" ) ;
    if ( persistent )
    {
      a["persistent"] = true ;
    }
    var dragable = xElem.getAttribute ( "dragable" ) ;
    if ( dragable == "true" )
    {
      a["dragable"] = true ;
    }
    var dragsource = xElem.getAttribute ( "dragsource" ) ;
    if ( dragsource )
    {
      a["dragsource"] = dragsource ;
    }
    var droptarget = xElem.getAttribute ( "droptarget" ) ;
    if ( droptarget )
    {
      a["droptarget"] = droptarget ;
    }
    var desktop = xElem.getAttribute ( "desktop" ) ;
    if ( desktop == "true" )
    {
      a["desktop"] = desktop ;
    }

    var minlength = xElem.getAttribute ( "minlength" ) ;
    if ( minlength )
    {
      var n = parseInt ( minlength ) ;
      if ( ! isNaN ( n ) ) a["minlength"] = n ;
    }

    if ( ctx.currentPeer ) a["jsPeer"] = ctx.currentPeer ;
    ctx.currentPeer = null ;
    if ( TAGNAME == "GRID" )
    {
      a["xClassName"] = "Grid" ;
      var s = "<span" ;
      s += " class='ThemeContainer' id='" + tempId + "'" ;
      s += " style='position:absolute;padding:0px;" ;
      if ( style ) s += style ;
      s += "' >\n" ;
      sHtmlArray.push ( s ) ;
      var first = true ;
      var numberOfRows = 0 ;
      var maxNumberOfColumns = 0 ;
var i = 0 ;
      for ( var tr = xElem.firstChild ; tr ; tr = tr.nextSibling )
      {
        if ( tr.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( tr.nodeName.toUpperCase() != 'TR' ) continue ;
        numberOfRows++ ;
        if ( first ) first = false ;
        else sHtmlArray.push ( "<br/>\n" ) ;
        var numberOfColumns = 0 ;
        var tr_lastChild = tr.lastChild ;
        for ( ; tr_lastChild ; tr_lastChild = tr_lastChild.previousSibling )
        {
          if ( tr_lastChild.nodeType == DOM_ELEMENT_NODE ) break ;
        }
var j = 0 ;
        for ( var td = tr.firstChild ; td ; td = td.nextSibling )
        {
          if ( td.nodeType != DOM_ELEMENT_NODE ) continue ;
          if ( td.nodeName.toUpperCase() != 'TD' ) continue ;
          numberOfColumns++ ;
          var td_a = new Array() ;
          var td_tempId = TSys.getTempId() ;
          externalAttributes[td_tempId] = td_a ;
          var colspan = parseInt ( td.getAttribute ( "colspan" ) ) ;
          if ( ! isNaN ( colspan ) ) td_a["colspan"] = colspan ;

          td_a["xClassName"] = "Container" ;
//td_a["name"] = "span(" + i + "," + j + ")"
          var s = "<span" ;
          s += " class='ThemeContainer' id='" + td_tempId + "'" ;
          s += " style='position:absolute;padding:0px;margin:0px;" ;
          if ( td === tr_lastChild )
          {
            var xc = new TConstraints() ;
            td_a["Constraints"] = xc ;
            xc.parseRight ( "-0" ) ;
          }
          s += "' >\n" ;

          sHtmlArray.push ( s ) ;
          this.createHtmlContainer ( new TXEnum ( td ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
          sHtmlArray.push ( "</span>\n" ) ;
j++ ;
        }
        maxNumberOfColumns = Math.max ( maxNumberOfColumns, numberOfColumns ) ;
i++ ;
      }
      sHtmlArray.push ( "</span>\n" ) ;
      a["numberOfRows"] = numberOfRows ;
      a["maxNumberOfColumns"] = maxNumberOfColumns ;
      continue ;
    }
    // else
    // if ( tagName == "Tree" )
    // {
    //   clazz = "ThemeTreeContainer" ;
    //   var s = "<span" ;

    //   s += " class='" + clazz + "' id='" + tempId + "'" ;
    //   s += " style='position:absolute;overflow:auto;" ;
    //   if ( style ) s += style ;
    //   s += "' >\n" ;
    //   sHtmlArray.push ( s ) ;
    //   a["jsPeer"] = new TTree ( xElem ) ;
    //   a["xClassName"] = "Container" ;
    //   sHtmlArray.push ( "</span>\n" ) ;
    // }
    else
    if ( tagName == "Tree" )
    {
      clazz = "ThemeTableContainer" ;
      var s = "<span" ;

      s += " class='" + clazz + "' id='" + tempId + "'" ;
      s += " style='position:absolute;overflow:auto;" ;
      if ( style ) s += style ;
      s += "' >\n" ;
      sHtmlArray.push ( s ) ;
      a["jsPeer"] = new TTree ( xElem ) ;
      a["xClassName"] = "Container" ;
      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "Table" )
    {
      clazz = "ThemeTableContainer" ;
      var s = "<span" ;

      s += " class='" + clazz + "' id='" + tempId + "'" ;
//      s += " style='position:absolute;overflow:auto;"
      s += " style='position:absolute;" ;
      if ( style ) s += style ;
      s += "' >\n" ;
      sHtmlArray.push ( s ) ;
      a["jsPeer"] = new TTable ( xElem ) ;
      a["xClassName"] = "Container" ;
      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "Calendar" )
    {
//TODO: log ( "clazz: " + clazz ) ; clazz == "Table"
      clazz = "ThemeCalendar" ;
      var s = "<span" ;

      s += " class='" + clazz + "' id='" + tempId + "'" ;
      s += " style='position:absolute;" ;
      if ( style ) s += style ;
      s += "' >\n" ;
      sHtmlArray.push ( s ) ;
      a["jsPeer"] = new TCalendar ( xElem ) ;
      a["xClassName"] = "Calendar" ;
      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "ToolbarButton" )
    {
      if ( width )  width = parseInt ( width ) ;
      else          width = 32 ;
      if ( height ) height = parseInt ( height ) ;
      else          height = 32 ;

      var imgWidth = parseInt ( xElem.getAttribute ( "img-width" ) ) ;
      var imgHeight = parseInt ( xElem.getAttribute ( "img-height" ) ) ;
      if ( isNaN ( imgHeight ) ) imgHeight = imgWidth ;
      if ( isNaN ( imgWidth ) ) imgWidth = imgHeight ;
      var wh = "" ;
      if ( isNaN ( imgWidth ) ) { imgWidth = 16 ; imgHeight = 16 ; }
      if ( !isNaN ( imgWidth ) ) wh = "width='" + imgWidth + "px' height='" + imgHeight + "px'" ;

      var br = "<br/>" ;
      if ( xElem.getAttribute ( "text-align" ) == "right" ) br = "&nbsp;" ;
      var s = "" ;
      if ( img && text )
      {
        s = "<img src='" + img + "' " + wh + " class='ButtonImage' />" + br + "<span class='ButtonText' >" + text + "</span>" ;
      }
      else
      if ( img )
      {
        s = "<img src='" + img + "' " + wh + "  class='ButtonImage' />" ;
      }
      else
      if ( text )
      {
        s = "<span class='ButtonText' >" + text + "</span>" ;
      }
      if ( onclick ) a["onclick"] = onclick ;
      a["xClassName"] = "ToolbarButton" ;
      var s2 = "<div " ;
      if ( Tango.ua.realMobile )
      {
        s2 += " ontouchend='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " ontouchstart='javascript:setButtonDecoration(this,\"pressed\",event)'"
            ;
      }
      else
      {
        s2 += " onmouseover='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onmouseout='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " onmousedown='javascript:setButtonDecoration(this,\"pressed\",event)'"
            + " onmouseup='javascript:setButtonDecoration(this,\"inside\",event)'"
            ;
      }
      s2 += ( title ? " title='" + title + "' " : " " )
          + " id='" + tempId + "'"
          + " class='ThemeToolbarButton'"
          + " style='width:" + width + "px;height:" + height + "px;position:absolute;'"
          + " >" + s
          + "</div> "
          ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "ToolbarToggle" )
    {
      a["checkable"] = true ;
      a["value"] = xElem.getAttribute ( "value" ) ;
      var checked = xElem.getAttribute ( "checked" ) ;
      if ( checked == "true" ) a["checked"] = "true" ;
      if ( ctx.checkableGroup ) a["CheckableGroup"] = ctx.checkableGroup ;

      if ( width )  width = parseInt ( width ) ;
      else          width = 32 ;
      if ( height ) height = parseInt ( height ) ;
      else          height = 32 ;

      var imgWidth = parseInt ( xElem.getAttribute ( "img-width" ) ) ;
      var imgHeight = parseInt ( xElem.getAttribute ( "img-height" ) ) ;
      if ( isNaN ( imgHeight ) ) imgHeight = imgWidth ;
      if ( isNaN ( imgWidth ) ) imgWidth = imgHeight ;
      var wh = "" ;
      if ( isNaN ( imgWidth ) ) { imgWidth = 16 ; imgHeight = 16 ; }
      if ( !isNaN ( imgWidth ) ) wh = "width='" + imgWidth + "px' height='" + imgHeight + "px'" ;

      var br = "<br/>" ;
      if ( xElem.getAttribute ( "text-align" ) == "right" ) br = "&nbsp;" ;
      var s = "" ;
      if ( img && text )
      {
        s = "<img src='" + img + "' " + wh + " class='ButtonImage' />" + br + "<span class='ButtonText' >" + text + "</span>" ;
      }
      else
      if ( img )
      {
        s = "<img src='" + img + "' " + wh + " class='ButtonImage' />" ;
      }
      else
      if ( text )
      {
        s = "<span class='ButtonText' >" + text + "</span>" ;
      }
      if ( onclick ) a["onclick"] = onclick ;
      a["xClassName"] = "ToolbarToggle" ;
      var s2 = "<div " ;
      if ( Tango.ua.realMobile )
      {
        s2 += " ontouchend='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " ontouchstart='javascript:setButtonDecoration(this,\"pressed\",event)'"
            ;
      }
      else
      {
        s2 += " onmouseover='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onmouseout='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " onmousedown='javascript:setButtonDecoration(this,\"pressed\",event)'"
            + " onmouseup='javascript:setButtonDecoration(this,\"inside\",event)'"
            ;
      }
      s2 += ( title ? " title='" + title + "' " : " " )
          + " id='" + tempId + "'"
          + " class='ThemeToolbarToggle'"
          + " style='width:" + width + "px;height:" + height + "px;position:absolute;'"
          + " >" + s
          + "</div> "
          ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "ToolbarButtonSmall" )
    {
      if ( width )  width = parseInt ( width ) ;
      else          width = 16 ;
      if ( height ) height = parseInt ( height ) ;
      else          height = 16 ;

      var imgWidth = parseInt ( xElem.getAttribute ( "img-width" ) ) ;
      var imgHeight = parseInt ( xElem.getAttribute ( "img-height" ) ) ;
      if ( isNaN ( imgHeight ) ) imgHeight = imgWidth ;
      if ( isNaN ( imgWidth ) ) imgWidth = imgHeight ;
      var wh = "" ;
      if ( isNaN ( imgWidth ) ) { imgWidth = 16 ; imgHeight = 16 ; }
      if ( !isNaN ( imgWidth ) ) wh = "width='" + imgWidth + "px' height='" + imgHeight + "px'" ;

      var s = "" ;
      if ( img )
      {
        s = "<img src='" + img + "' " + wh + " class='ButtonImage' />" ;
      }
      if ( onclick ) a["onclick"] = onclick ;
      a["xClassName"] = "ToolbarButtonSmall" ;
      var s2 = "<div " ;
      if ( Tango.ua.realMobile )
      {
        s2 += " ontouchend='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " ontouchstart='javascript:setButtonDecoration(this,\"pressed\",event)'"
            ;
      }
      else
      {
        s2 += " onmouseover='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onmouseout='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " onmousedown='javascript:setButtonDecoration(this,\"pressed\",event)'"
            + " onmouseup='javascript:setButtonDecoration(this,\"inside\",event)'"
            ;
      }
      s2 += " id='" + tempId + "'"
          + " class='ThemeToolbarButtonSmall'"
          + " style='width:" + width + "px;height:" + height + "px;position:absolute;cursor:pointer;'"
          + " >" + s
          + "</div> "
          ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "ToolbarToggleSmall" )
    {
      a["checkable"] = true ;
      a["value"] = xElem.getAttribute ( "value" ) ;
      var checked = xElem.getAttribute ( "checked" ) ;
      if ( checked == "true" ) a["checked"] = "true" ;
      if ( ctx.checkableGroup ) a["CheckableGroup"] = ctx.checkableGroup ;

      if ( width )  width = parseInt ( width ) ;
      else          width = 16 ;
      if ( height ) height = parseInt ( height ) ;
      else          height = 16 ;

      var imgWidth = parseInt ( xElem.getAttribute ( "img-width" ) ) ;
      var imgHeight = parseInt ( xElem.getAttribute ( "img-height" ) ) ;
      if ( isNaN ( imgHeight ) ) imgHeight = imgWidth ;
      if ( isNaN ( imgWidth ) ) imgWidth = imgHeight ;
      var wh = "" ;
      if ( isNaN ( imgWidth ) ) { imgWidth = 16 ; imgHeight = 16 ; }
      if ( !isNaN ( imgWidth ) ) wh = "width='" + imgWidth + "px' height='" + imgHeight + "px'" ;

      var s = "" ;
      if ( img )
      {
        s = "<img src='" + img + "' " + wh + " class='ButtonImage' />" ;
      }
      if ( onclick ) a["onclick"] = onclick ;
      a["xClassName"] = "ToolbarToggleSmall" ;
      var s2 = "<div " ;
      if ( Tango.ua.realMobile )
      {
        s2 += " ontouchend='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " ontouchstart='javascript:setButtonDecoration(this,\"pressed\",event)'"
            ;
      }
      else
      {
        s2 += " onmouseover='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onmouseout='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " onmousedown='javascript:setButtonDecoration(this,\"pressed\",event)'"
            + " onmouseup='javascript:setButtonDecoration(this,\"inside\",event)'"
            ;
      }
      s2 += " id='" + tempId + "'"
          + " class='ThemeToolbarToggleSmall'"
          + " style='width:" + width + "px;height:" + height + "px;position:absolute;cursor:pointer;'"
          + " >" + s
          + "</div> "
          ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "A" || tagName == "a" )
    {
      a["xClassName"] = "Anchor" ;
      if ( ! clazz ) clazz = 'Anchor' ;
      var imgStyle = xElem.getAttribute ( "imgStyle" ) ;
      var s = "<a " ;
      var href = xElem.getAttribute ( "href" ) ;
      var target = xElem.getAttribute ( "target" ) ;
      if ( href && href.startsWith ( "javascript:" ) )
      {
        var pos = href.indexOf ( ':' ) ;
        href = href.substring ( pos + 1 ).trim() ;
      }
      if ( href )
      {
        href = href.trim() ;
        if ( href.startsWith ( "http" ) )
        {
          a["hrefCommand"] = null ;
        }
        else
        {
          a["hrefCommand"] = href ;
          href= "javascript:TSys.nop();" ;
        }
      }
      if ( ! text && xElem.firstChild )
      {
        if ( xElem.firstChild.nodeType == DOM_TEXT_NODE )
        {
          text = xElem.firstChild.nodeValue ;
        }
        else
        if ( xElem.firstChild.nodeType == DOM_CDATA_SECTION_NODE )
        {
          a["innerHTML"] = xElem.firstChild.nodeValue ;
        }
      }
      var addStyle = fontSize + "position: absolute;" ;
      if ( img )
      {
        var II = new Image() ;
        II.src = img ;
        var t = "<img src='" + img + "'" ;
        if ( imgStyle ) t += " style='" + imgStyle + ";border-style:none;'" ;
        else            t += " style='border-style:none;'" ;
        t += " onmousedown='return false;' />" ;
        if ( text )
        {
          t += "<br/>" + text ;
        }
        else
        {
          addStyle += "text-decoration:none;" ;
        }
        a["innerHTML"] = t ;
      }
      if ( style ) style = addStyle + style ;
      else         style = addStyle ;
      s += " id='" + tempId + "'" ;
      s += " style='" + style + "'" ;
      s += " href='" + href + "'" ;
//      s += " class='" + clazz + "'" ;
      if ( target ) s += " target='" + target + "'" ;
      s += " >" + ( text ? text : "" ) + "</a>" ;
//log  ( s ) ;
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "Button" )
    {
      a["use-button-minimum"] = xElem.getAttribute ( "use-button-minimum" ) == "false" ? false : true ;
      var p = TGui.renderShortcutText ( text ) ;
      text = p.text ;
      var s = "" ;
      if ( img && text )
      {
        s = "<img src='" + img + "' class='ButtonImage' /><span class='ButtonText' >" + text + "</span>" ;
      }
      else
      if ( img )
      {
        s = "<img src='" + img + "' class='ButtonImage' />" ;
      }
      else
      if ( text )
      {
        s = "<span class='ButtonText' >" + text + "</span>" ;
      }

      if ( ! clazz ) clazz = 'ThemeButton' ;
      a["xClassName"] = "Button" ;
      if ( xElem.getAttribute ( "default" ) == 'true' )
      {
        a["defaultButton"] = true ;
      }
      if ( style && style.indexOf ( "font-size" ) < 0 )
      {
        if ( style ) style += ";" + fontSize ;
        else         style = fontSize ;
      }
      style += "white-space:nowrap;vertical-align:middle;position:absolute;" ;
      if ( onclick ) a["onclick"] = onclick ;
      var s2 = "<button"
        + ( name ? " name='" + name + "' " : " " )
        + ( value ? " value='" + value + "' " : " " )
        + " id='" + tempId + "'"
        + " class='" + clazz + "'"
        + " style='" + style + "'"
        + " >" + s + "</button>"
        ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "PushButton" )
    {
      a["use-button-minimum"] = xElem.getAttribute ( "use-button-minimum" ) == "false" ? false : true ;
      var p = TGui.renderShortcutText ( text ) ;
      text = p.text ;
      var s = "" ;
      if ( img && text )
      {
        s = "<img src='" + img + "' class='ButtonImage' /><span class='ButtonText' >" + text + "</span>" ;
      }
      else
      if ( img )
      {
        s = "<img src='" + img + "' class='ButtonImage' />" ;
      }
      else
      if ( text )
      {
        s = "<span class='ButtonText' >" + text + "</span>" ;
      }
      if ( xElem.getAttribute ( "arrow" ) )
      {
        var adir = xElem.getAttribute ( "arrow" ) ;
        if ( adir == "down" || adir == "up" || adir == "left" || adir == "right" )
        {
          var txml = Tango.getThemeXml ( "Arrow", adir ) ;
          var w = txml.getIntAttribute ( "width", 11 ) ;
          var h = txml.getIntAttribute ( "height", 11 ) ;
          s += "<img style='position:absolute;width:" + w + "px;height:" + h + "px;' class='Arrow' src='" + TGui.buildThemeImageUrl ( "Arrow", adir ) + "' />" ;
        }
      }
      if ( style )
      {
        style += "white-space:nowrap;vertical-align:middle;position:absolute;" ;
      }
      else
      {
        style = "white-space:nowrap;vertical-align:middle;position:absolute;" ;
      }
      if ( ! Tango.buttonIsCSS3() ) style += "border-width:0px;" ;
      a["xClassName"] = "PushButton" ;
      if ( onclick )
      {
        a["onclick"] = onclick ;
	if ( p.shortcutCharacter ) a["shortcutCharacter"] = p.shortcutCharacter ;
      }
      if ( xElem.getAttribute ( "default" ) == 'true' )
      {
        a["defaultButton"] = true ;
      }
      var s2 = "" ;
      if ( Tango.ua.useGenericButtons ) s2 = "<button " ;
      else                             s2 = "<div " ;
      if ( Tango.ua.realMobile )
      {
        s2 += " ontouchend='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " ontouchstart='javascript:setButtonDecoration(this,\"pressed\",event)'"
            ;
      }
      else
      {
        s2 += " onmouseover='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onmouseout='javascript:setButtonDecoration(this,\"normal\",event)'"
            + " onmousedown='javascript:setButtonDecoration(this,\"pressed\",event)'"
            + " onmouseup='javascript:setButtonDecoration(this,\"inside\",event)'"
            + " onfocus='javascript:setButtonDecoration(this,\"focused\",event)'"
            + " onblur='javascript:setButtonDecoration(this,\"blur\",event)'"
            ;
      }
      s2 += ( title ? " title='" + title + "' " : " " )
          + " id='" + tempId + "'"
          + " class='ThemePushButton'"
          + " style='" + style + "'"
          + "' >" + s
	  ;
      if ( Tango.ua.useGenericButtons ) s2 += "</button> " ;
      else                             s2 += "</div> " ;
      sHtmlArray.push ( s2 ) ;
    }
    else
    if ( tagName == "Choice" )
    {
      var size = xElem.getAttribute ( "size" ) ;
      var multiple = xElem.getAttribute ( "multiple" ) ;
      var sorted = xElem.getAttribute ( "sorted" ) === "true" ;
      if ( sorted ) a["sorted"] = sorted ;
      if ( ! action &&   ondblclick ) a["action"] = ondblclick ;
      if (   action && ! ondblclick ) ondblclick = action ;

      if ( mandatory )
      {
        a["mandatory"] = mandatory ;
        if ( mandatoryCheck ) a["mandatoryCheck"] = mandatoryCheck ;
        if ( ! xdefault )
        {
          xdefault = "false" ;
          a["xdefault"] = "false" ;
        }
      }

      var st = "position:absolute;" + fontSize ;
      if ( ! style )
      {
        style = st ;
      }
      else
      {
        style = style + ";" + st ;
      }
      var preSelectedIndex = -1 ;
      if ( persistent )
      {
        var persistentValue = TSys.getPersistentValue ( name, ctx.windowId ) ;
        if ( typeof ( persistentValue ) != 'undefined' )
        {
          preSelectedIndex = parseInt ( persistentValue ) ;
          if ( isNaN ( preSelectedIndex ) ) preSelectedIndex = -1 ;
        }
      }
      a["xClassName"] = "Choice" ;
      if ( preSelectedIndex >= 0 ) a["xPreselectedIndex"] = preSelectedIndex ;
      var s = "<select"
            + " id='" + tempId + "'"
            + " class='ThemeChoice'"
            + " style='" + style + "'"
            + ( size ? " size='" + size + "'" : "" )
            + ( multiple ? " multiple='multiple'" : "" )
            + ( onclick ? " onclick='" + onclick + "'" : "" )
            + ( ondblclick ? " ondblclick='" + ondblclick + "'" : "" )
            + " >"
            ;
      if ( xdefault && ( ! size || size == 1 ) )
      {
        if ( xdefault == "false" )
          s += "<option value='' ></option>\n" ;
        else
          s += "<option value='' >" + xdefault + "</option>\n" ;
      }
      var xOpts = new TXEnum ( xElem, "option" ) ;
      if ( ! ( resettable && resettable == "false" ) ) a["resettable"] = true ;
      var index = 0 ;
      while ( xOpts.hasNext() )
      {
        var xo = xOpts.next() ;
        var val = xo.getAttribute ( "value" ) ;
        var selected = xo.getAttribute ( "selected" ) ;
        var txt = null ;
        if ( xo.firstChild )
        {
          if ( ! resettable || resettable != "true" ) a["resettable"] = false ;
          txt = xo.firstChild.nodeValue ;
        }
        if ( !txt ) txt = val ;
        if ( !val ) val = txt ;
        if ( ! txt ) txt = "" ;
        if ( ! val ) val = "" ;
        if ( preSelectedIndex >= 0 )
        {
          if ( index == preSelectedIndex ) selected = true ;
          else                             selected = false ;
        }
        s += "\n<option value='" + val + "'"
           + ( selected ? "selected='selected'" : "" )
           + " >" + txt + "</option>"
           ;
        if ( preSelectedIndex < 0 && selected )
        {
          a["xPreselectedIndex"] = index ;
        }
        index++ ;
      }
      s += "</select> " ;
      if ( onchange ) a["onchange"] = onchange ;
      sHtmlArray.push ( s ) ;
    }
    else
    if (  tagName == "Date"
       || tagName == "DateTime"
       )
    {
      if ( persistent )
      {
        var persistentValue = TSys.getPersistentValue ( name ) ;
        if ( persistentValue  ) a["persistentValue"]= persistentValue ;
      }
      if ( tagName == "Date" ) a["xClassName"] = "Date" ;
      if ( tagName == "DateTime" ) a["xClassName"] = "DateTime" ;

      if ( width )  width = parseInt ( width ) ;
      if ( height ) height = parseInt ( height ) ;

      var defaultDate = xElem.getAttribute ( "defaultDate" ) ;
      if ( ! defaultDate ) defaultDate = xElem.getAttribute ( "default-date" ) ;
      if ( defaultDate ) a["defaultDate"] = defaultDate ;
      var maxDate = xElem.getAttribute ( "maxDate" ) ;
      if ( ! maxDate ) maxDate = xElem.getAttribute ( "max-date" ) ;
      if ( maxDate ) a["maxDate"] = maxDate ;
      var minDate = xElem.getAttribute ( "minDate" ) ;
      if ( ! minDate ) minDate = xElem.getAttribute ( "min-date" ) ;
      if ( minDate ) a["minDate"] = minDate ;
      var maxYear = xElem.getAttribute ( "maxYear" ) ;
      if ( ! maxYear ) maxYear = xElem.getAttribute ( "max-year" ) ;
      if ( maxYear ) a["maxYear"] = maxYear ;
      var minYear = xElem.getAttribute ( "minYear" ) ;
      if ( ! minYear ) minYear = xElem.getAttribute ( "min-year" ) ;
      if ( minYear ) a["minYear"] = minYear ;

      var formatIn = xElem.getAttribute ( "formatIn" ) ;
      if ( ! formatIn ) formatIn = xElem.getAttribute ( "format-in" ) ;
      if ( formatIn ) a["formatIn"] = formatIn ;
      var formatOut = xElem.getAttribute ( "formatOut" ) ;
      if ( ! formatOut ) formatOut = xElem.getAttribute ( "format-out" ) ;
      if ( formatOut ) a["formatOut"] = formatOut ;

      var defaultTime = xElem.getAttribute ( "default-time" ) ;
      if ( defaultTime ) a["default-time"] = defaultTime ;
      var defaultDayOfMonth = xElem.getAttribute ( "default-day-of-month" ) ;
      if ( defaultDayOfMonth ) a["default-day-of-month"] = defaultDayOfMonth ;
      var mandatory = xElem.getAttribute ( "mandatory" ) ;
      if ( mandatory )
      {
        a["mandatory"] = mandatory ;
        if ( mandatoryCheck ) a["mandatoryCheck"] = mandatoryCheck ;
        if ( ! xdefault ) a["xdefault"] = "false" ;
      }
      if ( typeof ( onchange ) == 'string' && onchange.length > 0 )
      {
        a["onchange"] = onchange ;
      }

      var st = "position:absolute;white-space:nowrap;padding:0px;" ;
      if ( style ) st += style ;
      var dateFormat = DateUtils.getLocalizedDateFormatShort() ;
      var s = "<span"
            + " class='" + tagName + "' id='" + tempId + "'"
            + " style='" + st + "'"
            + ">\n"
            ;
  var widthM4 = "width:" + ( this.M_width * 4 ) + "px;" ;
  var widthM5 = "width:" + ( this.M_width * 5 ) + "px;" ;

      var showDayOfMonth = xElem.getAttribute ( "show-day-of-month" ) == 'false' ? false : true ;
      var style_day = "position:absolute;" + fontSize + widthM5 ;
      if ( ! showDayOfMonth ) style_day += "display:none" ;
    a["show-day-of-month"] = showDayOfMonth ;
      var showMonthNames = xElem.getAttribute ( "show-month-names" ) == 'true' ? true : false ;
  if ( showMonthNames )
  {
    a["show-month-names"] = showMonthNames ;
    var monthNames = DateUtils.getMonthNames() ;
    var len = 0 ;
    for ( var i = 0 ; i < monthNames.length ; i++ )
    {
      len = Math.max ( len, monthNames[i].length ) ;
    }
    widthM5 = "width:" + ( ( len + 1 ) * this.M_width ) + "px;" ;
  }

      if ( dateFormat.startsWith ( "M" ) )
      {
        s += " <select class='ThemeChoice' name='Month' "
          + "   style='position:absolute;" + fontSize + widthM5 + "'"
          + "  >\n"
          + "   <option value='111' >11</option>\n"
          + "  </select>\n"
          + " <select class='ThemeChoice' name='Day' "
          + "   style='" + style_day + "'"
          + "  >\n"
          + "   <option value='281' >280</option>\n"
          + "  </select>\n"
          ;
      }
      else
      {
        s += " <select class='ThemeChoice' name='Day' "
          + "   style='" + style_day + "'"
          + "  >\n"
          + "   <option value='281' >280</option>\n"
          + "  </select>\n"
          + " <select class='ThemeChoice' name='Month' "
          + "   style='position:absolute;" + fontSize + widthM5 + "'"
          + "  >\n"
          + "   <option value='111' >11</option>\n"
          + "  </select>\n"
          ;
      }
      s +=  " <select class='ThemeChoice' name='Year' "
          + "   style='position:absolute;" + fontSize + "'"
          + "  >\n"
          + "   <option value='2006' >2006</option>\n"
          + "  </select>\n"
          ;
      s += "<img style='width:13px;height:13px;cursor:pointer;position:absolute;margin:0px;padding:0px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "icon" ) + "' id='Calendar.Icon.Image' />" ;
      if ( tagName == "DateTime" )
      {
        s += "<input class='ThemeTextField' name='Hour' type='text' maxlength='2' style='position:absolute;" + fontSize + "' />"
           + "<input class='ThemeTextField' name='Minute' type='text' maxlength='2' style='position:absolute;" + fontSize + "' />"
           ;
        var showSeconds = xElem.getAttribute ( "show-seconds" ) ;
        if ( showSeconds != "false" )
        {
        s += "<input class='ThemeTextField' name='Second' type='text' maxlength='2' style='position:absolute;" + fontSize + "' />"
           ;
        }
      }
      s += "\n</span>" ;
      sHtmlArray.push ( s ) ;
    }
    else
    if (  tagName == "Label"
       || tagName == "ListLabel"
       )
    {
      if ( tagName == "ListLabel" )
      {
        clazz = "ThemeListLabel" ;
        if ( xElem.getAttribute ( "odd" ) == "true" ) { ctx.listLabelState = 2 ; clazz = "ThemeListLabel" ; }
        else
        if ( xElem.getAttribute ( "even" ) == "true" ) { ctx.listLabelState = 2 ; clazz = "ThemeListLabelEven" ; }
        else
        {
          if ( ctx.listLabelState == 1 ) { clazz = "ThemeListLabel" ; ctx.listLabelState = 2 ; }
          else
          if ( ctx.listLabelState == 2 ) { clazz = "ThemeListLabelEven" ; ctx.listLabelState = 1 ; }
        }

        if ( ! right && ! xElem.getAttribute ( "rightAttachComponent" ) )
        {
          if ( ! xConstraints )
          {
            xConstraints = new TConstraints() ;
            a["Constraints"] = xConstraints ;
          }
          xConstraints.parseRight ( "-2" ) ;
          xConstraints.setRightAttachComponent() ;
        }
        if ( style ) style += "text-align:right;" ;
        else         style = "text-align:right;" ;
      }
      if ( width )  width = parseInt ( width ) ;
      if ( height ) height = parseInt ( height ) ;

      if ( overflowTooltip )
      {
        a["tooltip"] = "javascript:function(e) {var c = new TLabel ( e ) ; var t = c.dom.innerHTML ; if(!TGui.isTextOverflown(c.dom))return '';return t ; }" ;
        if ( !style ) style = "" ;
        style += 'text-overflow: ellipsis;overflow:hidden;' ;
      }

      a["xClassName"] = "Label" ;
      if ( mandatory ) a["mandatory"] = mandatory ;
      if ( mandatoryCheck ) a["mandatoryCheck"] = mandatoryCheck ;
      if ( mandatoryStyleName ) a["mandatoryStyleName"] = mandatoryStyleName ;
      if ( mandatoryBlurStyleName ) a["mandatoryBlurStyleName"] = mandatoryBlurStyleName ;
      if ( normalStyleName ) a["normalStyleName"] = normalStyleName ;

      a["getValue"] = xElem.getAttribute ( "getValue" ) ;
      if ( ! a["getValue"] ) a["getValue"] = xElem.getAttribute ( "get-value" ) ;
      if ( onclick ) a["onclick"] = onclick ;
      if ( ondblclick ) a["ondblclick"] = ondblclick ;
      if ( type )
      {
        a["type"] = type ;
      }
      var s = "<span" ;
      if ( ! clazz ) clazz = 'ThemeLabel' ;
      s += " class='" + clazz + "' id='" + tempId + "'" ;
      s += " style='" ;
      if ( width ) s += "width:" + width + "px;" ;
      if ( height ) s += "height:" + height + "px;" ;
      if ( style ) s += style ;
      s += "position:absolute;white-space:nowrap;" ;
      if ( type == 'float' || type == 'money' || type == 'int' )
      {
        s += "text-align:right' " ;
        if ( ! TGui.isLTR() ) s += " dir='ltr' " ;
      }
      else s += "'" ;
      if ( typeof ( text ) == 'undefined' || text == null )
      {
        if ( xElem.firstChild && xElem.firstChild.nodeType == DOM_TEXT_NODE )
      	{
      	  text = xElem.firstChild.nodeValue ;
      	  text = text.trim() ;
      	}
        if ( ! text ) text = "&nbsp;" ;
      }
      if ( ! text ) text = "&nbsp;" ;
      s += " >" + text + "</span>" ;
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "Hidden" )
    {
      if ( name )
      {
        var s = "<input type='hidden' name='" + name + "'" ;
        var v = xElem.getAttribute ( "value" ) ;
        if ( v && v.length > 0 ) s += " value='" + v + "'" ;
        s += " id='" + tempId + "' " ;
        s += "/>" ;
        sHtmlArray.push ( s ) ;
      }
    }
    else
    if ( tagName == "TextField" )
    {
      a["xClassName"] = "TextField" ;
      a["ignorechange"] = xElem.getAttribute ( "ignorechange" ) == "true" ? true : false ;
      if ( mandatoryStyleName ) a["mandatoryStyleName"] = mandatoryStyleName ;
      if ( mandatoryBlurStyleName ) a["mandatoryBlurStyleName"] = mandatoryBlurStyleName ;
      if ( normalStyleName ) a["normalStyleName"] = normalStyleName ;
      var label = xElem.getAttribute ( "label" ) ;
      var resultlist = xElem.getAttribute ( "resultlist" ) ;
      if ( resultlist )
      {
        a["resultlist"] = resultlist ;
        var resultlistPatternType = xElem.getAttribute ( "resultlist-pattern-type" ) ;
        if ( ! resultlistPatternType ) resultlistPatternType = "" ;
        a["resultlistPatternType"] = resultlistPatternType ;
      }
      if ( label )
      {
        var tabname = xElem.getAttribute ( "tabname" ) ;
        if ( ! tabname ) tabname = "T1" ;
        var tabx = xElem.getAttribute ( "tabx" ) ;
        var tabX = xElem.getAttribute ( "tabX" ) ;
        var tempId2 = TSys.getTempId() ;
        var a2 = new Array() ;
        var xConstraints2 = new TConstraints() ;
        a2["Constraints"] = xConstraints2 ;
        xConstraints2.parseRight ( "-4" ) ;
        xConstraints2.setRightAttachComponent() ;
        externalAttributes[tempId2] = a2 ;
        a2["xClassName"] = "Label" ;
        var s = "<span" ;

        var lClazz = "ThemeListLabel" ;
        if ( xElem.getAttribute ( "odd" ) == "true" ) { ctx.listLabelState = 2 ; lClazz = "ThemeListLabel" ; }
        else
        if ( xElem.getAttribute ( "even" ) == "true" ) { ctx.listLabelState = 2 ; lClazz = "ThemeListLabelEven" ; }
        else
        {
          if ( ctx.listLabelState == 1 ) { lClazz = "ThemeListLabel" ; ctx.listLabelState = 2 ; }
          else
          if ( ctx.listLabelState == 2 ) { lClazz = "ThemeListLabelEven" ; ctx.listLabelState = 1 ; }
        }
        if ( label.indexOf ( '%' ) == 0 )
        {
          label = TSys.translate ( label ) ;
        }
        s += " class='" + lClazz + "' id='" + tempId2 + "'" ;
        s += " style='text-align:right;position:absolute;white-space:nowrap;'" ;
        s += " >" + label + "</span>" ;

        sHtmlArray.push ( s ) ;

        var tab = new Array() ;
        a["pendingTab"] = tab ;
        tab["name"] = tabname ;
        if ( tabx )
        {
          var ix = parseInt ( tabx ) ;
          if ( !isNaN ( ix ) && ix >= 0 )
          {
            tab["relative"] = true ;
            tab["x"] = ix ;
          }
        }
        else
        if ( tabX )
        {
          var ix = parseInt ( tabX ) ;
          if ( !isNaN ( ix ) && ix >= 0 )
          {
            tab["absolute"] = true ;
            tab["x"] = ix ;
          }
        }
      }
      if ( ! ( resettable && resettable == "false" ) ) a["resettable"] = true ;

      var styleRight = false ;
      if ( type == "int" ) { styleRight = true ; a["type"] = type ; }
      if ( type == "sint" ) { styleRight = true ; a["type"] = type ; type = null ; }
      if ( type == "float" ) { styleRight = true ; }
      if ( type == "ufloat" ) { styleRight = true ; }
      if ( type && type != "text" && type != "password" && type != "int" )
      {
        a["extendedType"] = type ;
        type = "text" ;
      }

      var max = xElem.getAttribute ( "max" ) ;
      var min = xElem.getAttribute ( "min" ) ;
      var size = xElem.getAttribute ( "size" ) ;
      var maxlength = xElem.getAttribute ( "maxlength" ) ;
      if ( ! maxlength ) maxlength = 128 ;
      if ( mandatory ) a["mandatory"] = mandatory ;
      if ( mandatoryCheck ) a["mandatoryCheck"] = mandatoryCheck ;
      var pattern = xElem.getAttribute ( "pattern" ) ;
      if ( pattern )
      {
        if ( pattern.charAt ( 0 ) != '/' ) pattern = '/' + pattern ;
        if ( pattern.charAt ( pattern.length-1 ) != '/' ) pattern = pattern + '/' ;
        a["extendedType"] = ''
        + '{'
        + 'p: null,'
        + 'execute: function(tt,src)'
        + '{'
        + '  var t = src.value ;'
        + '  if ( ! this.pat )'
        + '  {'
        + '    this.pat = ' + pattern + ';'
        + '  }'
        + '  var a = this.pat.exec ( t ) ;'
        + '  if ( src.value && a[1] === t ) return true ;'
        + '  return false ;'
        + '}'
        + '}'
        ;
      }
      var cn = "ThemeTextField" ;
      if ( normalStyleName ) cn = normalStyleName ;
      var s = "<input class='" + cn + "'"
            + " id='" + tempId + "'"
            + ( type ? " type='" + type + "'" : "" )
            + ( readonly ? " readonly='readonly'" : "" )
            + ( name ? " name='" + name +"'" : "" )
            + ( size ? " size='" + size + "'" : "" )
            + " maxlength='" + maxlength + "'"
            + " style='position:absolute;" + fontSize
            ;
      if ( styleRight ) s += " text-align:right;" ;
//      if ( extendedType == "float" ) a["type"] = extendedType ;
      if ( max )
      {
        max = parseInt ( max ) ;
        if ( ! isNaN ( max ) ) a["max"] = max ;
      }
      if ( min )
      {
        min = parseInt ( min ) ;
        if ( ! isNaN ( min ) ) a["min"] = min ;
      }
      if ( style ) s += style ;
      s += "'" ;

      if ( styleRight && ! TGui.isLTR() ) s += " dir='ltr' " ;
      if ( persistent )
      {
        var persistentValue = TSys.getPersistentValue ( name ) ;
        if ( persistentValue  ) value = persistentValue ;
      }
      if ( value )
      {
        s += " value='" + value + "'" ;
      }
      else
      if ( xElem.firstChild && xElem.firstChild.nodeValue )
      {
        s += " value='" + xElem.firstChild.nodeValue + "'" ;
      }
      s += " />" ;
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "TextArea" )
    {
      if ( ! ( resettable && resettable == "false" ) ) a["resettable"] = true ;
      var cols = xElem.getAttribute ( "cols" ) ;
      var rows = xElem.getAttribute ( "rows" ) ;
      if ( mandatory ) a["mandatory"] = mandatory ;
      if ( mandatoryCheck ) a["mandatoryCheck"] = mandatoryCheck ;
      var s = "<textarea type=text class='ThemeTextArea'"
            + " id='" + tempId + "'"
            + ( cols ? " cols='" + cols + "'" : "" )
            + ( rows ? " rows='" + rows + "'" : "" )
            + ( readonly ? " readonly='readonly'" : "" )
            + " style='position:absolute;" + fontSize
            ;
      a["xClassName"] = "TextArea" ;
      if ( style ) s += style ;
      s += "'" ;
s += " wrap='off' " ;
      var persistentValue = TSys.getPersistentValue ( name ) ;
      if ( persistentValue  )
      {
        s += ">" + persistentValue + "</textarea>";
      }
      else
      {
        if ( xElem.firstChild )
        {
          s += ">" + xElem.firstChild.nodeValue + "</textarea>";
        }
        else
        {
          s += " ></TextArea>" ;
        }
      }
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "Checkbox" || tagName == "Radio" )
    {
      if ( tagName == "Checkbox" )
      {
        a["xClassName"] = "Checkbox" ;
      }
      if ( tagName == "Radio" )
      {
        a["xClassName"] = "Radio" ;
      }
      var selected = xElem.getAttribute ( "selected" ) ;
      var checked = xElem.getAttribute ( "checked" ) ;

      if ( String ( checked ) == "true" )
      {
        a["checked"] = "true" ;
      }
      else
      if ( String ( selected ) == "true" )
      {
        a["checked"] = "true" ;
      }
      var s = ""
            + "<input type='" + tagName + "' class='" + tagName + "'"
            + " id='" + tempId + "'"
            + " name='" + name + "'"
            + " style='position:absolute;margin-top:0px;margin-left:0px;margin-bottom:0px;margin-right:0px;"
            ;
      if ( style ) s += style ;
      s += "'" ;
      if ( ! value ) value = text ;
      if ( ! text ) text = value ;
      if ( ! text ) text = "" ;
      if ( ! value ) value = "" ;

      s += " value='" + value + "'" ;
      if ( onchange ) a["onchange"] = onchange ;

      s += " />\n" ;

      var xdefault = xElem.getAttribute ( "default" ) ;
      if ( typeof ( xdefault ) == 'string' ) a["xdefault"] = xdefault ;
      else                                   xdefault = null ;

      if ( text.length > 0 )
      {
        var xLabelId = TSys.getTempId() ;
        a["xLabelId"] = xLabelId ;
        var a2 = [] ;
        externalAttributes[xLabelId] = a2 ;
        a2["xClassName"] = "Label" ;
        if ( a["orgId"] ) cbId = a["orgId"] ;
        else              cbId = tempId ;
        if ( onchange ) a2["onclick"] = onchange ;
        s += "<span" ;
        s += " class='Label' id='" + xLabelId + "'" ;
        s += " style='position:absolute;white-space:nowrap;cursor:pointer;" ;
        s += " padding-left:2px;padding-right:4px;' " ;
        s += "onmousedown='javascript:TGui.toggleCheckbox(\"" + cbId + "\")' " ;
        s += " >" + text + "</span>\n" ;
      }
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "Checkbox2" || tagName == "Radio2" )
    {
      if ( tagName == "Checkbox2" )
      {
        clazz = "ThemeCheckbox" ;
        a["xClassName"] = "Checkbox2" ;
        a["jsPeer"] = new TCheckbox ( new TXml ( xElem ) ) ;
      }
      else
      if ( tagName == "Radio2" )
      {
        clazz = "ThemeRadio" ;
        a["xClassName"] = "Radio2" ;
        a["jsPeer"] = new TRadio ( new TXml ( xElem ) ) ;
        if ( ! ctx.checkableGroup ) ctx.checkableGroup = new CheckableGroup ( xElem.getAttribute ( "name" ) ) ;
        a["CheckableGroup"] = ctx.checkableGroup ;
      }
      if ( style )
      {
        style += "white-space:nowrap;vertical-align:middle;position:absolute;" ;
      }
      else
      {
        style = "white-space:nowrap;vertical-align:middle;position:absolute;" ;
      }
      sHtmlArray.push ( "<div"
            + " id='" + tempId + "'"
            + " class='" + clazz + "'"
            + " style='" + style + "'"
            + "' >&nbsp;"
            + "</div> "
            ) ;
    }
    else
    if ( tagName == "Menubar" )
    {
      a["xClassName"] = "Menubar" ;
      xConstraints = new TConstraints() ;
      a["Constraints"] = xConstraints ;
      xConstraints.parseRight ( "-0" ) ;
      a["jsPeer"] = new Menubar ( new TXml ( xElem ) ) ;

      var s = "position:absolute;left:0px;top:0px;" ;
      if ( style ) s += style ;
      sHtmlArray.push ( "<div"
            + " id='" + tempId + "'"
            + " class='ThemeMenubar'"
            + " style='" + s + "'"
            + " >&nbsp;</div> "
            ) ;
    }
    else
    if ( tagName == "TitleLabel" )
    {
      if ( width )  width = parseInt ( width ) ;
      if ( height ) height = parseInt ( height ) ;

      a["Text"] = text ;
      a["xClassName"] = "TitleLabel" ;
      var st = "position:absolute;" ;
      if ( style && style.charAt ( style.length - 1 ) != ";" ) style += ";" ;
      if ( style ) style += st ;
      else         style = st ;
      var s = "<div" ;
      s += " class='ThemeTitleLabel' id='" + tempId + "' style='" + style + "' >&nbsp;</div>" ;
      sHtmlArray.push ( s ) ;
    }
    else
    if ( tagName == "Splitbar" )
    {
      var s = "<div" ;
      s += " class='ThemeSplitbar' id='" + tempId + "'" ;
      s += " style='position:absolute;" ;
      s += "cursor:w-resize;" ;
      s += "width:2px;" ;
      s += "height:40px;" ;
      s += "' >&nbsp;</div>\n" ;
      sHtmlArray.push ( s ) ;
      a["xClassName"] = "Splitbar" ;
      a["jsPeer"] = new Splitbar ( xElem, false ) ;
    }
    else
    if ( tagName == "SplitbarHorizontal" )
    {
      var s = "<br/><div" ;
      s += " class='ThemeSplitbarHorizontal' id='" + tempId + "'" ;
      s += " style='position:absolute;" ;
      s += "cursor:n-resize;" ;
      s += "width:40px;" ;
//      s += "height:2px;" ;
      s += "' >&nbsp;</div><br/>\n" ;
      sHtmlArray.push ( s ) ;
      a["xClassName"] = "SplitbarHorizontal" ;
      a["jsPeer"] = new Splitbar ( xElem, true ) ;
    }
    else
    if (  tagName == "Html" )
    {
      this.createHtmlContainer ( new TXEnum ( xElem ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
    }
    else
    if (  tagName == "img" || tagName == "Image" )
    {
      a["xClassName"] = "Image" ;

      if ( onclick )
      {
        a["onclick"] = onclick ;
        if ( style ) style = "cursor:pointer;" + style ;
        else         style = "cursor:pointer;" ;
      }
      if ( ondblclick ) a["ondblclick"] = ondblclick ;
      var s = "<img" ;
//      s += " class='" + clazz ;
      var src     = xElem.getAttribute ( "src" ) ;
      if ( src )
      {
        src = this.translateImageName ( src ) ;
        var II = new Image() ;
        II.src = src ;
        extImgArray.push ( II ) ;
        s += " src='" + src + "'" ;
      }
      s += " id='" + tempId + "'" ;
      s += " style='position:absolute;border-style: none;" ;
      s += "padding:0px;" ;
      if ( style ) s += style ;
      s += "' onmousedown='return false;' />\n" ;

      sHtmlArray.push ( s ) ;
    }
    else
    if (  tagName == "Container"
       || tagName == "CONTAINER"
       || tagName == "DisplayContainer"
       || tagName == "Canvas"
       )
    {
      if ( tagName == "Canvas" )
      {
        if ( ! this.hasCanvas() ) continue ;
      }
      a["xClassName"] = "Container" ;
      var decoration = xElem.getAttribute ( "decoration" ) ;
      if ( decoration && decoration.length > 0 )
      {
        a["Decorator"] = new ContainerDecorator ( decoration ) ;
      }
      if ( width )  width = parseInt ( width ) ;
      if ( height ) height = parseInt ( height ) ;

      if ( typeof ( onchange ) == 'string' && onchange.length > 0 )
      {
        a["onchange"] = onchange ;
      }
      if ( onclick )
      {
        a["onclick"] = onclick ;
        if ( style ) style = "cursor:pointer;" + style ;
        else         style = "cursor:pointer;" ;
      }
      if ( ondblclick ) a["ondblclick"] = ondblclick ;
      if ( tagName == "DisplayContainer" )
      {
        clazz = "ThemeDisplayContainer" ;
      }
      else
      if ( ! clazz )
      {
        clazz = "ThemeContainer" ;
      }
      var s = "<span" ;

      s += " class='" + clazz + "' id='" + tempId + "'" ;

      s += " style='position:absolute;" ;
      if ( width ) s += "width:" + width + "px;" ;
      if ( height ) s += "height:" + height + "px;" ;
      s += "padding:2px;" ;
      if ( style ) s += style ;
      s += "' >\n" ;

      sHtmlArray.push ( s ) ;
      if ( tagName == "Canvas" )
      {
        if ( ! a["jsPeer"] ) a["jsPeer"] = new Canvas ( xElem ) ;
        s = "<canvas " ;
        s += " style='position:absolute;top:0px;left:0px;" ;
        if ( ! width ) width = 100 ;
        if ( ! height ) height = 100 ;
        s += "'" ;
        s += " width='" + width + "' height='" + height + "' " ;
        s += "></canvas>" ;
        sHtmlArray.push ( s ) ;
      }
      var xContentIsHtml = ctx.xContentIsHtml ;
      ctx.xContentIsHtml = false ;
      if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
      this.createHtmlContainer ( new TXEnum ( xElem ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      if ( ctx.xContentIsHtml ) a["xContentIsHtml"] = true ;
      ctx.xContentIsHtml = xContentIsHtml ;
      if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;

      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "ToolbarVertical" )
    {
      a["xClassName"] = "ToolbarVertical" ;
      a["xScalableBackgroundImage"] = true ;
      xConstraints = new TConstraints() ;
      a["Constraints"] = xConstraints ;
      xConstraints.parseBottom ( "-0" ) ;

      var s = "<span" ;
      s += " class='ThemeToolbar' id='" + tempId + "'" ;
      s += " style='position:absolute;" ;
      if ( style ) s += style ;
      s += "' >\n" ;

      sHtmlArray.push ( s ) ;
      if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
      this.createHtmlContainer ( new TXEnum ( xElem ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "Toolbar" )
    {
      a["xClassName"] = "Toolbar" ;
      a["xScalableBackgroundImage"] = true ;
      xConstraints = new TConstraints() ;
      a["Constraints"] = xConstraints ;
      xConstraints.parseRight ( "-0" ) ;

      var s = "<span" ;
      s += " class='ThemeToolbar' id='" + tempId + "'" ;
      s += " style='position:absolute;" ;
      if ( style ) s += style ;
      s += "' >\n" ;

      sHtmlArray.push ( s ) ;
      if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
      this.createHtmlContainer ( new TXEnum ( xElem ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
      sHtmlArray.push ( "</span>\n" ) ;
    }
    else
    if ( tagName == "Multiform" )
    {
      a["xClassName"] = "Multiform" ;
      var s = "<div class='Multiform' id='" + tempId + "'"
          + " style='position:absolute;padding:0px;margin:0px;"
          + ( style ? style : "" )
          + "' >\n"
          ;
      sHtmlArray.push ( s ) ;

      var mf = new TMultiform ( xElem ) ;
      if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
      mf.createHtmlContainer ( xElem, externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
      a["jsPeer"] = mf ;
      sHtmlArray.push ( "</div >\n" ) ;
      continue ;
    }
    else
    if ( tagName == "Notebook" )
    {
      a["xClassName"] = "Notebook" ;
      sHtmlArray.push ( "<div class='ThemeNotebook' id='" + tempId + "'" ) ;
      if ( style ) sHtmlArray.push ( " style='" + style + ";position:absolute;'" ) ;
      else         sHtmlArray.push ( " style='position:absolute;'" ) ;
      sHtmlArray.push ( " >\n" ) ;

      var tabformId = id ;
      if ( ! id ) tabformId = tempId ;
      var mf = new TMultiform ( xElem ) ;
      mf.setTabformId ( tabformId ) ;
      if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
      mf.createHtmlContainer ( xElem, externalAttributes, ctx, extImgArray, sHtmlArray ) ;
      if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
      a["jsPeer"] = mf ;
      sHtmlArray.push ( "</div>\n" ) ;
      continue ;
    }
    else
    if ( TAGNAME == "IFRAME" )
    {
      a["xClassName"] = "Iframe" ;
      var s = "<iframe id='" + tempId + "'" ;
      if ( clazz && clazz != "iframe" ) s += " class='" + clazz + "'" ;
      if ( style ) s += " style='" + style + "'" ;
      s += " ></iframe>\n" ;
      if ( xElem.firstChild && xElem.firstChild.nodeType == DOM_CDATA_SECTION_NODE )
      {
        a["innerHTML"] = xElem.firstChild.nodeValue ;
      }
      var src = xElem.getAttribute ( "src" ) ;
      if ( src ) a["src"] = src ;
      sHtmlArray.push ( s ) ;
    }
    else
    if ( TAGNAME == "DEFINE" )
    {
      var tag = xElem.getAttribute ( "tag" ) ;
      if ( tag )
      {
        new TagFactory ( xElem ) ;
      }
    }
    else
    {
      var js = this.getTagDefinition ( tagName ) ;
      if ( js )
      {
        if ( a["popup"] ) a["popup"].flush() ;
        a["popup"] = null ;
        var axlDom = js.getAxl ( xElem, a ) ;
        if ( axlDom )
        {
          var currentPeer = ctx.currentPeer ;
          var newPeer = null ;
          if ( js.getPeer )
          {
            var p = js.getPeer() ;
            if ( p )
            {
              ctx.currentPeer = p ;
              if ( typeof p.isPagelet === 'function' && p.isPagelet() )
              {
                newPeer = p ;
                ctx.pushPagelet ( newPeer ) ;
              }
            }
          }
          if ( a["pagelet"] ) ctx.pushPagelet ( a["pagelet"] ) ;
          if ( a["pendingTab"] ) ctx.pendingTab = a["pendingTab"] ;
          this.createHtmlContainer ( new TXEnum ( axlDom ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
          ctx.pendingTab = undefined ;
          if ( a["pagelet"] ) ctx.popPagelet ( a["pagelet"] ) ;
          if ( newPeer ) ctx.popPagelet ( newPeer ) ;
          ctx.currentPeer = currentPeer ;
        }
      }
    }
  }
  if ( returnString )
  {
    return sHtmlArray.join ( "\n" ) ;
  }
  if ( ctxIsLocal )
  {
log ( "__________________ CTX LOCAL ------------------" ) ;
  }
};
TGuiClass.prototype.isTextOverflown = function ( dom )
{
  var size = dom.offsetWidth ;
  var span = document.createElement ( "span" ) ;

  var tn = document.createTextNode ( dom.innerHTML ) ;
  span.style.padding = "0px" ;
  span.style.margin = "0px" ;
  span.appendChild ( tn ) ;
  document.body.appendChild ( span ) ;
  var fontWeight = TGui.getComputedStyle ( dom, "font-weight" ) ;
  var fontFamily = TGui.getComputedStyle ( dom, "font-family" ) ;
  var fontSize = TGui.getComputedStyle ( dom, "font-size" ) ;
  var fontStyle = TGui.getComputedStyle ( dom, "font-style" ) ;
  var fontVariant = TGui.getComputedStyle ( dom, "font-variant" ) ;

  span.style.fontWeight = fontWeight ;
  span.style.fontFamily = fontFamily ;
  span.style.fontSize = fontSize ;
  span.style.fontStyle = fontStyle ;
  span.style.fontVariant = fontVariant ;

  var rc = span.offsetWidth + 8 > dom.offsetWidth ;
  document.body.removeChild ( span ) ;
  return rc ;
};
TGuiClass.prototype.parseStyle = function ( s, tag )
{
  var pos = s.indexOf ( tag ) ;
  if ( pos < 0 ) return null ;

  var pos1 = -1 ;
  if ( pos == 0 )
  {
    pos1 = pos ;
  }
  else
  {
    pos1 = s.indexOf ( " " + tag ) ;
    if ( pos1 < 0 )
    {
      pos1 = s.indexOf ( ";" + tag ) ;
      if ( pos1 > 0 ) pos1++ ;
    }
  }
  if ( pos1 < 0 ) return null ;
  var pos2 = s.indexOf ( ':', pos1 ) ;
  if ( pos2 < 0 ) return null ;
  var pos3 = s.indexOf ( ';', pos2 ) ;
  var v = null ;
  if ( pos3 < 0 )
  {
    v = s.substring ( pos2+1 ) ;
    s = s.substring ( 0, pos1 ) ;
  }
  else
  {
    v = s.substring ( pos2+1, pos3 ) ;
    s = s.substring ( 0, pos1 ) + s.substring ( pos3+1) ;
  }
  return [ s, v.trim() ] ;
};
TGuiClass.prototype.setValuesDate = function ( hDate, textDate, format )
{
  var date = null ;
  if  ( typeof ( textDate ) == 'string' )
  {
    date = DateUtils.parseDate ( textDate ) ;
  }
  else
  if ( typeof ( textDate ) == 'number' )
  {
    date = new Date ( textDate ) ;
  }
  else
  if ( TSys.isDate ( textDate ) )
  {
    date = textDate ;
  }
  
  if ( hDate.minDate && hDate.minDate.getTime() > date.getTime() ) date = hDate.minDate ;
  if ( hDate.maxDate2 && hDate.maxDate2.getTime() < date.getTime() ) date = hDate.maxDate2 ;

  if ( ! textDate )
  {
    if ( ! hDate.xdefault ) return ;
    hDate.hYear.selectedIndex = 0 ;
    hDate.hMonth.selectedIndex = 0 ;
    hDate.hDay.selectedIndex = 0 ;
    if ( hDate.hHour )
    {
      hDate.hHour.value = "" ;
      hDate.hMinute.value = "" ;
      if ( hDate.hSecond ) hDate.hSecond.value = "" ;
    }
    if ( hDate.mandatory ) TGui.setMandatoryDecorationDateFromElement ( hDate.hDay ) ;
    return ;
  }
  if ( hDate.minDate )
  {
    if ( hDate.minDate.getTime() > date.getTime() ) date.setTime ( hDate.minDate.getTime() ) ;
  }
  var iDay = date.getDate() ;
  var iMonth = date.getMonth() ;
  var iYear = date.getFullYear() ;
  iYear -= hDate.minDate.getFullYear() ;

  var iHour = date.getHours() ;
  var iMinute = date.getMinutes() ;
  var iSecond = date.getSeconds() ;

  if ( hDate.xdefault )
  {
    iMonth++ ; iYear++ ;
  }
  else
  {
    iDay-- ;
  }
  var selectIndex0 = false ;
  if ( iYear >= hDate.hYear.options.length )
	{
    if ( hDate.xdefault ) { iYear = 0 ; selectIndex0 = true ; }
		else                  iYear = hDate.hYear.options.length - 1 ;
	}
  else
  if ( iYear < 0 ) iYear = 0 ;

  if ( iMonth >= hDate.hMonth.options.length )
  {
    iMonth = hDate.hMonth.options.length - 1 ;
  }

  if ( iDay >= hDate.hDay.options.length )
  {
    var maxDays = DateUtils.getMaxDays ( date ) ;
    var index = 0 ;
    if ( hDate.xdefault )
    {
      hDate.hDay.options[index++] = new Option ( "", "", false, false );
    }
    for ( var i = 0 ; i < maxDays ; i++ )
    {
      hDate.hDay.options[index++] = new Option ( i+1, i, false, false );
    }
  }
  if ( selectIndex0 )
	{
  	hDate.hYear.selectedIndex = 0 ;
  	hDate.hMonth.selectedIndex = 0 ;
  	hDate.hDay.selectedIndex = 0 ;
	}
	else
	{
  	hDate.hYear.selectedIndex = iYear ;
  	hDate.hMonth.selectedIndex = iMonth ;
  	hDate.hDay.selectedIndex = iDay ;
	}
  if ( hDate.hHour )
  {
    hDate.hHour.value = iHour ;
    hDate.hMinute.value = iMinute ;
    if ( hDate.hSecond ) hDate.hSecond.value = iSecond ;
  }
  if ( hDate.mandatory ) TGui.setMandatoryDecorationDateFromElement ( hDate.hDay ) ;
};
TGuiClass.prototype.setValuesChoice = function ( ch, xmlDom, referenceData )
{
  var t = "" ;
  var isDate = ch.xsi_type == "xsd-date" ;
  var isDateTime = ch.xsi_type == "xsd-datetime" ;
  if ( xmlDom.firstChild ) t = xmlDom.firstChild.nodeValue ;
  if ( ! t ) t = "" ;
  var defaultValue = null ;
  if ( referenceData )
  {
    var xx = new TXml ( xmlDom ) ;
    defaultValue = xx.getAttribute ( "default" ) ;
  }
  var en = new TXEnum ( xmlDom, "option" ) ;
  if ( ! en.hasNext() )
  {
    ch.value = t ;
    TGui.setMandatoryDecoration ( ch ) ;
    return ;
  }
  if ( en.hasNext() )
  {
    ch.options.length = 0 ;
    var index = 0 ;
    if ( ch.xdefault )
    {
      var opt = document.createElement ( "option" ) ;
      if ( ch.xdefault == "false" )
      {
        ch.options[index++] = new Option ( "", "", false, false );
      }
      else
      {
        ch.options[index++] = new Option ( ch.xdefault, "", false, false );
      }
    }
    var selectedIndex = -1 ;
    while ( en.hasNext() )
    {
      var optionIn = en.next() ;
      var valueIn = optionIn.getAttribute ( "value" ) ;
      if ( ! optionIn.firstChild ) continue ;
      var textIn = optionIn.firstChild.nodeValue ;
      if ( isDate )
      {
        var date = DateUtils.parseDate ( textIn ) ;
        textIn = DateUtils.formatDateShort ( date ) ;
      }
      else
      if ( isDateTime )
      {
        var date = DateUtils.parseDate ( textIn ) ;
        textIn = DateUtils.formatDateTimeShort ( date ) ;
      }
      var selected = optionIn.getAttribute ( "selected" ) === "true" ;
      if ( ! valueIn ) valueIn = textIn ;
      if ( valueIn == defaultValue )
      {
        selectedIndex = index ;
        ch.options[index++] = new Option ( textIn, valueIn, true, true );
      }
      else
      if ( selected )
      {
        selectedIndex = index ;
        ch.options[index++] = new Option ( textIn, valueIn, true, true );
      }
      else
        ch.options[index++] = new Option ( textIn, valueIn, false, false );
    }
    if ( ch.xPreselectedIndex >= 0 && ch.options.length > ch.xPreselectedIndex )
    {
      ch.selectedIndex = ch.xPreselectedIndex ;
    }
    if ( ch.xSorted ) this.sortChoice ( ch, selectedIndex ) ;
  }
};
TGuiClass.prototype.sortChoice = function ( eChoice, selectedIndex )
{
  if ( ! eChoice.xSorted ) return ;
  var l = [] ;
  var ol = eChoice.options ;
  var i ;
  var selectedOption = null ;
  for ( i = 0 ; i < ol.length ; i++ )
  {
    l[i] = ol[i] ;
    if ( selectedIndex === i )
    {
      selectedOption = l[i] ;
    }
  };
  l.sort ( function ( e1, e2 )
  {
    var factor = 1 ;
    return ( e1.text.toUpperCase() > e2.text.toUpperCase() ? factor : - factor ) ;
  } ) ;
  ol.length = 0 ;
  var indexToBeSelected = 0 ;
  for ( i = 0 ; i < l.length ; i++ )
  {
    ol[i] = l[i] ;
    if ( selectedIndex >= 0 )
    {
      if ( l[i] === selectedOption ) indexToBeSelected = i ;
    }
  };
  eChoice.selectedIndex = indexToBeSelected ;
};
TGuiClass.prototype.layoutDate = function ( hDate, externalAttributes, layoutContext, a )
{
  if ( hDate.xLayouted ) return ;
  hDate.xLayouted = true ;

  var xDate = new TXml ( hDate ) ;

  var xId = hDate.xId ;

  hDate.hIcon = xDate.getDomById ( 'Calendar.Icon.Image' ) ;
  hDate.hDay = xDate.getDomByName ( "Day" ) ;
  hDate.hMonth = xDate.getDomByName ( "Month" ) ;
  hDate.hYear = xDate.getDomByName ( "Year" ) ;

  hDate.hDay.id = xId + "Day" ;
  hDate.hMonth.id = xId + "Month" ;
  hDate.hYear.id = xId + "Year" ;

  hDate.hDay.xClassName = "DateDay" ;
  hDate.hMonth.xClassName = "DateMonth" ;
  hDate.hYear.xClassName = "DateYear" ;

  var today = new Date() ;

  var a = externalAttributes[xId] ;
  hDate.defaultTime = a["default-time"] ;
  if ( hDate.defaultTime )
  {
    hDate.defaultTime = hDate.defaultTime.replace ( /:/g, "" ) ;
  }
  hDate.resettable = a['resettable'] ;
  hDate.defaultDayOfMonth = a["default-day-of-month"] ;
  hDate.showMonthNames = a["show-month-names"] ;
  hDate.showDayOfMonth = a["show-day-of-month"] ;

  var sDefaultDate = a["defaultDate"] ;
  if ( ! sDefaultDate ) sDefaultDate = "today" ;

  var defaultDate = today ;

  if ( sDefaultDate )
  {
    if ( sDefaultDate == "today" )
    {
      defaultDate = today ;
    }
    else
    if ( sDefaultDate.startsWith ( "today" ) )
    {
      var posP = sDefaultDate.indexOf ( '+' ) ;
      var posM = sDefaultDate.indexOf ( '-' ) ;
      var sign = "" ;
      if ( posP > 0 )
      {
        var n = parseInt ( sDefaultDate.substring ( posP+1 ) ) ;
        if ( isNaN ( n ) ) defaultDate = today ;
				else
				{
          hDate.defaultDateOffsetMillis = n * 24 * 3600 * 1000 ;
          defaultDate = new Date ( today.getTime() + hDate.defaultDateOffsetMillis ) ;
        }
      }
      else
      if ( posM > 0 )
      {
        var n = parseInt ( sDefaultDate.substring ( posM+1 ) ) ;
        if ( isNaN ( n ) ) defaultDate = today ;
        else
        {
          hDate.defaultDateOffsetMillis = - n * 24 * 3600 * 1000 ;
          defaultDate = new Date ( today.getTime() + hDate.defaultDateOffsetMillis ) ;
				}
      }
    }
    else
    {
      defaultDate = today ;
    }
  }
  hDate.defaultDate = defaultDate
  if ( hDate.defaultTime )
  {
    defaultDate.setMilliseconds ( 0 ) ;
    if ( hDate.defaultTime.length >= 4 )
    {
      var ih = parseInt ( hDate.defaultTime.substring ( 0, 2 ) ) ;
      if ( ! isNaN ( ih ) ) defaultDate.setHours ( ih ) ;
      var im = parseInt ( hDate.defaultTime.substring ( 2, 4 ) ) ;
      if ( ! isNaN ( im ) ) defaultDate.setMinutes ( im ) ;
    }
    if ( hDate.defaultTime.length == 6 )
    {
      var is = parseInt ( hDate.defaultTime.substring ( 4, 6 ) ) ;
      if ( ! isNaN ( is ) ) defaultDate.setSeconds ( is ) ;
    }
  }

  var formatIn = a["formatIn"] ;
  var formatOut = a["formatOut"] ;

  var minDate = a["minDate"] ;
  if ( minDate )
  {
    var dd = this._calculateDateFromString ( minDate ) ;
  	hDate.minDate = dd ;
  }
  else
  {
    var minYear = parseInt ( a["minYear"] ) ;
    if ( isNaN ( minYear ) ) minYear = TSys.DEFAULT_MIN_YEAR_FOR_DATE ; //-2 ;
    if ( minYear <= 0 || minYear < 1000 ) minYear = today.getFullYear() + minYear ;
    hDate.minDate = new Date ( minYear, 0, 1, 0, 0, 0 ) ;
  }
  var maxYear = parseInt ( a["maxYear"] ) ;
  if ( isNaN ( maxYear ) ) maxYear = TSys.DEFAULT_MAX_YEAR_FOR_DATE ; // 8 ;

  if ( maxYear <= 0 || maxYear < 1000 ) maxYear = today.getFullYear() + maxYear ;
	var maxDate = a["maxDate"] ;
  if ( maxDate )
  {
    var dd = this._calculateDateFromString ( maxDate ) ;
		if ( dd )
		{
  		hDate.maxDate = dd ;
  		hDate.maxDate2 = dd ;
		}
  }
  if ( ! hDate.maxDate )
	{
    hDate.maxDate = new Date ( maxYear, 11, 31, 23, 59, 59 ) ;
	}

  if ( hDate.minDate.getTime() > hDate.maxDate.getTime() )
  {
    var millis = hDate.minDate.getTime() ;
    hDate.minDate.setTime ( hDate.maxDate.getTime() ) ;
    hDate.maxDate.setTime ( millis ) ;
  }
  if ( hDate.maxDate.getFullYear() - hDate.minDate.getFullYear() > 100 )
  {
    hDate.maxDate.setFullYear ( hDate.minDate.getFullYear() + 100 ) ;
  }

  if ( defaultDate.getTime() < hDate.minDate.getTime() ) defaultDate.setTime ( hDate.minDate.getTime() ) ;
  hDate.hDay.options.length = 0 ;
  var defaultDay = defaultDate.getDate() - 1 ;
  var defaultMonth = defaultDate.getMonth() ;
  var defaultYear = defaultDate.getFullYear() ;

  hDate.formatIn = formatIn ;
  hDate.formatOut = formatOut ;

  var maxDays = DateUtils.getMaxDays ( defaultDate ) ;

  var index = 0 ;
  if ( hDate.xdefault )
  {
    hDate.hDay.options[index++] = new Option ( "", "", false, false );
  }
  for ( var i = 0 ; i < maxDays ; i++ )
  {
    hDate.hDay.options[index++] = new Option ( i+1, i, false, false );
  }

  hDate.hMonth.options.length = 0 ;

  index = 0 ;
  if ( hDate.xdefault )
  {
    hDate.hMonth.options[index++] = new Option ( "", "", false, false );
  }
  if ( hDate.showMonthNames )
  {
    var monthNames = DateUtils.getMonthNames() ;
    for ( var i = 0 ; i < 12 ; i++ )
    {
      hDate.hMonth.options[index++] = new Option ( monthNames[i], i, false, false );
    }
  }
  else
  {
    for ( var i = 0 ; i < 12 ; i++ )
    {
      hDate.hMonth.options[index++] = new Option ( i+1, i, false, false );
    }
  }

  this._fillYearsInDate ( hDate, defaultYear ) ;
 
  if ( ! hDate.xdefault )
  {
    hDate.hDay.selectedIndex = defaultDay ;
    hDate.hMonth.selectedIndex = defaultMonth ;
  }

  if ( a && a["onchange"] )
  {
    hDate.fExecutor = new TFunctionExecutor ( a["onchange"], layoutContext ) ;
  }

  hDate.hDay.xClassName = "DateDay" ;
  hDate.hMonth.xClassName = "DateMonth" ;
  hDate.hYear.xClassName = "DateYear" ;

  hDate.hDay.id = "O" + TSys.getCounter() ;
  hDate.hDay.xId = hDate.hDay.id ;
  hDate.hMonth.id = "O" + TSys.getCounter() ;
  hDate.hMonth.xId = hDate.hMonth.id ;
  hDate.hYear.id = "O" + TSys.getCounter() ;
  hDate.hYear.xId = hDate.hYear.id ;

  if ( hDate.xClassName == "DateTime" )
  {
    hDate.hHour = xDate.getDomByName ( "Hour" ) ;
    hDate.hMinute = xDate.getDomByName ( "Minute" ) ;
    hDate.hSecond = xDate.getDomByName ( "Second" ) ;
    hDate.hHour.xClassName = "DateHour" ;
    hDate.hMinute.xClassName = "DateMinute" ;
    if ( hDate.hSecond ) hDate.hSecond.xClassName = "DateSecond" ;
    hDate.hHour.className = "ThemeTextField" ;
    hDate.hMinute.className = "ThemeTextField" ;
    if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextField" ;
    hDate.hHour.style.width = ( this.M_width * 2 ) + "px" ;
    hDate.hMinute.style.width = ( this.M_width * 2 ) + "px" ;
    if ( hDate.hSecond ) hDate.hSecond.style.width = ( this.M_width * 2 ) + "px" ;

    hDate.hHour.id = "O" + TSys.getCounter() ;
    hDate.hHour.xId = hDate.hHour.id ;
    hDate.hMinute.id = "O" + TSys.getCounter() ;
    hDate.hMinute.xId = hDate.hMinute.id ;
    if ( hDate.hSecond )
    {
      hDate.hSecond.id = "O" + TSys.getCounter() ;
      hDate.hSecond.xId = hDate.hSecond.id ;
    }
  }
  if ( hDate.mandatory )
  {
    hDate.hDay.className = "ThemeChoiceMandatory" ;
    hDate.hMonth.className = "ThemeChoiceMandatory" ;
    hDate.hYear.className = "ThemeChoiceMandatory" ;
    if ( hDate.hHour )
    {
      hDate.hHour.className = "ThemeTextFieldMandatory" ;
      hDate.hMinute.className = "ThemeTextFieldMandatory" ;
      if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextFieldMandatory" ;
    }
  }
  else
  {
    hDate.hDay.className = "ThemeChoice" ;
    hDate.hMonth.className = "ThemeChoice" ;
    hDate.hYear.className = "ThemeChoice" ;
    if ( hDate.hHour )
    {
      if ( hDate.xdefault )
      {
        hDate.hHour.value = "" ;
        hDate.hMinute.value = "" ;
        if ( hDate.hSecond ) hDate.hSecond.value = "" ;
      }
      else
      {
//        hDate.hHour.value = TSys.LZ ( defaultDate.getHours() ) ;
//        hDate.hMinute.value = TSys.LZ ( defaultDate.getMinutes() ) ;
//        if ( hDate.hSecond ) hDate.hSecond.value = TSys.LZ ( defaultDate.getSeconds() ) ;
        hDate.hHour.value = defaultDate.getHours() ;
        hDate.hMinute.value = defaultDate.getMinutes() ;
        if ( hDate.hSecond ) hDate.hSecond.value = defaultDate.getSeconds() ;
      }
    }
  }
  if ( hDate.hHour )
  {
    this.addEventListener ( hDate.hHour, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
    this.addEventListener ( hDate.hMinute, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
    if ( hDate.hSecond )
    {
      this.addEventListener ( hDate.hSecond, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
    }

    if ( layoutContext.listenerContext )
    {
      layoutContext.listenerContext.addOnKeyUpEvent ( hDate.hHour ) ;
      layoutContext.listenerContext.addOnKeyUpEvent ( hDate.hMinute ) ;
      if ( hDate.hSecond ) layoutContext.listenerContext.addOnKeyUpEvent ( hDate.hSecond ) ;
    }
  }
  if ( hDate.xdefault )
  {
  }
  if ( layoutContext.listenerContext )
  {
    layoutContext.listenerContext.addOnChangeEvent ( hDate.hDay ) ;
    layoutContext.listenerContext.addOnChangeEvent ( hDate.hMonth ) ;
    layoutContext.listenerContext.addOnChangeEvent ( hDate.hYear ) ;
  }
  this.addEventListener ( hDate.hDay, "change", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
  this.addEventListener ( hDate.hMonth, "change", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
  this.addEventListener ( hDate.hYear, "change", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;

  this.addEventListener ( hDate.hDay, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
  this.addEventListener ( hDate.hMonth, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;
  this.addEventListener ( hDate.hYear, "keyup", this.checkDateFromEvent.bindAsEventListener ( this ) ) ;

  hDate.style.height = hDate.hYear.offsetHeight + "px" ;
  for ( var ch = hDate.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    ch.style.top = Math.round ( ( hDate.offsetHeight - ch.offsetHeight ) / 2 ) + "px" ;
  }
  if ( ! hDate.xToBeFlushed ) hDate.xToBeFlushed = [] ;
  hDate.dateCalendarHandler = new DateCalendarHandler ( hDate, hDate.hIcon, layoutContext ) ;
  hDate.xToBeFlushed.push ( hDate.dateCalendarHandler ) ;

  var persistentValue = "" ;
  if ( a )
  {
    persistentValue = a["persistentValue"] ;
  }
  if ( persistentValue )
  {
    this.setValuesDate ( hDate, persistentValue ) ;
  }
};
TGuiClass.prototype._calculateDateFromString = function ( strDate )
{
	var d ;
	var today = new Date() ;
  if ( strDate.startsWith ( "now" ) )
  {
    d = new Date() ;
    strDate = strDate.substring ( "now".length ) ;
    if ( ! strDate ) strDate = "" ;
  }
  else
  if ( strDate.startsWith ( "today" ) )
  {
    d = new Date ( today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0 ) ;
    strDate = strDate.substring ( "today".length ) ;
    if ( ! strDate ) strDate = "" ;
  }
  else
  {
    d = new Date() ;
  }
  var posP = strDate.indexOf ( '+' ) ;
  var posM = strDate.indexOf ( '-' ) ;
  var sign = "" ;
  if ( posP === 0 )
  {
    sign = '+' ;
    strDate = strDate.substring ( posP ) ;
  }
  else
  if ( posM === 0 )
  {
    sign = '-' ;
    strDate = strDate.substring ( posM ) ;
  }
  else
  if ( strDate.length == 10 ) // yyyy-MM-dd
  {
    d = DateUtils.parseDate ( strDate ) ;
  }
  if ( sign )
  {
    var sumMillis = 0 ;
    var posT = strDate.indexOf ( 'T' ) ;
    var posB = strDate.indexOf ( ' ' ) ;
    if ( posT > 0 )
    {
      var n = parseInt ( strDate.substring ( 1, posT ) ) ;
      if ( ! isNaN ( n ) ) sumMillis += n * 24 * 60 * 60 * 1000 ;
      strDate = strDate.substring ( posT + 1 ) ;
    }
    else
    if ( posB > 0 )
    {
      var n = parseInt ( strDate.substring ( 1, posB ) ) ;
      if ( ! isNaN ( n ) ) sumMillis += n * 24 * 60 * 60 * 1000 ;
      strDate = strDate.substring ( posB + 1 ) ;
    }
    else
    {
      strDate = strDate.substring ( 1 ) ;
      var n = parseInt ( strDate ) ;
      if ( ! isNaN ( n ) ) sumMillis += n * 24 * 60 * 60 * 1000 ;
    }
    if ( strDate.indexOf ( ':' ) >= 0 )
    {
      var a = strDate.split ( ':' ) ;
      if ( a.length > 0 ) { var n = parseInt ( a[0] ) ; if ( ! isNaN ( n ) ) sumMillis += n * 60 * 60 * 1000 ; }
      if ( a.length >= 1 ) { var n = parseInt ( a[1] ) ; if ( ! isNaN ( n ) ) sumMillis += n * 60 * 1000 ; }
      if ( a.length >= 2 ) { var n = parseInt ( a[2] ) ; if ( ! isNaN ( n ) ) sumMillis += n * 1000 ; }
    }

    if ( sumMillis && sign == '+' ) d.setTime ( d.getTime() + sumMillis ) ;
    else
    if ( sumMillis && sign == '-' ) d.setTime ( d.getTime() - sumMillis ) ;
  }
	return d ;
};
TGuiClass.prototype._fillYearsInDate = function ( hDate, defaultYear, selectedIndex )
{
  hDate.hYear.options.length = 0 ;

  var y = hDate.minDate.getFullYear() ;
  var foundIndex = -1 ;

  var index = 0 ;
  if ( hDate.xdefault )
  {
    hDate.hYear.options[index++] = new Option ( "", "", false, false );
  }

  var diff = hDate.maxDate.getFullYear() - hDate.minDate.getFullYear() ;
  for ( var i = 0 ; i <= diff ; i++ )
  {
    hDate.hYear.options[index++] = new Option ( y, y, false, false );
    if ( defaultYear == y )
    {
      foundIndex = i ;
    }
    y++ ;
  }
  if ( ! hDate.xdefault )
  {
    if ( foundIndex >= 0 ) hDate.hYear.selectedIndex = foundIndex ;
  }
  if ( selectedIndex >= 0 )
  {
    hDate.hYear.selectedIndex = selectedIndex ;
  }

};
/**
 *  @constructor
 */
DateCalendarHandler = function ( hDate, hIcon, layoutContext )
{
  this.date = new TDate ( hDate ) ;
  var x = new TXml() ;
  var xx = x.add ( "Calendar" ) ;
  xx.addAttribute ( "name", "ABC" ) ;
  xx.addAttribute ( "show-buttons", "true" ) ;
  xx.addAttribute ( "hidden", "true" ) ;
  this.calendar = TGui.createElement ( x, this.date.getDom() ).jsPeer ;
  this.date.getDom().appendChild ( this.calendar.getDom() ) ;
  this.calendar.addActionListener ( this, this.action ) ;
  this.calendar.addItemListener ( this, this.selected ) ;
  var c = new TComponent ( hIcon ) ;
  c.addEventListener ( "click", this, this.start ) ;
  this.calendar.dom.style.zIndex = TGui.zIndexCalendar ;
  this.calendar.dom.parentNode.removeChild ( this.calendar.dom ) ;
  document.body.appendChild ( this.calendar.dom ) ;
  this.first = true ;
  this._closeOnMouseDown = new TFunctionExecutor ( this, this.globalMouseDown ) ;
  TGlobalEventHandler.addOnMouseDown ( this._closeOnMouseDown ) ;
  this._closeOnKeyDown = new TFunctionExecutor ( this, this.globalKeyDown ) ;
  TGlobalEventHandler.addOnKeyDown ( this._closeOnKeyDown ) ;
  this.listenerContext = layoutContext.getListenerContext() ;
  this.calendar.ondblclick = new TFunctionExecutor ( this, this.ondblclick ) ;
} ;
DateCalendarHandler.prototype =
{
  flush: function()
  {
    if ( this._flushed ) return ;
    this._flushed = true ;
    TGlobalEventHandler.removeOnMouseDown ( this._closeOnMouseDown ) ;
    TGlobalEventHandler.removeOnKeyDown ( this._closeOnKeyDown ) ;
    this.calendar.dom.parentNode.removeChild ( this.calendar.dom ) ;
  },
  globalKeyDown: function ( event )
  {
    if ( this._flushed ) return ;
    var ev = new TEvent ( event ) ;
    if ( !ev.isEscape() ) return true ;
    this.calendar.setVisible ( false ) ;
    return true ;
  },
  globalMouseDown: function ( event )
  {
    if ( this._flushed ) return ;
    var ev = new TEvent ( event ) ;
    var r = this.calendar.getBoundsOnPage() ;
    var mx = ev.getX() ;
    var my = ev.getY() ;

    if ( r.contains ( mx, my ) )
    {
      return true ;
    }
    this.calendar.setVisible ( false ) ;
    return true ;
  },
  start: function ( event )
  {
    if ( this.date.dom.disabled ) return ;
    if ( this.first )
    {
      this.first = false ;
    }
    var locOnPage = this.date.getLocationOnPage() ;
    locOnPage.x += 4 ;
    locOnPage.y += this.date.dom.offsetHeight ;
    this.calendar.setLocation ( locOnPage ) ;
    this.calendar.setVisible ( true ) ;
    var d = this.date.getDate() ;
    this.dateWasNull = ! d ;
    this.calendar.setDate ( d ) ;
  },
  ondblclick: function ( event )
  {
    var ev = new TActionEvent ( event, "*" ) ;
    this.date.setDate( this.calendar.getDate() ) ;
    ev.setHtmlSource ( this.date.getDom() ) ;
    if ( this.listenerContext )
    {
      this.listenerContext._execute ( ev ) ;
    }
    if ( this.date.getDom().fExecutor )
    {
      this.date.getDom().fExecutor.executeWithEvent ( ev ) ;
    }
    this.calendar.setVisible ( false ) ;
  },
  action: function ( ev )
  {
    if ( ev.getAction() == "OK" )
    {
      this.date.setDate( this.calendar.getDate() ) ;
      ev.setHtmlSource ( this.date.getDom() ) ;
      if ( this.listenerContext )
      {
        this.listenerContext._execute ( ev ) ;
      }
      if ( this.date.getDom().fExecutor )
      {
        this.date.getDom().fExecutor.executeWithEvent ( ev ) ;
      }
    }
    else
    {
      if ( this.dateWasNull )
      {
        this.date.reset() ;
      }
      else
      {
        this.date.setDate ( this.calendar.getDate() ) ;
      }
    }
    this.calendar.setVisible ( false ) ;
  },
  selected: function ( ev )
  {
    this.date.setDate ( this.calendar.getDate() ) ;
  }
} ;
TGuiClass.prototype.layoutNativeButton = function ( ch, externalAttributes, layoutContext, a )
{
  if ( ch.xLayouted ) return ;
  ch.xLayouted = true ;
  var ubm = true ;
  if ( a && typeof ( a["use-button-minimum"] ) != 'undefined' && ! a["use-button-minimum"] ) ubm = false ;
  TGui.layoutButtonLike ( { dom:ch, imgWidth:16
		  , useButtonMinimum:ubm
		  , reverse:ch.xReverse
		  , stacked:ch.xStacked
		  , ignoreCWidth:true
		  , addPadding:true
		  } ) ;
  if ( ch.disabled && ch.eImg ) this.setOpacity ( ch.eImg, 0.5 ) ;
};
TGuiClass.prototype.layoutButton = function ( ch, externalAttributes, layoutContext, a )
{
  if ( ch.xLayouted ) return ;
  ch.xLayouted = true ;
  var ubm = true ;
  if ( a && typeof ( a["use-button-minimum"] ) != 'undefined' && ! a["use-button-minimum"] ) ubm = false ;
  if ( ch.nodeName.toUpperCase() == "BUTTON" )
  {
//log ( "-------------- ch ---------------" ) ;
//log ( TGui.getComputedStyleInt ( ch, "margin-top", -1 ) ) ;
    TGui.layoutButtonLike ( { dom:ch, imgWidth:16
		           , useButtonMinimum:ubm
		           , reverse:ch.xReverse
		           , stacked:ch.xStacked
		           , ignoreCWidth:true
		           , addPadding:true
		           } ) ;
  }
  else
  {
    TGui.layoutButtonLike ( { dom:ch, imgWidth:16
		           , useButtonMinimum:ubm
		           , reverse:ch.xReverse
		           , stacked:ch.xStacked
		           } ) ;
  }
  if ( ch.disabled && ch.eImg ) this.setOpacity ( ch.eImg, 0.5 ) ;
};
TGuiClass.prototype.layoutNotebookButton = function ( ch, externalAttributes, state )
{
  var style = "Style" ;
  if ( state ) style = "Style." + state ;
  if ( ch.xLayouted )
  {
    TGui.layoutButtonLike ( { dom:ch, imgWidth:16, useButtonMinimum:true, contentOnly:true, style:style } ) ;
    return ;
  }
  ch.xLayouted = true ;
  TGui.layoutButtonLike ( { dom:ch, imgWidth:16, useButtonMinimum:true } ) ;
};
TGuiClass.prototype.layoutButtonLike = function ( p )
{
var bb = p.dom.nodeName.toUpperCase() == "BUTTON" ;
// if ( ! bb && p.dom.className .startsWith ( "normal" ) )
// {
//   log ( p.dom.className )
//   log ( p.dom.xClassName )
//   log ( p.dom.name )
//   log ( "border=" + TGui.getComputedStyle ( p.dom, "border" ) ) ;
//   log ( "p.dom.style.border=" + p.dom.style.border ) ;
// }
  var ffButton = false ;
  var ieButton = false ;
	var ieButtonFactor = 0.76 ;
  if ( Tango.ua.firefox && Tango.ua.ffVersion < 10 && p.dom.nodeName.toUpperCase() == "BUTTON" )
  {
    ffButton = true ;
  }
  if ( Tango.ua.ie && Tango.ua.ieVersion == 8 && p.dom.nodeName.toUpperCase() == "BUTTON" )
  {
   	ieButton = true ;
  }
  var width  = 0 ;
  var height = 0 ;
  var dx = 4 ;

  var pad = TGui.getPadding ( p.dom ) ;
  var style = "Style" ;
  if ( p.style ) style = p.style ;
  var ts = Tango.getThemeStyle ( p.dom.xClassName, style ) ;
  var pd = ts.padding ;

  var pd_top = pd.top ;
  var pd_left = pd.left ;
  var pd_bottom = pd.bottom ;
  var pd_right = pd.right ;
  if ( ! pd_top ) pd_top = pad.top ;
  if ( ! pd_left ) pd_left = pad.left ;
  if ( ! pd_bottom ) pd_bottom = pad.bottom ;
  if ( ! pd_right ) pd_right = pad.right ;

  p.dom.style.paddingTop = pd_top + "px" ;
  p.dom.style.paddingLeft = pd_left + "px" ;
  p.dom.style.paddingBottom = pd_bottom + "px" ;
  p.dom.style.paddingRight = pd_right + "px" ;
  p.dom.xThemeStyle = { shiftX:ts.shiftX, shiftY:ts.shiftY } ;

  var imgWidth = p.imgWidth ? p.imgWidth : 16 ;
  var imgHeight = p.imgHeight ? p.imgHeight : imgWidth ;

  var xch  = new TXml ( p.dom ) ;
  var img = xch.getDomByClassName ( "ButtonImage" ) ;
  var txt = xch.getDomByClassName ( "ButtonText" ) ;
  var str = p.closerClassName ? p.closerClassName : "ThemeNotebookButtonCloser" ;
  var closer = xch.getDomByClassName ( str ) ;
  if ( ! closer ) closer = xch.getDomByClassName ( "Arrow" ) ;

  if ( ! p.textY ) p.textY = 0 ;
  if ( ! p.imgY ) p.imgY = 0 ;
  p.dom.eImg = img ;
  p.dom.eTxt = txt ;
  p.dom.eCloser = closer ;

  var cWidth = TGui.getComputedStyleInt ( p.dom, "width", -1 ) ;
  var cHeight = TGui.getComputedStyleInt ( p.dom, "height", -1 ) ;

  var width = 0 ;
  var height = 0 ;
  if ( ! p.contentOnly )
  {
    if ( img && txt )
    {
      txt.style.position = "absolute" ;
      img.style.position = "absolute" ;
      img.style.width = imgWidth + "px" ;
      img.style.height = imgHeight + "px" ;
      img.xClassName = "ButtonImage" ;
      txt.xClassName = "ButtonText" ;
      if ( p.stacked )
      {
        width = Math.max ( imgWidth, txt.offsetWidth ) ;
        height = imgHeight + dx + txt.offsetHeight ;
      }
      else
      {
        width = imgWidth + dx + txt.offsetWidth ;
        height = Math.max ( imgHeight, txt.offsetHeight ) ;
      }
    }
    else
    if ( img )
    {
      img.style.width = imgWidth + "px" ;
      img.style.height = imgHeight + "px" ;
      width = imgWidth ;
      height = img.offsetHeight ;
      img.style.position = "absolute" ;
      img.xClassName = "ButtonImage" ;
    }
    else
    if ( txt )
    {
      width = txt.offsetWidth ;
      height = txt.offsetHeight ;
      txt.style.position = "absolute" ;
      txt.xClassName = "ButtonText" ;
    }
    if ( closer )
    {
      var cWidthCorrected = cWidth - closer.offsetLeft - closer.offsetWidth ;
      if ( cWidthCorrected <= 0 )
      {
        cWidth = 0 ;
        cHeight = 0 ;
      }
      width += closer.offsetWidth + dx ;
      closer.style.position = 'absolute' ;
    }
    var normalizeWidth = true ;
    var normalizeHeight = true ;
    if ( p.addPadding )
    {
      width += pd_left + pd_right ;
      height += pd_top + pd_bottom ;
    }
    if ( ! p.ignoreCWidth )
    {
      if ( cWidth > 0 )
      {
        normalizeWidth = false ;
        width = cWidth ;
      }
      if ( cHeight > 0 )
      {
        normalizeHeight = false ;
        height = cHeight ;
      }
    }

    if ( p.dom.style.width )
    {
      normalizeWidth = false ;
      width = cWidth ;
      if ( ffButton ) width += Math.round ( ( pd_left + pd_right ) * 1.3 ) ;
    }
    if ( p.dom.style.height )
    {
      normalizeHeight = false ;
      height = cHeight ;
    }
    if ( normalizeWidth )
    {
      if ( p.useButtonMinimum && txt )
      {
        width =  Math.max ( width, TGui.pushButtonMinWidth ) ;
        if ( normalizeHeight ) height = Math.max ( height, TGui.pushButtonContentMinHeight ) ;
      }
      width = Math.floor ( ( width + TGui.M_width - 1 ) / TGui.M_width ) * TGui.M_width  ;
    }
    else
    if ( normalizeHeight )
    {
      if ( p.useButtonMinimum && txt )
      {
        height = Math.max ( height, TGui.pushButtonContentMinHeight ) ;
      }
    }
    p.dom.style.width = width + "px" ;
    p.dom.style.height = height + "px" ;
  }

  var domInnerWidth = p.dom.offsetWidth - pd_left - pd_right ;
  var domInnerHeight = p.dom.offsetHeight - pd_top - pd_bottom ;

  if ( img && txt )
  {
    if ( p.stacked )
    {
      var contentWidth = Math.max ( img.offsetWidth, txt.offsetWidth ) ;
      if ( closer ) contentWidth += dx + closer.offsetWidth ;
      var ximg = Math.round ( ( p.dom.offsetWidth - img.offsetWidth ) / 2 ) ;
      var xtxt = Math.round ( ( p.dom.offsetWidth - txt.offsetWidth ) / 2 ) ;
      if ( p.alignLeft ) { ximg = pd_left ; xtxt = pd_left ; }
      if ( p.reverse )
      {
        var y = 0 ;
        y = ( pd_top + domInnerHeight - img.offsetHeight ) ;
        if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
        if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
        y = Math.round ( y ) ;
        p.dom.xThemeStyle.imgY = y ;
        img.style.top = y + "px" ;
        y = 0 ;
        y = pd_top ;
        if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
        if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
        y = Math.round ( y ) ;
        p.dom.xThemeStyle.txtY = y ;
        txt.style.top = y + "px" ;

        var x = 0 ;
        x = xtxt ;
        if ( ffButton ) x -= pd_left + pd_right / 2 ;
        x = Math.round ( x ) ;
        txt.style.left = x + "px" ;
        x = 0 ;
        x = ximg ;
        if ( ffButton ) x -= pd_left + pd_right / 2 ;
        x = Math.round ( x ) ;
        img.style.left = x + "px" ;
      }
      else
      {
        var y = 0 ;
        y = pd_top ;
        if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
        if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
        y = Math.round ( y ) ;
        p.dom.xThemeStyle.imgY = y ;
        img.style.top = y + "px" ;
        y = 0 ;
        y = ( pd_top + domInnerHeight - txt.offsetHeight ) ;
        if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
        if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
        y = Math.round ( y ) ;
        p.dom.xThemeStyle.txtY = y ;
        txt.style.top = y + "px" ;
        var x = 0 ;
        x = ximg ;
        if ( ffButton ) x -= pd_left + pd_right / 2 ;
        x = Math.round ( x ) ;
        img.style.left = x + "px" ;
        x = 0 ;
        x = xtxt ;
        if ( ffButton ) x -= pd_left + pd_right / 2 ;
        x = Math.round ( x ) ;
        txt.style.left = x + "px" ;
      }
    }
    else
    {
      var maxTxtWidth = p.dom.offsetWidth - pd_left - pd_right ;
      if ( closer ) maxTxtWidth -= img.offsetWidth + dx + dx + closer.offsetWidth ;
      if ( txt.offsetWidth > maxTxtWidth )
      {
        txt.style.width = maxTxtWidth + "px" ;
        txt.style.overflow = "hidden" ;
      }
      var contentWidth = img.offsetWidth + dx + txt.offsetWidth ;
      if ( closer ) contentWidth += dx + closer.offsetWidth ;
      var y = 0 ;
      if ( p.imgY <= 0 ) y = Math.round ( pd_top + ( domInnerHeight - img.offsetHeight ) / 2 ) ;
      else               y = p.imgY ;
      if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
      if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
      y = Math.round ( y ) ;
      p.dom.xThemeStyle.imgY = y ;
      img.style.top = y + "px" ;
      y = 0 ;
      if ( p.textY <= 0 ) y = Math.round ( pd_top + ( domInnerHeight - txt.offsetHeight ) / 2 ) ;
      else                y = p.textY ;
      if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
      if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
      y = Math.round ( y ) ;
      p.dom.xThemeStyle.txtY = y ;
      txt.style.top = y + "px" ;
      var x = Math.round ( ( p.dom.offsetWidth - contentWidth ) / 2 ) ;
      if ( p.alignLeft ) x = pd_left ;
      if ( p.reverse )
      {
        txt.style.left = x + "px" ;
        x += txt.offsetWidth + dx ;
        if ( ffButton ) x -= pd_left ;
        img.style.left = x + "px" ;
      }
      else
      {
        if ( p.imgIndent )
        {
          x -= img.offsetWidth ;
          if ( x < 0 )
          {
            x += img.offsetWidth - 16 ;
          }
        }
        if ( ffButton ) x -= pd_left + pd_right / 2 ;
        x = Math.round ( x ) ;
        img.style.left = x + "px" ;
        x += img.offsetWidth + dx ;
        txt.style.left = x + "px" ;
      }
    }
  }
  else
  if ( txt )
  {
    var maxTxtWidth = p.dom.offsetWidth - pd_left - pd_right ;
    if ( closer ) maxTxtWidth -= dx + closer.offsetWidth ;
    if ( txt.offsetWidth > maxTxtWidth )
    {
      txt.style.width = maxTxtWidth + "px" ;
      txt.style.overflow = "hidden" ;
    }
    var contentWidth = txt.offsetWidth ;
    if ( closer ) contentWidth += dx + closer.offsetWidth ;

    var x = Math.round ( pd_left + ( domInnerWidth - contentWidth ) / 2 ) ;
    if ( p.alignLeft ) x = pd_left ;
    if ( p.imgIndent ) x += dx ;
    if ( ffButton ) x -= pd_left + pd_right / 2 ;
    x = Math.round ( x ) ;
    txt.style.left = x + "px" ;
    if ( p.textY <= 0 )
    {
      var y = Math.round ( pd_top + ( domInnerHeight - txt.offsetHeight ) / 2 ) ;
      if ( ffButton ) y -= ( pd_top + pd_bottom ) * 1.3 ;
      if ( ieButton ) y -= ( pd_top + pd_bottom ) * ieButtonFactor ;
      y = Math.round ( y ) ;
      p.dom.xThemeStyle.txtY = y ;
      txt.style.top = y + "px" ;
    }
    else
    {
      txt.style.top = p.textY + "px" ;
    }
  }
  else
  if ( img )
  {
    var contentWidth = img.offsetWidth ;
    if ( closer ) contentWidth += dx + closer.offsetWidth ;
    var x = pd_left + Math.round ( ( domInnerWidth - contentWidth ) / 2 ) ;
    if ( p.alignLeft ) x = pd_left ;
    img.style.left = x + "px" ;
		var y = 0 ;
    if ( p.imgY <= 0 ) y = pd_top + ( domInnerHeight - img.offsetHeight ) / 2 ;
    else               y = p.imgY ;
    y = Math.round ( y ) ;
    p.dom.xThemeStyle.imgY = y ;
    img.style.top = y + "px" ;
  }
  if ( closer )
  {
    closer.style.left = ( p.dom.offsetWidth - closer.offsetWidth - pd_right )  + "px" ;
    closer.style.top = Math.round ( pd_top + ( domInnerHeight - closer.offsetHeight ) / 2 ) + "px" ;
  }
  if ( p.dom.eTxt )
  {
    p.dom.xThemeStyle.txtX = p.dom.eTxt.offsetLeft ;
  }
  if ( p.dom.eImg )
  {
    p.dom.xThemeStyle.imgX = p.dom.eImg.offsetLeft ;
  }
  if ( p.dom.eCloser )
  {
    p.dom.xThemeStyle.closerX = p.dom.eCloser.offsetLeft ;
    p.dom.xThemeStyle.closerY = p.dom.eCloser.offsetTop ;
  }
};
TGuiClass.prototype.layoutToolbarButton = function ( ch, externalAttributes )
{
  if ( ch.xLayouted ) return ;
  ch.xLayouted = true ;
  var stacked = ch.xStacked ? true : true ;
  var xch  = new TXml ( ch ) ;
  var img = xch.getDomByClassName ( "ButtonImage" ) ;
  var w = 16 ;
  var h = 16 ;
  if ( img ) { w = img.offsetWidth ; h = img.offsetHeight ; }
  TGui.layoutButtonLike ( { dom:ch, imgWidth:w, imgHeight:h, XuseButtonMinimum:true, reverse:false, stacked:stacked } ) ;
  if ( ch.disabled && ch.eImg ) this.setOpacity ( ch.eImg, 0.5 ) ;
};
TGuiClass.prototype.calculateLayoutBorders = function ( ch )
{
  if ( ch.xWidthComputed && ch.xHeightComputed ) return ;
  var d = 0 ;

  if ( ! ch.xWidthComputed )
  {
    var n1 = ch.xOuterLeft = TGui.getComputedStyleInt ( ch, "margin-left", 0 ) ;
    ch.xOuterRight = TGui.getComputedStyleInt ( ch, "margin-right", 0 ) ;
    d = TGui.getComputedStyleInt ( ch, "border-left-width", 0 ) ;
    if ( d < 3 ) ch.xOuterLeft += d ;
    d = TGui.getComputedStyleInt ( ch, "border-right-width", 0 ) ;
    if ( d < 3 ) ch.xOuterRight += d ;
    var n4 = ch.xOuterWidth = ch.xOuterLeft + ch.xOuterRight ;
    var n5 = ch.xPaddingLeft = TGui.getComputedStyleInt ( ch, "padding-left", 0 ) ;
    var n6 = ch.xPaddingRight = TGui.getComputedStyleInt ( ch, "padding-Right", 0 ) ;
    ch.xPaddingWidth = ch.xPaddingLeft + ch.xPaddingRight ;
    ch.xWidthComputed = true ;
  }

  if ( ! ch.xHeightComputed )
  {
    ch.xOuterTop = TGui.getComputedStyleInt ( ch, "margin-top", 0 ) ;
    ch.xOuterBottom = TGui.getComputedStyleInt ( ch, "margin-bottom", 0 ) ;
    d = TGui.getComputedStyleInt ( ch, "border-top-width", 0 ) ;
    if ( d < 3 ) ch.xOuterTop += d ;
    d = TGui.getComputedStyleInt ( ch, "border-bottom-width", 0 ) ;
    if ( d < 3 ) ch.xOuterBottom += d ;
    ch.xOuterHeight = ch.xOuterTop + ch.xOuterBottom ;
    ch.xPaddingTop = TGui.getComputedStyleInt ( ch, "padding-top", 0 ) ;
    ch.xPaddingBottom = TGui.getComputedStyleInt ( ch, "padding-bottom", 0 ) ;
    ch.xPaddingHeight = ch.xPaddingTop + ch.xPaddingBottom ;
    ch.xHeightComputed = true ;
  }
};
TGuiClass.prototype.layoutConstraints = function ( htmlDom, layoutAll, depth )
{
  if ( htmlDom.style.display.toUpperCase() == 'NONE' )
  {
    return ;    
  }
  if ( typeof ( depth ) != 'number' ) depth = 0 ;
  var ch = htmlDom.firstChild ;
  if ( depth == 0 && htmlDom.jsPeer && typeof ( htmlDom.jsPeer.resized ) == 'function' )
  {
    htmlDom.jsPeer.resized ( new TDimension ( htmlDom.offsetWidth, htmlDom.offsetHeight ) ) ;
  }

  this.calculateLayoutBorders ( htmlDom ) ;
  var htmlDom_offsetHeight = htmlDom.offsetHeight ;
  var htmlDom_offsetWidth = htmlDom.offsetWidth ;
  if ( htmlDom.nodeName.toUpperCase() == 'BODY' )
  {
    var browserWindowSize = TGui.getAdjustedBrowserWindowSize() ;
    htmlDom_offsetHeight = browserWindowSize.height ;
    htmlDom_offsetWidth = browserWindowSize.width ;
  }
  var lastElement = null ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.style.display.toUpperCase() == 'NONE' )
    {
      ch = ch.nextSibling ;
      continue ;    
    }
    if ( ch.tagName.toUpperCase() == "BR" )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.tagName.toUpperCase() == "STYLE" )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    this.calculateLayoutBorders ( ch ) ;
    lastElement = ch ;
    ch = ch.nextSibling ;
  }

  var i, j ;
  var currentBottom = htmlDom_offsetHeight - htmlDom.xOuterBottom ;
  var currentRight  = htmlDom_offsetWidth - htmlDom.xOuterRight ;

  var topMost = 1000000 ;
  var rightMost = 1000000 ;

  var e = lastElement ;
  var pe = null ; // var previousElementInLine = null ;
  while ( e )
  {
    if ( e.nodeType != DOM_ELEMENT_NODE )
    {
      e = e.previousSibling ;
      continue ;
    }
    if ( e.style.display.toUpperCase() == 'NONE' )
    {
      e = e.previousSibling ;
      continue ;    
    }
    if ( e.style.display.toUpperCase() == 'STYLE' )
    {
      e = e.previousSibling ;
      continue ;    
    }
    if ( e.tagName.toUpperCase() == "BR" )
    {
      currentBottom = topMost ;
      topMost = 1000000 ;
      rightMost = 1000000 ;
      e = e.previousSibling ;
      pe = null ;
      continue ;
    }
    var resized = false ;
    if ( e.xConstraints )
    {
      if ( e.xConstraints.rightAttach )
      {
        if ( e.xConstraints.rightMinus )
        {
          if ( e.xConstraints.rightAttachComponent && e.xConstraints.rightComponent )
          {
            var w = e.xConstraints.rightComponent.offsetLeft - e.xConstraints.rightComponent.xOuterLeft - e.offsetLeft - e.xPaddingWidth - e.xOuterRight - e.xConstraints.rightValue ;
            e.style.width = Math.max ( 0, w ) + "px" ;
          }
          else
          if ( e.xConstraints.rightAttachComponent && pe )
          {
            var w = pe.offsetLeft - pe.xOuterLeft - e.offsetLeft - e.xPaddingWidth - e.xOuterRight - e.xConstraints.rightValue ;
            e.style.width = Math.max ( 0, w ) + "px" ;
          }
          else
          {
            var w = currentRight - e.offsetLeft - e.xPaddingWidth - e.xOuterRight - e.xConstraints.rightValue ;
            e.style.width = Math.max ( 0, w ) + "px" ;
          }
          resized = true ;
        }
        else
        {
          if ( e.xConstraints.rightAttachComponent && pe )
          {
            e.style.left = ( pe.offsetLeft - pe.xOuterLeft - e.offsetWidth - e.xOuterRight - e.xConstraints.rightValue ) + "px" ;
          }
          else
          {
            e.style.left = ( currentRight - e.offsetWidth - e.xOuterRight - e.xConstraints.rightValue ) + "px" ;
          }
        }
      }
      if ( e.xConstraints.bottomAttach )
      {
        if ( e.xConstraints.bottomMinus )
        {
          if ( e.xLayoutIgnore )
          {
            var h2 = htmlDom_offsetHeight - htmlDom.xOuterBottom - e.offsetTop - e.xPaddingHeight - e.xOuterBottom - e.xConstraints.bottomValue ;
            e.style.height = Math.max ( 0, h2 ) + "px" ;
            resized = true ;
          }
          else
          if ( e.xConstraints.bottomAttachComponent && e.xConstraints.bottomComponent )
          {
            var h = e.xConstraints.bottomComponent.offsetTop - e.xConstraints.bottomComponent.xOuterTop - e.offsetTop - e.xPaddingHeight - e.xOuterBottom - e.xConstraints.bottomValue ;
            e.style.height = Math.max ( 0, h ) + "px" ;
          }
          else
          {
            var h2 = currentBottom - e.offsetTop - e.xPaddingHeight - e.xOuterBottom - e.xConstraints.bottomValue ;
            e.style.height = Math.max ( 0, h2 ) + "px" ;
            resized = true ;
          }
        }
        else
        {
          e.style.top = ( currentBottom - e.offsetHeight - e.xOuterBottom - e.xConstraints.bottomValue ) + "px" ;
        }
      }
      if ( e.xConstraints.centerX )
      {
         var p = e.parentNode ;
         e.style.left = Math.max ( 0, Math.round ( ( p.offsetWidth - e.offsetWidth ) / 2 ) ) + "px" ;
      }
      if ( e.xConstraints.centerY )
      {
         var p = e.parentNode ;
         e.style.top = Math.max ( 0, Math.round ( ( p.offsetHeight - e.offsetHeight ) / 2 ) ) + "px" ;
      }
    }
    if ( layoutAll || resized && ! e.xContentIsHtml )
    {
      if (  e.nodeName.toUpperCase() == "DIV"
         || e.nodeName.toUpperCase() == "SPAN"
         )
      {
        if ( ( ! this.guiElementClassNames[e.xClassName] && ! this.guiElementClassNames[e.className] ) || e.xClassName == "TitleLabel" )
        {
          if ( e.firstChild )
          {
            this.layoutConstraints ( e, layoutAll, depth + 1 ) ;
          }
          if ( e.decorator )
          {
            e.decorator.resized(e) ;
          }
          if ( e.jsPeer && e.jsPeer.resized )
          {
            e.jsPeer.resized ( new TDimension ( e.offsetWidth, e.offsetHeight ) ) ;
          }
        }
      }
      else
      if ( e.nodeName.toUpperCase() == 'IFRAME' && ! e.doNotTouch )
      {
        var doc = e.contentDocument;
        if ( ! doc ) doc = e.contentWindow.document;
        try
        {
          var b = doc.body ;
          if ( doc && b )
          {
            if ( b.jsPeer && b.jsPeer.resized )
            {
              b.jsPeer.resized ( new TDimension ( e.offsetWidth, e.offsetHeight ) ) ;
            }
          }
        }
        catch ( exc )
        {
          e.doNotTouch = true ;
        }
      }
      else
      if ( e.jsPeer && e.jsPeer.resized )
      {
        e.jsPeer.resized ( new TDimension ( e.offsetWidth, e.offsetHeight ) ) ;
      }
    }
    topMost = Math.min  ( topMost, ( e.offsetTop - e.xOuterTop ) ) ;
    pe = e ;
    e = e.previousSibling ;
  }
  if ( depth == 0 )
  {
    TGlobalEventHandler.layoutChanged() ;
  }
  return ;
};
TGuiClass.prototype.layoutTitleLabel = function ( htmlDom, externalAttributes )
{
  var a = externalAttributes[htmlDom.id] ;
  var text = a["Text"] ;
  if ( ! text ) text = "&nbsp;" ;

  htmlDom.xClassName = "TitleLabel" ;

  var eLeft = document.createElement ( "div" ) ;
  htmlDom.appendChild ( eLeft ) ;
  eLeft.className = "ThemeTitleLabelLeft" ;
  eLeft.style.position = "absolute" ;
  eLeft.xClassName = "TitleLabelLeft" ;
  eLeft.style.top = "0px" ;
  eLeft.style.left = "0px" ;
  eLeft.style.padding = "0px" ;
  eLeft.style.border = "0px" ;
  eLeft.style.margin = "0px" ;

  var eMid = document.createElement ( "div" ) ;
  htmlDom.titleLabelMid = eMid ;

  htmlDom.appendChild ( eMid ) ;
  eMid.className = "ThemeTitleLabelMid" ;
  eMid.style.position = "absolute" ;
  eMid.xClassName = "TitleLabelMid" ;
  eMid.style.top = "0px" ;
//  eMid.style.padding = "0px" ;
  eMid.style.border = "0px" ;
  eMid.style.margin = "0px" ;

  var eRight = document.createElement ( "div" ) ;
  htmlDom.appendChild ( eRight ) ;
  eRight.className = "ThemeTitleLabelRight" ;
  eRight.xClassName = "TitleLabelRight" ;
  eRight.style.position = "absolute" ;
  eRight.style.top = "0px" ;
  eRight.style.right = "0px" ;
  eRight.style.padding = "0px" ;
  eRight.style.border = "0px" ;
  eRight.style.margin = "0px" ;

  var tsLeft = Tango.getThemeStyle ( "TitleLabelLeft" ) ;
  var tsRight = Tango.getThemeStyle ( "TitleLabelRight" ) ;
  if ( eRight && tsRight.width ) eRight.style.width = tsRight.width + "px" ;
  if ( eLeft && tsLeft.width ) eLeft.style.width = tsLeft.width + "px" ;
  if ( eLeft.offsetWidth == 0 )
  {
    htmlDom.removeChild ( eLeft ) ;
    eLeft = null ;
  }
  if ( eRight.offsetWidth == 0 )
  {
    htmlDom.removeChild ( eRight ) ;
    eRight = null ;
  }
  if ( ! htmlDom.xConstraints )
  {
    var pRight = TGui.getComputedStyleInt ( htmlDom.parentNode, "padding-right", 0 ) ;
    htmlDom.xConstraints = new TConstraints() ;
    htmlDom.xConstraints.parseRight ( "-" + pRight ) ;
  }
  htmlDom.xConstraints.setRightAttachComponent() ;

  eMid.innerHTML = text ;

  var height = htmlDom.offsetHeight ;
  var iheight = height - TGui.getComputedTaraHeight ( htmlDom ) ;

  htmlDom.style.padding = "0px" ;
  htmlDom.style.border = "0px" ;
  htmlDom.style.margin = "0px" ;
  htmlDom.style.position = "absolute" ;

  htmlDom.style.height = height + "px" ;

  var midLeft = 0 ;
  if ( ! eLeft ) midLeft = 0 ;
  else           midLeft = eLeft.offsetWidth ;
  eMid.style.left = midLeft + "px" ;

  if ( eLeft )
  {
    eLeft.style.height = height + "px" ;
  }
  if ( eRight )
  {
    eRight.style.height = height + "px" ;
    eRight.xConstraints = new TConstraints() ;
    eRight.xConstraints.parseRight ( "0" ) ;
  }

  eMid.xConstraints = new TConstraints() ;
  eMid.xConstraints.parseRight ( "-0" ) ;
  eMid.xConstraints.setRightAttachComponent() ;
  var eImg = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
  htmlDom.insertBefore ( eImg, eMid ) ;
  eImg.className = "ThemeTitleLabelMidImg" ;
  eImg.xClassName = "TitleLabelMidImg" ;
  eImg.style.position = "absolute" ;
  eImg.style.top = "0px" ;
  eImg.style.left = midLeft + "px" ;
  eImg.style.padding = "0px" ;
  eImg.style.border = "0px" ;
  eImg.style.margin = "0px" ;
  eImg.xConstraints = new TConstraints() ;
  eImg.xConstraints.parseRight ( "-0" ) ;
  eImg.xConstraints.parseBottom ( "-0" ) ;
  eImg.xConstraints.setRightAttachComponent() ;
  if ( eRight ) eImg.xConstraints.setRightComponent ( eRight ) ;
};
TGuiClass.prototype.isMandatoryOk = function ( xmlContainer )
{
  if ( xmlContainer == null )
  {
    throw "TGui.isMandatoryOk(): xContainer is null" ;
  }
  if ( xmlContainer.jsClassName != "TXml" )
  {
    throw "TGui.isMandatoryOk(): xContainer is not a TXml" ;
  }
  var mTextList = xmlContainer.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var t = TSys.translate ( "TheFollowingFieldsAreMandatory" ) + ":<br/>" + mTextList.join ( "<br/>" ) ;
    var dUserDialog = new TUserDialog ( t ) ;
    dUserDialog.error() ;
    return false ;
  }
  return true ;
};
TGuiClass.prototype.setAxl = function ( targetElement, xml )
{
  return this.packAxl ( targetElement, xml ) ;
};
TGuiClass.prototype.packAxl = function ( targetElement, xml )
{
  var dom = xml ;
  if ( xml && typeof ( xml ) == 'object' && xml.jsClassName == 'TXml' )
  {
    dom = xml.domRoot ;
  }
  TGui.flushAttributes ( targetElement ) ;
  var en = new TXEnum ( dom ) ;
  var externalAttributes = new Array() ;
  var ctx = new TCreateHtmlContext() ;
  var sHtml = TGui.createHtmlContainer ( en, externalAttributes, ctx ) ; // executeOnLoad DONE
  targetElement.innerHTML = sHtml ;
  var width = TGui.getComputedStyleInt ( targetElement, "width", 0 ) ;
  var height = TGui.getComputedStyleInt ( targetElement, "height", 0 ) ;

  var layoutContext = new LayoutContext() ;
  var pl = TGui.findPageletFromElement ( targetElement ) ;
  if ( pl ) layoutContext.pushPagelet ( pl ) ;

  TGui.layout ( targetElement, externalAttributes, null, layoutContext ) ;
  if ( pl ) layoutContext.popPagelet ( pl ) ;

  externalAttributes.length = 0 ;
  en.flush() ;
  targetElement.style.width = width + "px" ;
  targetElement.style.height = height + "px" ;
  TGui.layoutConstraints ( targetElement, true ) ;
  TGui.setClassImages ( targetElement, true ) ;
  ctx.executeOnLoad() ;
};
TGuiClass.prototype.layout = function ( htmlDom, externalAttributes, XX, layoutContext )
{
  if ( ! externalAttributes ) externalAttributes = [] ;
  if ( ! layoutContext ) layoutContext = new LayoutContext() ;
  var ch = htmlDom.firstChild ;

  var dx = 4 ;
  var dy = 2 ;

  var x0 = TGui.parsePixel ( htmlDom.style.paddingLeft ) ;
  var y0 = TGui.parsePixel ( htmlDom.style.paddingTop ) ;

  if ( isNaN ( x0 ) ) x0 = 4 ;
  if ( isNaN ( y0 ) ) y0 = 4 ;

  var pTop    = this.getComputedStyleInt ( htmlDom, "padding-top", 0 ) ;
  var pLeft   = this.getComputedStyleInt ( htmlDom, "padding-left", 0 ) ;
  var pBottom = this.getComputedStyleInt ( htmlDom, "padding-bottom", 0 ) ;
  var pRight  = this.getComputedStyleInt ( htmlDom, "padding-right", 0 ) ;

  var bTop    = this.getComputedStyleInt ( htmlDom, "border-top-width", 0 ) ;
  var bLeft   = this.getComputedStyleInt ( htmlDom, "border-left-width", 0 ) ;
  var bBottom = this.getComputedStyleInt ( htmlDom, "border-bottom-width", 0 ) ;
  var bRight  = this.getComputedStyleInt ( htmlDom, "border-right-width", 0 ) ;

  x0 += bLeft ;
  y0 += bRight ;

  var x = x0 ;
  var y = y0 ;

  var xMax = 0 ;
  var yMax = 0 ;
  var hMax = 0 ;
  var toBeLayedOutAfter = new Array() ;

  var tabNameToPosition = new Array() ;
  var lineElements = new Array() ;
  var marginBottom = null ;
  var xInBreak = -1 ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.type == 'hidden' )
    {
      var idd = ch.id ;
      var a = externalAttributes[idd] ;
      if ( a && a["path"] )
      {
        ch.path = a["path"] ;
      }
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.style.left ) // child is positioned absolute X
    {
      var posX = TGui.parsePixel ( ch.style.left ) ;
      x = posX ;
    }
    if ( ch.style.top ) // child is positioned absolute Y
    {
      var posY = TGui.parsePixel ( ch.style.top ) ;
      y = posY ;
    }
//    var marginRight = this.getComputedStyleInt ( ch, "margin-right" ) ;

    if ( ! ch.xId && ch.id ) ch.xId = ch.id ;

    var ch_id = ch.id ;
    var a = externalAttributes[ch_id] ;
    var pendingTab = null ;
    ch.isToBeLayedOut = true ;
    if ( ! ch.id || ch.id.indexOf ( "O" ) != 0 ) ch.isToBeLayedOut = false ;

    var jsPeer = null ;
    var checked = false ;
    if ( a )
    {
      var newCh = null ;
      ch.xClassName = a["xClassName"] ;
      if ( ch.xClassName == "Container" )
      {
        if ( a["Decorator"] )
        {
xInBreak = -1 ;
          var decorator = a["Decorator"] ;
          var newCh = decorator.setHtmlElement ( ch ) ;
          if ( newCh )
          {
            newCh.xConstraints = a["Constraints"] ;
            newCh.isToBeLayedOut = ch.isToBeLayedOut ;
            pendingTab = a["pendingTab"] ;
            a["pendingTab"] = null ;
//            if ( a["orgId"] ) ch.id = a["orgId"] ;
            a["Decorator"] = null ;
            a["Constraints"] = null ;
            if ( a["dragable"] )
            {
              newCh.dragable  = true ;
              a["dragable"] = false ;
            }
            if ( a && a["dragsource"] )
            {
              new DnDSource ( ch, a["dragsource"] ) ;
            }
            a["dragsource"] = "" ;
            if ( a && a["droptarget"] )
            {
              new DnDTarget ( ch, a["droptarget"] ) ;
            }
            a["droptarget"] = "" ;
            ch = newCh ;
          }
          else
          {
            ch.decorator = decorator ;
          }
          ch.xClassName = "Container" ;
        }
      }
      if ( ! newCh )
      {
        jsPeer = a["jsPeer"] ;
        if ( jsPeer ) ch.jsPeer = jsPeer ;
        if ( a["orgId"] ) ch.id = a["orgId"] ;
        if ( a["disabled"] ) ch.disabled = true ;
        if ( a["path"] ) ch.path = a["path"] ;
        if ( a["name"] ) ch.name = a["name"] ;
        if ( a["xsi-type"] ) ch.xsi_type = a["xsi-type"] ;
        if ( a["selected"] ) ch.xselected = true ;
        if ( a["tooltip"] ) ch.tooltip = a["tooltip"] ;
        if ( a["mandatory"] ) ch.mandatory = a["mandatory"] ;

        if ( a["mandatoryCheck"] )
        {
          var fe = TSys.tryFunctionExecutor ( a["mandatoryCheck"] ) ;
          if ( fe ) ch.fMandatoryCheck = fe ;
        }
        if ( a["valueHook"] )
        {
          var fe = TSys.tryFunctionExecutor ( a["valueHook"] ) ;
          if ( fe )
					{
            ch.valueHook = fe ;
						if ( typeof ( fe.flush ) == 'function' )
						{
              TGui.addToBeFlushed ( ch, fe ) ;
						}
					}
        }
        if ( a["mandatoryStyleName"] ) ch.mandatoryStyleName = a["mandatoryStyleName"] ;
        if ( a["mandatoryBlurStyleName"] ) ch.mandatoryBlurStyleName = a["mandatoryBlurStyleName"] ;
        if ( a["normalStyleName"] ) ch.normalStyleName = a["normalStyleName"] ;
        if ( a["xMappings"] ) ch.xMappings = a["xMappings"] ;
        if ( a["xProperties"] ) ch.xProperties = a["xProperties"] ;
        if ( typeof ( a["xdefault"] ) == 'string' ) ch.xdefault = a["xdefault"] ;
        if ( a["xdefaultIsNull"] ) ch.xdefaultIsNull = a["xdefaultIsNull"] ;
        if ( a["minlength"] ) ch.minlength = a["minlength"] ;
        if ( a["extendedType"] ) ch.extendedType = a["extendedType"] ;
        if ( a["checked"] ) checked = true ;
        if ( a["xContentIsHtml"] ) ch.xContentIsHtml = true ;

        ch.xScalableBackgroundImage = a["xScalableBackgroundImage"] ;
        if ( a["Constraints"] ) ch.xConstraints = a["Constraints"] ;
        if ( a["type"] ) ch.xType = a["type"] ;
        if ( TSys.isNumber ( a["max"] ) ) ch.xMax = a["max"] ;
        if ( TSys.isNumber ( a["min"] ) ) ch.xMin = a["min"]  ;
        pendingTab = a["pendingTab"] ;
        ch.xIsResettable = a["resettable"] ;
        if ( a["checkable"] )
        {
          ch.checkable = true ;
          ch.checked = checked ;
          if ( a["CheckableGroup"] )
          {
            a["CheckableGroup"].addCheckable ( ch ) ;
            a["CheckableGroup"] = undefined ;
          }
        }
        if ( typeof ( a["resetIndex"] ) != 'undefined' )
        {
          ch.xResetIndex = a["resetIndex"] ;
        }
        ch.xIsPersistent = a["persistent"] ;
        ch.xReverse = a["reverse"] ;
        ch.xStacked = a["stacked"] ;
        if ( a["popup"] )
        {
          a["popup"].setAnchorElement ( ch ) ;
          a["popup"].setLayoutContext ( layoutContext ) ;
          a["popup"] = undefined ;
        }
      }
    }
    else
    {
    }
    if ( ch.className && ! ch.xClassName )
    {
      ch.xClassName = ch.className ;
log ( "Missing ch.xClassName, ch.className: " + ch.className ) ;
      if ( ch.xClassName.indexOf ( "Theme" ) == 0 )
      {
        ch.xClassName = ch.xClassName.substring ( 5 ) ;
      }
    }

    if ( ch.style.width && ch.style.width.indexOf ( '%' ) > 0 )
    {
      toBeLayedOutAfter.push ( ch ) ;
    }
    if ( TSys.isIE() && Tango.ua.ieVersion === 10 )
    {
      if ( xInBreak >= 0 && xInBreak !== x )
      {
        x = xInBreak ;  
      }
      xInBreak = -1 ;
    }
    if ( ch.nodeName.toUpperCase() == 'BR' )
    {
      xMax = Math.max ( xMax, x ) ;

      if ( lineElements.length == 0 && hMax == 0 )
      {
        hMax = this.M_height ;
      }
      for ( var i = 0 ; i < lineElements.length ; i++ )
      {
        if ( lineElements[i].xClassName == "Container" ) continue ;
        if ( lineElements[i].topIsPredefined ) continue ;
        var le = lineElements[i] ;
        le.style.top = Math.round ( y + ( hMax - le.offsetHeight ) / 2 ) + "px" ;
      }
      lineElements.length = 0 ;

      x = x0 ;
      if ( marginBottom >= 0 ) y += hMax + marginBottom ;
      else                     y += hMax + dy ;
      marginBottom = null ;
      hMax = 0 ;
      ch = ch.nextSibling ;
      xInBreak = x0 ;
      continue ;
    }
    if ( ch.jsPeer )
    {
      if ( ch.jsPeer.layout )
      {
        ch.jsPeer.layout ( ch, externalAttributes, "", layoutContext, a ) ;
      }
      if ( ch.jsPeer.addToListenerContext )
      {
        if ( ch.jsPeer instanceof TTable )
        {
          if ( ! layoutContext.firstTextField )
          {
            if ( ! Tango.ua.realMobile )
            {
              layoutContext.firstTextField = ch.jsPeer.getFocusHelper() ;
            }
          }
        }
        if ( layoutContext.listenerContext )
        {
          ch.jsPeer.addToListenerContext ( layoutContext.listenerContext ) ;
        }
      }
    }

    if ( ch.xClassName == "Label" )
    {
      if ( a && a["getValue"] ) ch.getValue = true ;
    }
    else
    if ( ch.xClassName == "TitleLabel" )
    {
      this.layoutTitleLabel ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "Date" || ch.xClassName == "DateTime" )
    {
      var dim = this.layoutDate ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "Button" )
    {
      TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
      if ( ! layoutContext.firstBUTTON )
      {
        if ( ! ch.disabled ) layoutContext.firstBUTTON = ch ;
      }
      var dim = this.layoutNativeButton ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "PushButton" )
    {
      if ( ch.nodeName == "BUTTON" )
      {
        TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
        if ( ! layoutContext.firstBUTTON )
        {
          if ( ! ch.disabled ) layoutContext.firstBUTTON = ch ;
        }
      }
      var dim = this.layoutButton ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "ToolbarButton" )
    {
      var dim = this.layoutToolbarButton ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "ToolbarToggle" )
    {
      var dim = this.layoutToolbarButton ( ch, externalAttributes, layoutContext, a ) ;
      if  ( a && typeof ( a["value"] ) != 'undefined' ) ch.value = a["value"] ;
    }
    else
    if ( ch.xClassName == "ToolbarButtonSmall" )
    {
      var dim = this.layoutToolbarButton ( ch, externalAttributes, layoutContext, a ) ;
      if  ( a && typeof ( a["value"] ) != 'undefined' ) ch.value = a["value"] ;
    }
    else
    if ( ch.xClassName == "ToolbarToggleSmall" )
    {
      var dim = this.layoutToolbarButton ( ch, externalAttributes, layoutContext, a ) ;
      if  ( a && typeof ( a["value"] ) != 'undefined' ) ch.value = a["value"] ;
    }
    else
    if ( ch.xClassName == "NotebookButton" )
    {
      var dim = this.layoutNotebookButton ( ch, externalAttributes, layoutContext, a ) ;
    }
    else
    if ( ch.xClassName == "MultiformBody" )
    {
      ch.xConstraints = new TConstraints() ;
      ch.xConstraints.parseBottom ( "-0" ) ;
      ch.xConstraints.parseRight ( "-0" ) ;
      if ( a["onchange"] )
      {
        ch.listenerContext = new ListenerContext ( a["onchange"], ch, layoutContext ) ;
      }
    }
    else
    if ( ch.xClassName == "NotebookBody" )
    {
      ch.xConstraints = new TConstraints() ;
      ch.xConstraints.parseBottom ( "-0" ) ;
      ch.xConstraints.parseRight ( "-0" ) ;
      if ( a["onchange"] )
      {
        ch.listenerContext = new ListenerContext ( a["onchange"], ch, layoutContext ) ;
      }
    }
    else
    if ( ch.xClassName == "Splitbar" )
    {
    }
    else
    if (  ch.xClassName == "TextField" )
    {
      TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
      if ( a["resultlist"] )
      {
        var fe = new TFunctionExecutor ( a["resultlist"], layoutContext ) ;
        var tfrl = new TextFieldResultList ( ch, fe ) ;
        tfrl.resultlistPatternType = a["resultlistPatternType"] ;
      }
      else
      if ( a["delay"] && ( a["onkeyup"] || a["onkeydown"] || a["onkeypress"] || a["action"] ) )
      {
        var on = a["onkeyup"] ? "onkeyup" : a["onkeydown"] ? "onkeydown" : a["onkeypress"] ? "onkeypress" : "action" ;
        var str = a[on] ;
        if ( on !== "action" ) on = on.substring ( 2 ) ;
        var fe = new TFunctionExecutor ( str, layoutContext ) ;
        new TextFieldDelayedEventHandler ( ch, { delay:a["delay"], on:on, callbackObject: fe } ) ;
      }
      if ( a && a["autofocus"] == "true" )
      {
        if ( ! ch.readonly && ! ch.disabled )
          layoutContext.focusElement = ch ;
      }
      else
      {
        if ( ! layoutContext.firstTextField )
        {
          if ( Tango.ua.realMobile )
          {
            if ( ch.mandatory && ! ch.readonly && ! ch.disabled && ! ch.value ) layoutContext.firstTextField = ch ;
          }
          else
          {
            if ( ! ch.readonly && ! ch.disabled ) layoutContext.firstTextField = ch ;
          }
        }
      }
      if ( layoutContext.listenerContext && ! a["ignorechange"] )
      {
        layoutContext.listenerContext.addOnKeyUpEvent ( ch ) ;
      }
    }
    else
    if (  ch.xClassName == "TextArea" )
    {
      if ( layoutContext.listenerContext )
      {
        layoutContext.listenerContext.addOnKeyUpEvent ( ch ) ;
      }
      var ta = new TTextArea ( ch ) ;
      ta.setupTabHandler() ;
    }
    else
    if (  ch.xClassName == "Choice" )
    {
      TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
      if ( a["autofocus"] == "true" )
      {
        if ( ! ch.readonly && ! ch.disabled )
          layoutContext.focusElement = ch ;
      }
      else
      {
        if ( ! layoutContext.firstINPUT )
        {
          if ( ! ch.readonly && ! ch.disabled )
            layoutContext.firstINPUT = ch ;
        }
      }
      if ( typeof ( a["xPreselectedIndex"] == 'number' ) )
      {
        ch.xPreselectedIndex = a["xPreselectedIndex"] ;
      }
      if ( a["sorted"] ) ch.xSorted = true ;
      if ( ch.xSorted ) TGui.sortChoice ( ch, ch.xPreselectedIndex ) ;
      if ( layoutContext.listenerContext )
      {
        layoutContext.listenerContext.addOnChangeEvent ( ch ) ;
      }
      if ( a["onchange"] )
      {
        var fe = new TFunctionExecutor ( a["onchange"], layoutContext ) ;
        ch.fExecutor = fe ;
        this.addEventListener ( ch, "change", fe.executeWithEvent.bindAsEventListener(fe) ) ;
      }
    }
    else
    if ( ch.nodeName.toUpperCase() == "INPUT" )
    {
      TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
      if ( a && a["autofocus"] == "true" )
      {
        if ( ! ch.readonly && ! ch.disabled )
          layoutContext.focusElement = ch ;
      }
      else
      {
        if ( ! layoutContext.firstINPUT )
        {
          if ( ! ch.readonly && ! ch.disabled )
            layoutContext.firstINPUT = ch ;
        }
      }
      if ( ch.type == 'checkbox' || ch.type == 'radio' )
      {
        ch.xLabelId = a["xLabelId"] ;
        if ( checked ) ch.checked = true ;
        if ( a["onchange"] )
        {
          var fe = new TFunctionExecutor ( a["onchange"], layoutContext ) ;
          ch.fExecutor = fe ;
          this.addEventListener ( ch, "change", fe.executeWithEvent.bindAsEventListener(fe) ) ;
        }
        if ( ch.type == 'radio' )
        {
          ch.trueName = ch.name ;
          if ( ! layoutContext.radioTruePrefix )
            layoutContext.radioTruePrefix = TSys.getTempId() + "." ;
          ch.name = layoutContext.radioTruePrefix + ch.trueName ;
        }
        if ( ch.xLabelId )
        {
          var ll = document.getElementById ( ch.xLabelId ) ;
          ll.xParentComponent = ch ;
          if ( layoutContext.listenerContext )
          {
            layoutContext.listenerContext.addOnMouseUp ( ll ) ;
          }
        }
        if ( layoutContext.listenerContext )
        {
          layoutContext.listenerContext.addOnChangeEvent ( ch ) ;
        }
      }
    }
    else
    if ( ch.xClassName == "Container" )
    {
      if ( a && a["onchange"] )
      {
        ch.listenerContext = new ListenerContext ( a["onchange"], ch, layoutContext ) ;
      }
    }
    else
    if ( ch.xClassName == "Anchor" )
    {
      TGlobalEventHandler._add_focushandler ( ch, layoutContext ) ;
      var t = a["innerHTML"] ;
      if ( t ) ch.innerHTML = t ;
      var str = a["hrefCommand"] ;
      if ( str )
      {
        if ( typeof ( str ) == 'string' ) ch.fExecutor = new TFunctionExecutor ( str, layoutContext ) ;
        else ch.fExecutor = str ;
        this.addEventListener ( ch, "keyup", this.anchorKeyUp.bindAsEventListener ( this ) ) ;
        this.addEventListener ( ch, "mousedown", this.anchorMouseDown.bindAsEventListener ( this ) ) ;
        var sib = ch.firstChild ;
        while ( sib )
        {
          if ( sib.nodeType != DOM_ELEMENT_NODE )
          {
            sib = sib.nextSibling ;
            continue ; // Textknoten
          }
          if ( sib.nodeName.toUpperCase() == "BR" )
          {
            sib = sib.nextSibling ;
            continue ; // Textknoten
          }
          sib.fExecutor = ch.fExecutor ;
//          this.addEventListener ( sib, "mousedown", this.anchorMouseDown.bindAsEventListener ( this ) ) ;
          sib = sib.nextSibling ;
        }
      }
    }
    else
    if (  ch.xClassName == "Iframe" )
    {
      var src = a["src"] ;
      if ( src )
      {
        ch.src = src ;
      }
      else
      if ( a["innerHTML"] )
      {
        var doc = ch.contentDocument;
        if (doc == undefined || doc == null)
            doc = ch.contentWindow.document;
        doc.open();
        doc.write ( a["innerHTML"] ) ;
        doc.close();  
      }
    }
    if ( a && a["hidden"] ) ch.style.visibility = "hidden" ;

    if ( a && a["colspan"] ) ch.xColspan = a["colspan"] ;

    if ( ! ch.isLayedout && ch.isToBeLayedOut && ! ch.xContentIsHtml )
    {
      if ( ! this.guiElementClassNames[ch.xClassName] )
      {
        if ( ch.jsPeer && typeof ( ch.jsPeer.isPagelet ) == 'function' && ch.jsPeer.isPagelet() )
        {
          layoutContext.pushPagelet ( ch.jsPeer ) ;
        }
        if ( ch.firstChild )
        {
          if ( ch.nodeName.toUpperCase() == "DIV"
             || ( ch.nodeName.toUpperCase() == "SPAN" )
             )
          {
            var radioTruePrefix = layoutContext.radioTruePrefix ;
            layoutContext.radioTruePrefix = null ;
            var lfeic = layoutContext.lastFocusableElementInContainer ;
            layoutContext.lastFocusableElementInContainer = null ;
            if ( ch.listenerContext )
            {
              var oldListenerContext = layoutContext.getListenerContext() ;
              layoutContext.setListenerContext ( ch.listenerContext ) ;
              this.layout ( ch, externalAttributes, "", layoutContext ) ;
              layoutContext.setListenerContext ( oldListenerContext ) ;
            }
            else
            {
              this.layout ( ch, externalAttributes, "", layoutContext ) ;
            }
            layoutContext.lastFocusableElementInContainer = lfeic ;
            layoutContext.radioTruePrefix = radioTruePrefix ;
            if ( ch.jsPeer && typeof ( ch.jsPeer.isPagelet ) == 'function' && ch.jsPeer.isPagelet() )
            {
              layoutContext.popPagelet ( ch.jsPeer ) ;
            }
          }
        }
      }
    }
    else
    {
    }
    if (  ch.xClassName == "Grid" )
    {
      var numberOfRows = a["numberOfRows"] ;
      var maxNumberOfColumns = a["maxNumberOfColumns"] ;
      var aMaxWidth = [] ;
      var aMaxHeight = [] ;
      for ( var i = 0 ; i < maxNumberOfColumns ; i++ )
      {
        aMaxWidth[i] = 0 ;
      }
      var i = 0 ;
      var maxWidth = 0 ;
      var maxHeight = 0 ;
      for ( var tr = ch.firstChild ; tr ; tr = tr.nextSibling )
      {
        if ( tr.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( tr.nodeName.toUpperCase() == "BR" )
        {
          i = 0 ;
          maxWidth = 0 ;
          maxHeight = 0 ;
          continue ;
        }
        maxWidth = Math.max ( maxWidth, tr.offsetWidth ) ;
        if ( ! aMaxWidth[i] ) aMaxWidth[i] = 0 ;
        aMaxWidth[i] = Math.max ( maxWidth, aMaxWidth[i] ) ;
        maxWidth = 0 ;
        maxHeight = Math.max ( maxHeight, tr.offsetHeight ) ;
        if ( ! aMaxHeight[i] ) aMaxHeight[i] = 0 ;
        aMaxHeight[i] = Math.max ( maxHeight, aMaxHeight[i] ) ;
        maxHeight = 0 ;
        i++ ;
      }
      var j = 0 ;
      i = 0 ;
      var xt = 0 ;
      var max_tr = 0 ;
      for ( var tr = ch.firstChild ; tr ; tr = tr.nextSibling )
      {
        if ( tr.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( tr.nodeName.toUpperCase() == "BR" )
        {
          j++ ;
          i = 0 ;
          xt = 0 ;
          continue ;
        }
        tr.style.left = xt + "px" ;
        if ( tr.xColspan )
        {
          var ww = 0 ;
          for ( var k = i ; k < i + tr.xColspan ; k++ )
	  {
            ww += aMaxWidth[k] ;
	  }
          tr.style.width = ww + "px" ;
          xt += ww ;
i = k - 1 ;
        }
        else
        {
          tr.style.width = aMaxWidth[i] + "px" ;
          xt += aMaxWidth[i] ;
        }
        max_tr = Math.max ( max_tr, xt ) ;
if ( aMaxHeight[j] ) tr.style.height = aMaxHeight[j] + "px" ;
        i++ ;
      }
      ch.style.width = max_tr + "px" ;
    }
    if ( ch.xScalableBackgroundImage )
    {
      TGui.insertScalableBackgroundImage ( ch, ch.xClassName, true, true ) ;
    }
    if ( a && a["note"] )
    {
      var n = new TNote ( a["note"], ch ) ;
      n.showOnHOver() ;
    }

//log ( " 6 layout" ) ;
    if ( pendingTab )
    {
      var tabName = pendingTab["name"] ;
      var xPositioned = false ;
      if ( tabName )
      {
        var tabPosition = tabNameToPosition[tabName] ;
        if ( tabPosition )
        {
          x = parseInt ( tabPosition ) ;
          xPositioned = true ;
        }
      }
      if ( ! xPositioned )
      {
        var absolute = pendingTab["absolute"] ;
        var relative = pendingTab["relative"] ;
        var tabx     = pendingTab["x"] ;
        var tabX     = pendingTab["X"] ;
        if ( typeof ( tabx ) == "number" )
        {
          if ( absolute )
          {
            x = parseInt ( tabx ) ;
          }
          else
          if ( relative )
          {
            var xx = parseInt ( tabx ) ;
            x = x + xx * this.BLANK_width ;
          }
        }
        else
        if ( typeof ( tabX ) == "number" )
        {
          var xx = parseInt ( tabX ) ;
          if ( absolute )
          {
            x = xx * this.M_width ;
          }
          else
          if ( relative )
          {
            x = x + xx * this.M_width ;
          }
        }
        else
        {
          var tabWidth = 8 * this.BLANK_width ;
          x = Math.round ( ( x + tabWidth ) / tabWidth ) * tabWidth ;
        }
      }
      if ( tabName && ! xPositioned )
      {
        tabNameToPosition[tabName] = x ;
      }
    }
    ch.style.left = x + "px" ;
    var ddx = dx ;
    if ( a && typeof ( a["marginRight"] ) == 'number' )
    {
      ddx = a["marginRight"] ;
    }
    x += ch.offsetWidth ;
    if ( ch.xClassName == "NotebookButton" ) {}
    else
    if ( ch.xClassName == "Date" || ch.xClassName == "DateTime" ) {}
    else
    {
      if ( TGui.getComputedStyle ( ch, "display" ) != "none" ) x += ddx ;
    }

    if ( ! ch.xLayoutIgnore )
    {
      if ( ch.style.top )
      {
        ch.topIsPredefined = true ;
      }
      else
      {
        ch.style.top = y + "px" ;
      }
      hMax = Math.max ( hMax, ch.offsetHeight ) ;
      xMax = Math.max ( xMax, x ) ;
      lineElements.push ( ch ) ;
      marginBottom = TGui.parsePixel ( ch.style.marginBottom ) ;
      if ( ch.tooltip )
      {
        this.addEventListener ( ch, "mouseover", this.tooltipOver ) ;
        this.addEventListener ( ch, "mouseout", this.tooltipOut ) ;
      }
    }
    if ( ch.mandatory )
    {
      this.setInitialTFMandatoryDecoration ( ch ) ;
      if (  ch.xClassName == "TextField" )
      {
        this.addEventListener ( ch, "keyup", this.checkMandatory ) ;
        this.addEventListener ( ch, "focus", this.mandatoryTFFocus ) ;
        this.addEventListener ( ch, "blur", this.mandatoryTFBlur ) ;
      }
      else
      if ( ch.xClassName == "TextArea" )
      {
        this.addEventListener ( ch, "keyup", this.checkMandatory ) ;
      }
      else
      if ( ch.xClassName == "Choice" )
      {
        this.addEventListener ( ch, "change", this.checkMandatory ) ;
      }
    }
    if ( a && a["action"] && ! a["delay"] )
    {
      var str = a["action"] ;
      if ( typeof ( str ) == 'string' ) ch.fExecutor = new TFunctionExecutor ( str, layoutContext ) ;
      else ch.fExecutor = str ;
      if ( Tango.ua.ie )
        this.addEventListener ( ch, "keydown", this.actionPerformed.bindAsEventListener ( this ) ) ;
      else
        this.addEventListener ( ch, "keyup", this.actionPerformed.bindAsEventListener ( this ) ) ;
    }
    if ( a && a["onkeyup"] && ! a["delay"] )
    {
      var str = a["onkeyup"] ;
      var fe = new TFunctionExecutor ( str, layoutContext ) ;
      this.addEventListener ( ch, "keyup", fe.executeWithEvent.bindAsEventListener ( fe ) ) ;
    }
    if ( a && a["onkeydown"] && ! a["delay"] )
    {
      var str = a["onkeydown"] ;
      var fe = new TFunctionExecutor ( str, layoutContext ) ;
      this.addEventListener ( ch, "keydown", fe.executeWithEvent.bindAsEventListener ( fe ) ) ;
    }
    if ( a && a["dragable"] )
    {
      TGui.addEventListener ( ch, "mousedown", Dragger.startDrag.bindAsEventListener ( Dragger, ch ) ) ;
    }
    else
    if ( ch.dragable )
    {
      TGui.addEventListener ( ch, "mousedown", Dragger.startDrag.bindAsEventListener ( Dragger, ch ) ) ;
    }
    if ( a && a["dragsource"] )
    {
      new DnDSource ( ch, a["dragsource"] ) ;
    }
    if ( a && a["desktop"] )
    {
      TGui.setDesktopElement ( ch ) ;
    }
    if ( a && a["droptarget"] )
    {
      new DnDTarget ( ch, a["droptarget"] ) ;
    }
    if ( ch.xClassName == 'PushButton' && a && a["defaultButton"] == true )
    {
      ch.defaultButton = true ;
    }
    if ( a && ( a["onclick"] ||  a["ondblclick"] ) )
    {
      if ( ch.isDecoratorPart == "div" ) a["onclick"] = undefined ;
      if ( a["onclick"] )
      {
        var str = a["onclick"] ;
        if ( typeof ( str ) == 'string' ) ch.fExecutor = new TFunctionExecutor ( str, layoutContext ) ;
        else ch.fExecutor = str ;
        this.addEventListener ( ch, "click", this.mouseClicked.bindAsEventListener ( this ) ) ;
        if ( ! a["ondblclick"] )
        {
          this.addEventListener ( ch, "dblclick", this.consumeEvent.bindAsEventListener ( this ) ) ;
        }
	if ( a["shortcutCharacter"] )
	{
          TGlobalEventHandler.addToShortCutList ( a["shortcutCharacter"], ch, ch.fExecutor ) ;
	}
        if ( a["defaultButton"] == true )
        {
          ch.defaultButton = true ;
          TGlobalEventHandler.addToShortCutList ( 13, ch, ch.fExecutor ) ;
        }
      }
      if ( a["ondblclick"] )
      {
        var str = a["ondblclick"] ;
        if ( typeof ( str ) == 'string' ) ch.fExecutor = new TFunctionExecutor ( str, layoutContext ) ;
        else ch.fExecutor = str ;
        this.addEventListener ( ch, "dblclick", this.mouseClicked.bindAsEventListener ( this ) ) ;
      }
    }
    else
    {
      if ( ch.xType == "int" || ch.xType == "sint" )
      {
        this.addEventListener ( ch, "keyup", this.checkInput.bindAsEventListener ( this ) ) ;
      }
      else
      if ( ch.extendedType )
      {
        if ( ! ch.mandatory && ch.extendedType == "email" )
        {
          this.addEventListener ( ch, "keyup", this.checkInput.bindAsEventListener ( this ) ) ;
        }
        else
        if ( ch.extendedType == "float" || ch.extendedType == "ufloat" )
        {
          this.addEventListener ( ch, "keyup", this.checkInput.bindAsEventListener ( this ) ) ;
        }
        else
        {
          var fe = TSys.tryFunctionExecutor ( ch.extendedType ) ;
          if ( fe )
          {
            ch.extendedType = fe ;
            this.addEventListener ( ch, "keyup", this.checkInput.bindAsEventListener ( this ) ) ;
          }
        }
      }
    }
    if ( ch.listenerContext ) ch.listenerContext._containerRendered() ;
    if ( a && ch_id )
    {
      a["jsPeer"] = undefined ;
      a["pagelet"] = undefined ;
      externalAttributes[ch_id] = undefined ;
    }
    ch = ch.nextSibling ;
  }
  if ( lineElements.length > 0 )
  {
    for ( var i = 0 ; i < lineElements.length ; i++ )
    {
      var le = lineElements[i] ;
      if (  le.xClassName == "Container"
         || le.xClassName == "MultiformBody"
         || le.xClassName == "Multiform"
         || le.xClassName == "Notebook"
         || le.xClassName == "NotebookBody"
         || le.xClassName == "Toolbar"
         || le.xClassName == "ToolbarVertical"
         || le.xClassName == "Splitbar"
         )
      {
        continue ;
      }
      if ( lineElements[i].nodeName.toUpperCase() == "IFRAME" )
      {
        continue ;
      }
      if ( ! lineElements[i].isToBeLayedOut )
      {
        continue ;
      }
      if ( ! le.topIsPredefined )
        le.style.top = Math.round ( y + ( hMax - le.offsetHeight ) / 2 ) + "px" ;
    }
    lineElements.length = 0 ;
  }

  xMax = Math.max ( xMax, x ) ;
  yMax = y + hMax + pBottom ;
  if ( htmlDom.isDecoratorPart )
  {
    var w = 0 ;
    if ( htmlDom.style.width ) w = TGui.parsePixel ( htmlDom.style.width ) ;
    var h = 0 ;
    if ( htmlDom.style.height ) h = TGui.parsePixel ( htmlDom.style.height ) ;
    if ( xMax > w ) htmlDom.style.width = xMax + "px" ;
    if ( yMax > h ) htmlDom.style.height = yMax + "px" ;
  }
  else
  {
    if ( ! htmlDom.style.width || htmlDom.widthIsDynamic )
    {
      htmlDom.style.width = xMax + "px" ;
      htmlDom.widthIsDynamic = true ;
    }
    if ( ! htmlDom.style.height || htmlDom.heightIsDynamic )
    {
      htmlDom.style.height = yMax + "px" ;
      htmlDom.heightIsDynamic = true ;
    }
  }

  for ( var i = 0 ; i < toBeLayedOutAfter.length ; i++ )
  {
    var e = toBeLayedOutAfter[i] ;
  }
  toBeLayedOutAfter.length = 0 ;
if ( layoutContext.lastFocusableElementInContainer ) layoutContext.lastFocusableElementInContainer.isLastInContainer = true ;
  return new TDimension ( xMax, yMax ) ;
};
TGuiClass.prototype.setClassStyles = function ( htmlDom, refresh )
{
  if ( ! htmlDom ) htmlDom = document.getElementsByTagName ( "body" )[0] ;
  for ( var ch = htmlDom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    var clazz = ch.xClassName ;
    var state = "normal" ;
    if ( ! clazz || clazz.length == 0 )  clazz = ch.className ;
    if ( refresh && ch.className.indexOf ( "Theme" ) == 0 )
    {
      var cn = ch.className ;
      ch.className = "" ;
      ch.className = cn ;
    }
    if ( ch.firstChild )
    {
      if ( ! this.guiElementClassNames[clazz] || clazz == "TitleLabel" )
      {
        this.setClassStyles ( ch, refresh ) ;
      }
    }
  }
};
TGuiClass.prototype.setClassImages = function ( htmlDom, refresh )
{
  var fromTop = false ;
  if ( ! htmlDom )
  {
    var dom = Tango.getThemeDom ( "Globals", "BackgroundImage" ) ;
    if ( this.Main )
    {
      if ( dom )
      {
        var x = new TXml ( dom ) ;
        var str = x.getAttribute ( "src" ) ;
        var url = TGui.buildThemeBackgroundImageUrl ( "Globals", "BackgroundImage" ) ;
        this.Main.style.backgroundImage = url ;
        this.Main.xBackgroundImageIsFromTheme = true ;
//      document.getElementsByTagName ( "body" )[0].style.backgroundImage = url ;
      }
      else
      {
        if ( this.Main.style.backgroundImage && this.Main.xBackgroundImageIsFromTheme )
        {
          this.Main.style.backgroundImage = "none" ;
          this.Main.xBackgroundImageIsFromTheme = false ;
        }
      }
    }
    fromTop = true ;
    htmlDom = document.getElementsByTagName ( "body" )[0] ;
  }
  for ( var ch = htmlDom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    var clazz = ch.xClassName ;
    var state = "normal" ;
    if ( ! clazz || clazz.length == 0 )  clazz = ch.className ;
    if ( ch.jsPeer && ch.jsPeer.setClassImages )
    {
      if ( ch.jsPeer.setClassImages ( ch, refresh ) ) continue ;
    }
    if ( refresh && ch.className.indexOf ( "Theme" ) == 0 )
    {
      var cn = ch.className ;
      ch.className = "" ;
      ch.className = cn ;
    }
    if (  clazz == "PushButton"
       || clazz == "ToolbarButton"
       || clazz == "ToolbarButtonSmall"
//       || clazz == "Menubar"
       || clazz == "Menu"
//       || clazz == "TitleLabel"
       || clazz == "TitleLabelLeft"
       || clazz == "TitleLabelRight"
       || clazz == "WindowTopLeft"
       || clazz == "WindowTopRight"
       || clazz == "MenuItem"
       || clazz == "MenuButton"
       || clazz == "WindowBottomLeft"
       || clazz == "WindowBottomRight"
       )
    {
      if ( ch.style.backgroundImage )
      {
        if ( ! refresh ) 
        {
          continue ;
        }
      }
      var backgroundDone = false ;
      if (  clazz === "PushButton"
         || clazz === "ToolbarButton"
         || clazz === "ToolbarButtonSmall"
         )
      {
        if ( ch.disabled )
        {
          state = "disabled" ;
        }
        var pxml = Tango.getThemeXml ( clazz ) ;
        if ( pxml && pxml.getBoolAttribute ( "pure-css", false ) )
        {
          var cl = clazz ;
          var usecl = pxml.getAttribute ( "use" ) ;
          if ( usecl ) cl = usecl ;
          var pxml2 = null ;
          if ( ch.defaultButton )
          {
            pxml2 = Tango.getThemeXml ( cl, "default" ) ;
          }
          if ( ! pxml2 ) pxml2 = Tango.getThemeXml ( cl, state ) ;
          var c = pxml2.getAttribute ( "class" ) ;
          if ( c )
          {
            ch.style.backgroundImage = "" ;
            ch.className = c ;
          }
          backgroundDone = true ;
        }
      }
      if ( ch.offsetWidth > 0 && ! backgroundDone )
      {
        if ( ch.disabled )
        {
          state = "disabled" ;
          if ( clazz == "PushButton" ) ch.className = "ThemePushButtonDisabled" ;
        }
        var st = state ;
        var url = null ;
        if ( ch.defaultButton && st != "pressed" && st != 'disabled' && st != 'inside' )
        {
          if ( clazz == "PushButton" ) ch.className = "ThemePushButtonFocused" ;
          var txml = Tango.getThemeXml ( "PushButton", "default" ) ;
          if ( ! txml )
          {
            url = TGui.buildThemeImageUrl ( clazz, "inside", ch.offsetWidth, ch.offsetHeight ) ;
            if ( url ) url = "url(" + url + ")" ;
          }
          else
          {
            url = TGui.buildThemeBackgroundImageUrl ( clazz, "default", ch.offsetWidth, ch.offsetHeight ) ;
          }
        }
        else
        {
          url = TGui.buildThemeBackgroundImageUrl ( clazz, st, ch.offsetWidth, ch.offsetHeight ) ;
        }
        if ( url ) ch.style.backgroundImage = url ;
        if ( refresh && clazz == "PushButton" && ch.nodeName.toUpperCase() == "BUTTON" )
        {
          if ( ! Tango.buttonIsCSS3() ) ch.style.borderWidth = "0px" ;
      	  else
      	  {
      	    ch.style.borderWidth = "" ;
      	  }
      	}
      }
    }
    else
    if (  clazz == "ToolbarToggle"
       || clazz == "ToolbarToggleSmall"
       )
    {
      if ( ch.checked )
      {
        state = "checked" ;
      }
      var pxml = Tango.getThemeXml ( clazz ) ;
      if ( pxml && pxml.getBoolAttribute ( "pure-css", false ) )
      {
        var cl = clazz ;
        var usecl = pxml.getAttribute ( "use" ) ;
        if ( usecl ) cl = usecl ;
        var pxml2 = null ;
        if ( ! pxml2 ) pxml2 = Tango.getThemeXml ( cl, state ) ;
        var c = pxml2.getAttribute ( "class" ) ;
        if ( c )
        {
          ch.style.backgroundImage = "" ;
          ch.className = c ;
        }
      }
      else
      {
        if ( ch.checked )
        {
          state = "checked" ;
          ch.className = "ThemeToolbarToggleChecked" ;
        }
        var url = TGui.buildThemeBackgroundImageUrl ( clazz, state, ch.offsetWidth, ch.offsetHeight ) ;
        if ( url ) ch.style.backgroundImage = url ;
      }
    }
    else
    if (  clazz == "WindowTopMid"
       || clazz == "Toolbar"
//       || clazz == "TitleLabelMid"
       || clazz == "WindowBottom"
       || clazz == "Menubar"
       )
    {
      if ( clazz == "Menubar" )
      {
        var pxml = Tango.getThemeXml ( "Menubar" ) ;
        if ( pxml.getBoolAttribute ( "pure-css", false ) )
        {
          ch.style.backgroundImage = "" ;
          var pxml2 = pxml.get ( "normal" ) ;
          var c = pxml2.getAttribute ( "class" ) ;
          if ( c )
          {
            ch.className = c ;
          }
          continue ;
        }
      }
      if ( clazz == "WindowTopMid" )
      {
        if ( ch.parentNode.firstChild.nodeName == "IMG" ) continue ;
      }
      if ( ch.style.backgroundImage )
      {
        if ( ! refresh ) 
        {
          continue ;
        }
      }
      if ( ch.xScalableBackgroundImage )
      {
        if ( refresh )
        {
          var ch1 = ch.firstChild ;
          var url = TGui.buildThemeImageUrl ( ch1.xImageType, state, NaN, ch.offsetHeight ) ;
          if ( url ) ch1.src = url ;
        }
      }
      else
      {
        var url = TGui.buildThemeBackgroundImageUrl ( clazz, state, NaN, ch.offsetHeight ) ;
        if ( url ) ch.style.backgroundImage = url ;
      }
    }
    else
    if ( clazz == "TitleLabelMidImg" )
    {
      var url = TGui.buildThemeImageUrl ( "TitleLabelMid", "normal", ch.offsetWidth, ch.offsetHeight ) ;
      if ( url ) ch.src = url ;
    }
    else
    if (  clazz == "WindowTop"
       )
    {
      if ( ch.disabled )
      {
        state = "disabled" ;
      }
      if ( ch.xScalableBackgroundImage )
      {
        if ( refresh )
        {
          var ch1 = ch.firstChild ;
          ch1.src = TGui.buildThemeImageUrl ( ch1.xImageType, state, ch1.offsetWidth, ch1.offsetHeight ) ;
        }
      }
      else
      {
        var url = TGui.buildThemeBackgroundImageUrl ( clazz, state, ch.offsetWidth, ch.offsetWidth ) ;
        if ( url ) ch.style.backgroundImage = url ;
      }
    }
    else
    if (  clazz == "ToolbarVertical"
       || clazz == "WindowLeft"
       || clazz == "WindowRight"
       )
    {
      if ( ch.style.backgroundImage )
      {
        if ( ! refresh ) 
        {
          continue ;
        }
      }
      if ( ch.xScalableBackgroundImage )
      {
        if ( refresh )
        {
          var ch1 = ch.firstChild ;
          var url = TGui.buildThemeImageUrl ( ch1.xImageType, state, ch.offsetWidth, ch.offsetHeight ) ;
          if ( url ) ch1.src = url ;
        }
      }
      else
      {
        var url = TGui.buildThemeBackgroundImageUrl ( clazz, state, ch.offsetWidth, NaN ) ;
        if ( url ) ch.style.backgroundImage = url ;
      }
    }
    else
    if ( clazz == "Notebook" )
    {
      ch.jsPeer.setButtonDecoration ( state ) ;
    }
    if ( ch.firstChild )
    {
      if ( ! this.guiElementClassNames[clazz] || clazz == "TitleLabel" )
      {
        this.setClassImages ( ch, refresh ) ;
      }
    }
  }
  if ( fromTop )
  {
    this._previousBrowserWindowSize = this.getBrowserWindowSize() ;
    this._previousWindowOrientation = window.orientation ;
    var y = 0 ;
    if ( this.Title  )
    {
//TSys.log ( "this.Title.offsetTop: " + this.Title.offsetTop ) ;
//TSys.log ( "this.Title.offsetHeight: " + this.Title.offsetHeight ) ;
//      y += this.Title.offsetTop + this.Title.offsetHeight ;
//      y += this.Title.offsetHeight ;
//TSys.logInternal = false ;
//log ( y ) ;
      if ( y <= 3 ) return ;
    }
    if ( this.Menubar )
    {
      this.Menubar.style.top = y + "px" ;
      y += this.Menubar.offsetTop + this.Menubar.offsetHeight ;
      if ( y <= 10 ) return ;
    }
    if ( this.Toolbar )
    {
      this.Toolbar.style.top = y + "px" ;
      y += this.Toolbar.offsetTop + this.Toolbar.offsetHeight ;
    }
    if ( this.Main )
    {
      this.Main.style.top = y + "px" ;
      resizeHandler () ;
    }
  }
};
TGuiClass.prototype.getPadding = function ( dom )
{
  return new Padding ( TGui.getComputedStyleInt ( dom, "padding-top", 0 )
                     , TGui.getComputedStyleInt ( dom, "padding-left", 0 )
                     , TGui.getComputedStyleInt ( dom, "padding-bottom", 0 )
                     , TGui.getComputedStyleInt ( dom, "padding-right", 0 )
                     ) ;
};
TGuiClass.prototype.getComputedStyleInt = function ( el, property, def )
{
  if ( typeof ( def ) == 'undefined' ) def = NaN ;
  if ( el.currentStyle )
  {
    property = property.camelize() ;
    var i = parseInt ( el.currentStyle[property] ) ;
    if ( isNaN ( i ) ) i = def ;
    return i ;
  }
  else
  if ( window.getComputedStyle )
  {
    // var i = parseInt ( document.defaultView.getComputedStyle(el,null).getPropertyValue(property) ) ;
    var t = document.defaultView.getComputedStyle(el,null).getPropertyValue(property) ;
    var i = parseInt ( t ) ;
    if ( t.indexOf ( '.' ) >= 0 )
    {
      if ( i >= 0 ) i = parseInt ( parseFloat ( t ) + 0.5 ) ;
      else          i = - parseInt ( - parseFloat ( t ) + 0.5 ) ;
    }
    if ( isNaN ( i ) ) i = def ;
    return i ;
  }
  return NaN ;
};
TGuiClass.prototype.getComputedStyle = function ( el, property )
{
  if ( el.currentStyle )
  {
    property = property.camelize() ;
    return el.currentStyle[property] ;
  }
  else
  if ( window.getComputedStyle )
  {
    return document.defaultView.getComputedStyle(el,null).getPropertyValue(property);
  }
  return null ;
};
var _TaraLimit = 6 ;
TGuiClass.prototype.getComputedTaraWidth = function ( e, max )
{
  var max2 = 0 ;
  if ( typeof ( max ) != 'undefined' ) max2 = max ;
  else
  {
    if ( e.xTaraWidthComputed ) return e.xTaraWidth ;
    max2 = _TaraLimit ;
  }

  var sum = 0 ;
  var d  = 0 ;
  d = this.getComputedStyleInt ( e, "padding-left", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "padding-right", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "margin-left", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "margin-right", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "border-left-width", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "border-right-width", 0 ) ;
  if ( d <= max2 ) sum += d ;

  if ( typeof ( max ) != 'undefined' )
  {
    e.xTaraWidthComputed = true ;
    e.xTaraWidth = sum ;
    return e.xTaraWidth ;
  }
  return sum ;
};
TGuiClass.prototype.getComputedTaraHeight = function ( e )
{
  var max2 = 0 ;
  if ( typeof ( max ) != 'undefined' ) max2 = max ;
  else
  {
    if ( e.xTaraHeightComputed ) return e.xTaraHeight ;
    max2 = _TaraLimit ;
  }

  var sum = 0 ;
  var d  = 0 ;
  d = this.getComputedStyleInt ( e, "padding-top", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "padding-bottom", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "margin-top", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "margin-bottom", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "border-top-width", 0 ) ;
  if ( d <= max2 ) sum += d ;
  d = this.getComputedStyleInt ( e, "border-bottom-width", 0 ) ;
  if ( d <= max2 ) sum += d ;

  if ( typeof ( max ) != 'undefined' )
  {
    e.xTaraHeightComputed = true ;
    e.xTaraHeight = sum ;
    return e.xTaraHeight ;
  }
  return sum ;
};

TGuiClass.prototype.anchorKeyUp = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! ev.isEnter() )
  {
    return ;
  }
//  if ( ev.hasModifiers() ) return false ;
  if ( src.fExecutor )
  {
     src.fExecutor.executeWithEvent ( event ) ;
  }
  return false ;
};
TGuiClass.prototype.anchorMouseDown = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( src.fExecutor )
  {
     src.fExecutor.executeWithEvent ( event ) ;
  }
  return false ;
};
TGuiClass.prototype.actionPerformed = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! ev.isEnter() )
  {
    if ( src.xType == "int" || src.xType == "sint" ) this.checkInput ( event ) ;
    return ;
  }
  if ( ev.hasModifiers() ) return false ;

  if ( src.xClassName == "TextField" && src.mandatory)
  {
    var t = src.value ;
    if ( ! t || t.length == 0 ) return false ;
  }
  if ( src.fExecutor )
  {
    src.fExecutor.executeWithEvent ( event ) ;
    ev.consume() ;
  }
  return false ;
};
TGuiClass.prototype.consumeEvent = function ( event )
{
  if ( event.preventDefault )
  {
    event.preventDefault();
    event.stopPropagation();
  }
  else
  {
    event.returnValue = false;
    event.cancelBubble = true;
  }
};
TGuiClass.prototype.mouseClicked = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! src.fExecutor )
  {
    src = src.parentNode ;
    while ( src )
    {
      if ( src.fExecutor ) break ;
      src = src.parentNode ;
    }
    if ( ! src ) return false ;
  }
  if ( src.disabled ) return ;
  src.fExecutor.executeWithEvent ( event ) ;
  return false ;
};
TGuiClass.prototype.checkInput = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  var t = src.value ;
  if ( src.disabled || src.readOnly )
  {
    return ;
  }
  if ( typeof ( t ) == 'string' )
  {
    if ( src.extendedType && typeof ( src.extendedType ) == 'object' && src.extendedType.jsClassName == 'TFunctionExecutor' )
    {
//      var state = src.extendedType.execute ( [ t, event ] ) ;
      TGui.setMandatoryDecoration ( src, true, event ) ;
      return ;
    }
    if ( src.xType == "sint" )
    {
      if ( t.length == 0 ) return ;
      if ( t == "0" )
      {
        if ( src.mandatory ) TGui.setMandatoryDecoration ( src ) ;
        return ;
      }
      var r = /[^1-9^-]*([-]?[0-9]*)/ ;
      var ra = r.exec ( t ) ;
      var tt = ra[1] ;
      if ( TSys.isNumber ( src.xMax ) )
      {
        if ( parseInt ( tt ) > src.xMax ) tt = src.xMax ;
      }
      if ( tt == t ) return ;
      src.value = tt ;
      if ( src.mandatory ) TGui.setMandatoryDecoration ( src ) ;
    }
    else
    if ( src.xType == "int" )
    {
      if ( t.length == 0 ) return ;
      if ( t == "0" )
      {
        if ( src.mandatory ) TGui.setMandatoryDecoration ( src ) ;
        return ;
      }
      var r = /[^0-9]*([0-9]*)/ ;
      var ra = r.exec ( t ) ;
      var tt = ra[1] ;
      if ( TSys.isNumber ( src.xMax ) )
      {
        if ( parseInt ( tt ) > src.xMax ) tt = src.xMax ;
      }
      if ( tt == t ) return ;
      src.value = tt ;
      if ( src.mandatory ) TGui.setMandatoryDecoration ( src ) ;
    }
    else
    if ( src.extendedType == "float" || src.extendedType == "ufloat" )
    {
      var sep = TSys.getLocale(src).getDecimalSeparator() ;
      var r = null ;
      if ( src.extendedType == "ufloat" )
      {
        if ( ! this.localizedUFloatingNumberPattern )
        {
          if ( sep == '.' ) this.localizedUFloatingNumberPattern = /[^0-9\.]*([-0-9]*\.?[0-9]*)/ ;
          else              this.localizedUFloatingNumberPattern = /[^0-9\,]*([-0-9]*\,?[0-9]*)/ ;
        }
        r = this.localizedUFloatingNumberPattern ;
      }
      else
      {
        if ( ! this.localizedFloatingNumberPattern )
        {
          if ( sep == '.' ) this.localizedFloatingNumberPattern = /[^-0-9\.]*([-0-9]*\.?[0-9]*)/ ;
          else              this.localizedFloatingNumberPattern = /[^-0-9\,]*([-0-9]*\,?[0-9]*)/ ;
        }
        r = this.localizedFloatingNumberPattern ;
      }
      var ttt = t ;
      if ( sep == '.' ) t = t.replace ( /,/, "" ) ;
      else  t = t.replace ( /\./, "" ) ;
      if ( ttt != t ) src.value = t ;
      if ( t.length == 0 ) return ;
      var ra = r.exec ( t ) ;
      var tt = ra[1] ;
      if ( TSys.isNumber ( src.xMax ) )
      {
        if ( parseFloat ( tt ) > src.xMax ) tt = src.xMax ;
      }
      if ( tt == t ) return ;
      src.value = tt ;
      if ( src.mandatory ) TGui.setMandatoryDecoration ( src ) ;
    }
    else
    if ( src.extendedType == "email" )
    {
      if ( ! src.mandatory ) this.setMandatoryDecoration ( src ) ;
    }
  }
};
TGuiClass.prototype.checkFloat = function ( str, src )
{
  var t = str ;
  var sep = TSys.getLocale(src).getDecimalSeparator() ;
  var r = null ;

  if ( src && src.extendedType == "ufloat" )
  {
    if ( ! this.localizedUFloatingNumberPattern )
    {
      if ( sep == '.' ) this.localizedUFloatingNumberPattern = /[^0-9\.]*([-0-9]*\.?[0-9]*)/ ;
      else              this.localizedUFloatingNumberPattern = /[^0-9\,]*([-0-9]*\,?[0-9]*)/ ;
    }
    r = this.localizedUFloatingNumberPattern ;
  }
  else
  {
    if ( ! this.localizedFloatingNumberPattern )
    {
      if ( sep == '.' ) this.localizedFloatingNumberPattern = /[^-0-9\.]*([-0-9]*\.?[0-9]*)/ ;
      else              this.localizedFloatingNumberPattern = /[^-0-9\,]*([-0-9]*\,?[0-9]*)/ ;
    }
    r = this.localizedFloatingNumberPattern ;
  }

  var ttt = t ;
  if ( sep == '.' ) str = str.replace ( /,/, "" ) ;
  else  str = str.replace ( /\./, "" ) ;
  if ( src && ttt != t ) src.value = t ;
  var ra = r.exec ( t ) ;
  var tt = ra[1] ;
  if ( tt == t ) return true ;
  if ( src ) src.value = tt ;
  return false ;
};
TGuiClass.prototype.checkDateFromEvent = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  var hDate = this.setMandatoryDecorationDateFromElement ( src ) ;
  if ( hDate.maxDate2 )
  {
    var d = new TXml ( hDate ).getDateFromDate ( hDate ) ;
    if ( d )
    {
      if ( d.getTime() > hDate.maxDate2.getTime() )
      {
        TGui.setValuesDate ( hDate, hDate.maxDate2 ) ;
      }
    }
  }
  if ( hDate && hDate.fExecutor )
  {
    hDate.fExecutor.executeWithEvent ( event ) ;
  }
};
TGuiClass.prototype.setMandatoryDecorationDateFromElement = function ( src )
{
  var hDate = null ;
  var xDate  = null ;

  if ( src.xClassName == 'Date' || src.xClassName == 'DateTime' )
  {
    hDate = src ;
    xDate = new TXml ( hDate ) ;
    src = xDate.getDomByName ( "Year" ) ;
  }
  else
  {
    hDate = src.parentNode ;
    xDate  = new TXml ( hDate ) ;
  }

  if ( src === hDate.hHour || src === hDate.hMinute || src === hDate.hSecond )
  {
    var t = src.value ;
    if ( t.length > 0 )
    {
      var r = /[^0-9]*([0-9]*)/ ;
      var ra = r.exec ( t ) ;
      var tt = ra[1] ;
      if ( t != tt )
      {
        src.value = tt ;
      }
      var n = parseInt ( tt ) ;
      if ( isNaN ( n ) ) n = 0 ;
      var m = n ;
      if ( src === hDate.hHour )
      {
        n = Math.max ( 0, Math.min ( n, 23 ) ) ;
      }
      else
      {
        n = Math.max ( 0, Math.min ( n, 59 ) ) ;
      }
      if ( m != n ) src.value = n ;
    }
  }
  if ( hDate.minDate )
  {
    var y = 0 ;
    var m = hDate.minDate.getMonth() ;
    var d = hDate.minDate.getDate() ;
    if ( hDate.xdefault && ( src === hDate.hYear || src === hDate.hMonth || src === hDate.hDay ) && src.selectedIndex == 0 )
    {
    }
    else
    {
      if ( hDate.xdefault )
      {
        m++ ; d++ ; y++ ;
      }
      if ( y >= hDate.hYear.selectedIndex )
      {
        if ( m > hDate.hMonth.selectedIndex )
        {
          hDate.hMonth.selectedIndex = m ;
          if ( d - 1 > hDate.hDay.selectedIndex )
          {
            hDate.hDay.selectedIndex = d - 1 ;
          }
        }
        else
        if ( m == hDate.hMonth.selectedIndex && d - 1 > hDate.hDay.selectedIndex )
        {
          hDate.hDay.selectedIndex = d - 1 ;
        }
      }
    }
    if ( hDate.hHour )
    {
      hDate.hHour.className = "ThemeTextField" ;
      hDate.hMinute.className = "ThemeTextField" ;
      if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextField" ;
      if ( y == hDate.hYear.selectedIndex && m == hDate.hMonth.selectedIndex && hDate.hDay.selectedIndex == d - 1 )
      {
        var H = parseInt ( hDate.hHour.value ) ;
        if ( isNaN ( H ) ) H = 0 ;
        var M = parseInt ( hDate.hMinute.value ) ;
        if ( isNaN ( M ) ) M = 0 ;
        if ( H <= hDate.minDate.getHours() )
        {
          if ( H < hDate.minDate.getHours() ) hDate.hHour.className = "ThemeTextFieldMandatory" ;
          if ( M <= hDate.minDate.getMinutes() )
          {
            if ( M < hDate.minDate.getMinutes() ) hDate.hMinute.className = "ThemeTextFieldMandatory" ;
            if ( hDate.hSecond )
            {
              var S = parseInt ( hDate.hSecond.value ) ;
              if ( isNaN ( S ) ) S = 0 ;
              if ( S < hDate.minDate.getSeconds() ) hDate.hSecond.className = "ThemeTextFieldMandatory" ;
            }
          }
        }
      }
    }
  }

  if ( src === hDate.hDay )
  {
    if ( hDate.xdefault && hDate.hDay.selectedIndex == 0 )
    {
      hDate.hMonth.selectedIndex = 0 ;
      hDate.hYear.selectedIndex = 0 ;
      if ( hDate.hHour )
      {
        hDate.hHour.value = "" ;
        hDate.hMinute.value = "" ;
        if ( hDate.hSecond ) hDate.hSecond.value = "" ;
      }
      if ( hDate.mandatory )
      {
        hDate.hDay.className = "ThemeChoiceMandatory" ;
        hDate.hMonth.className = "ThemeChoiceMandatory" ;
        hDate.hYear.className = "ThemeChoiceMandatory" ;
        if ( hDate.hHour )
        {
          hDate.hHour.className = "ThemeTextFieldMandatory" ;
          hDate.hMinute.className = "ThemeTextFieldMandatory" ;
          if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextFieldMandatory" ;
        }
      }
      return hDate ;
    }
  }
  else
  if ( src === hDate.hMonth )
  {
    if ( hDate.xdefault && hDate.hMonth.selectedIndex == 0 )
    {
      hDate.hDay.selectedIndex = 0 ;
      hDate.hYear.selectedIndex = 0 ;
      if ( hDate.hHour )
      {
        hDate.hHour.value = "" ;
        hDate.hMinute.value = "" ;
        if ( hDate.hSecond ) hDate.hSecond.value = "" ;
      }
      if ( hDate.mandatory )
      {
        hDate.hDay.className = "ThemeChoiceMandatory" ;
        hDate.hMonth.className = "ThemeChoiceMandatory" ;
        hDate.hYear.className = "ThemeChoiceMandatory" ;
        if ( hDate.hHour )
        {
          hDate.hHour.className = "ThemeTextFieldMandatory" ;
          hDate.hMinute.className = "ThemeTextFieldMandatory" ;
          if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextFieldMandatory" ;
        }
      }
      return hDate ;
    }
  }
  else
  if ( src === hDate.hYear )
  {
    if ( hDate.xdefault && hDate.hYear.selectedIndex == 0 )
    {
      hDate.hDay.selectedIndex = 0 ;
      hDate.hMonth.selectedIndex = 0 ;
      if ( hDate.hHour )
      {
        hDate.hHour.value = "" ;
        hDate.hMinute.value = "" ;
        if ( hDate.hSecond ) hDate.hSecond.value = "" ;
      }
      if ( hDate.mandatory )
      {
        hDate.hDay.className = "ThemeChoiceMandatory" ;
        hDate.hMonth.className = "ThemeChoiceMandatory" ;
        hDate.hYear.className = "ThemeChoiceMandatory" ;
        if ( hDate.hHour )
        {
          hDate.hHour.className = "ThemeTextFieldMandatory" ;
          hDate.hMinute.className = "ThemeTextFieldMandatory" ;
          if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextFieldMandatory" ;
        }
      }
      return hDate ;
    }
  }
  if ( hDate.hDay.className != "ThemeChoice" )
  {
    hDate.hDay.className = "ThemeChoice" ;
    hDate.hMonth.className = "ThemeChoice" ;
    hDate.hYear.className = "ThemeChoice" ;
    if ( hDate.hHour )
    {
      hDate.hHour.className = "ThemeTextField" ;
      hDate.hMinute.className = "ThemeTextField" ;
      if ( hDate.hSecond ) hDate.hSecond.className = "ThemeTextField" ;
    }
  }
  if ( hDate.xdefault )
  {
    if (  hDate.hDay.selectedIndex == 0
       && hDate.hMonth.selectedIndex == 0
       && hDate.hYear.selectedIndex == 0
       )
    {
      TGui.setValuesDate ( hDate, new Date(), null ) ;
      return ;
    }
    if ( hDate.hDay.selectedIndex == 0 ) hDate.hDay.selectedIndex = 1 ;
    if ( hDate.hMonth.selectedIndex == 0 ) hDate.hMonth.selectedIndex = 1 ;
    if ( hDate.hYear.selectedIndex == 0 ) hDate.hYear.selectedIndex = 1 ;
  }

  var dayIndex = hDate.hDay.selectedIndex ;
  var day = hDate.hDay.selectedIndex ;
  if ( hDate.xdefault ) day-- ;
  var month = hDate.hMonth.selectedIndex ;
  if ( hDate.xdefault ) month-- ;
  var year  = hDate.hYear.value ;

  var maxDays = DateUtils.getMaxDays ( parseInt ( year ), month ) ;

  var maxIndex = maxDays - 1 ;
  if ( hDate.xdefault ) maxIndex++ ;

  var dayIndexEqualsMaxIndex = dayIndex == hDate.hDay.options.length - 1 ;

  if ( hDate.hDay.options.length == maxIndex + 1 ) return hDate ;

  hDate.hDay.options.length = 0 ;
  var index = 0 ;

  if ( hDate.xdefault )
  {
    hDate.hDay.options[index++] = new Option ( "", "", false, false );
  }
  for ( var i = 0 ; i < maxDays ; i++ )
  {
    hDate.hDay.options[index++] = new Option ( i+1, i, false, false );
  }
  if ( dayIndexEqualsMaxIndex ) dayIndex = maxIndex ;
  if ( dayIndex >= 0 )
  {
    if ( dayIndex > maxIndex ) dayIndex = maxIndex ;
    hDate.hDay.selectedIndex = dayIndex ;
  }
  return hDate ;
};
TGuiClass.prototype.isMandatoryOkDate = function ( src, ev )
{
  var hDate = null ;
  var xDate  = null ;

  if ( src.xClassName == 'Date' || src.xClassName == 'DateTime' )
  {
    hDate = src ;
    xDate = new TXml ( hDate ) ;
    src = hDate.hYear ;
  }
  else
  {
    hDate = src.parentNode ;
    xDate  = new TXml ( hDate ) ;
  }
  if ( ev && ev.getSource() )
  {
    var s1 = ev.getSource() ;
    if (  s1.xClassName == 'Date'
       || s1.xClassName == 'DateTime'
       || s1.parentNode.xClassName == 'Date'
       || s1.parentNode.xClassName == 'DateTime'
       )
    {
      src = s1 ;
    }
  }

  if ( src.xClassName == "DateDay" )
  {
    if ( ! hDate.xdefault ) return true ;
    if ( src.selectedIndex == 0 && hDate.mandatory ) return false ;
  }
  else
  if ( src.xClassName == "DateMonth" )
  {
    if ( hDate.xdefault && src.selectedIndex == 0 )
    {
      if ( hDate.mandatory ) return false ;
    }
  }
  else
  if ( src.xClassName == "DateYear" )
  {
    if ( hDate.xdefault && src.selectedIndex == 0 )
    {
      if ( hDate.mandatory ) return false ;
    }
  }
//  if ( hDate.hHour && hDate.hHour.className == 'ThemeTextFieldMandatory' ) return false ;
//  if ( hDate.hMinute && hDate.hMinute.className == 'ThemeTextFieldMandatory' ) return false ;
//  if ( hDate.hSecond && hDate.hSecond.className == 'ThemeTextFieldMandatory' ) return false ;
  return true ;
};
TGuiClass.prototype.mandatoryTFFocus = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  src.isFocusOwner = true ;
  if ( src.mandatory == "true" ) return ;
  if ( ! src.mandatory ) return ;
  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 || TSys.isMozilla() )
  {
    if ( src.mandatoryType == 'password' )
    {
      TGui.setMandatoryDecoration ( src ) ;
      return ;
    }
  }
  if ( src.mandatoryTextDisplayed )
  {
    var cn = "ThemeTextField" ;
    var cnm = "ThemeTextFieldMandatory" ;
    if ( src.mandatoryStyleName ) cnm = src.mandatoryStyleName ;
    if ( src.normalStyleName ) cn = src.normalStyleName ;
    if ( src.mandatoryType == 'password' ) 
    {
      src.type = "password" ;
      src.focus() ;
    }
    src.value = "" ;
    src.className = cnm ;
    src.mandatoryTextDisplayed = false ;
  }
  TGui.setMandatoryDecoration ( src ) ;
};
TGuiClass.prototype.mandatoryTFBlur = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  src.isFocusOwner = false ;
  if ( src.mandatory == "true" ) return ;
  if ( ! src.mandatory ) return ;
  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 || TSys.isMozilla() )
  {
    if ( src.type == 'password' )
    {
      TGui.setMandatoryDecoration ( src ) ;
      return ;
    }
  }
  var t = src.value ;
  if ( ! t )
  {
    if ( src.type == 'password' ) 
    {
      src.mandatoryType = "password" ;
      src.type = "text" ;
    }
    src.value = src.mandatory ;
    if ( src.mandatoryBlurStyleName ) src.className = src.mandatoryBlurStyleName ;
    else
    if ( src.mandatoryStyleName ) src.className = src.mandatoryStyleName ;
    else                          src.className = "ThemeTextFieldMandatoryBlur" ;
    src.mandatoryTextDisplayed = true ;
  }
  TGui.setMandatoryDecoration ( src ) ;
};
TGuiClass.prototype.setInitialTFMandatoryDecoration = function ( src )
{
  if ( src.mandatory == "true" )
  {
    TGui.setMandatoryDecoration ( src ) ;
    return ;
  }
  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 || TSys.isMozilla() )
  {
    if ( src.type == 'password' )
    {
      TGui.setMandatoryDecoration ( src ) ;
      return ;
    }
  }
  var t = src.value ;
  if ( ! t )
  {
    if ( src.type == 'password' ) 
    {
      src.mandatoryType = "password" ;
      src.type = "text" ;
    }
    src.value = src.mandatory ;
    if ( src.mandatoryBlurStyleName ) src.className = src.mandatoryBlurStyleName ;
    else
    if ( src.mandatoryStyleName ) src.className = src.mandatoryStyleName ;
    else                          src.className = "ThemeTextFieldMandatoryBlur" ;
    src.mandatoryTextDisplayed = true ;
  }
  TGui.setMandatoryDecoration ( src ) ;
};
TGuiClass.prototype.checkMandatory = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ev.isEnter() ) return ;
  TGui.setMandatoryDecoration ( src, false, event ) ;
};
TGuiClass.prototype.checkEmail = function ( str )
{
//          if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test ( t ) )
//          if ( /^([a-zA-Z0-9])([a-zA-Z0-9\.\_\-])*@(([a-zA-Z0-9])+(\.))+([a-zA-Z]{2,4})+$/.test ( t ) )
//          if ( /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test ( t ) )
  if ( /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test ( str ) )
  {
    return true ;
  }
  return false ;
};
TGuiClass.prototype.setMandatoryDecoration = function ( src, renderAlways, event )
{
  if ( src.disabled || src.readOnly )
  {
    return ;
  }
  if ( src.xClassName == "TextField" )
  {
    var cn = "ThemeTextField" ;
    var cnm = "ThemeTextFieldMandatory" ;
    if ( src.mandatoryStyleName ) cnm = src.mandatoryStyleName ;
    if ( src.normalStyleName ) cn = src.normalStyleName ;
    var t = src.value ;
    if ( ! src.mandatory && ! renderAlways )
    {
      if ( src.extendedType == "email" )
      {
        if ( !t || TGui.checkEmail ( t ) )
        {
          src.xMandatoryOk = true ;
          src.className = cn ;
        }
        else
        {
          src.xMandatoryOk = false ;
          src.className = cnm ;
        }
        return ;
      }
      src.className = cn ;
      return ;
    }
    if ( src.mandatoryTextDisplayed )
    {
      t = "" ;
    }
    if ( src.fMandatoryCheck )
    {
      var state = src.fMandatoryCheck.execute ( [ src, t, event ] ) ;
      if ( typeof ( state ) == 'boolean' )
      {
        if ( state )
        {
          src.xMandatoryOk = true ;
          src.className = cn ;
        }
        else
        {
          src.xMandatoryOk = false ;
          src.className = cnm ;
        }
      }
      if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
      return ;
    }
    if ( src.extendedType && typeof ( src.extendedType ) == 'object' && src.extendedType.jsClassName == 'TFunctionExecutor' )
    {
      var state = src.extendedType.execute ( [ t, src, event ] ) ;
      if ( typeof ( state ) == 'boolean' )
      {
        if ( state )
        {
          src.xMandatoryOk = true ;
          src.className = cn ;
        }
        else
        {
          src.xMandatoryOk = false ;
          src.className = cnm ;
        }
      }
      if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
      return ;
    }
    if ( t && t.length > 0 )
    {
      if ( src.extendedType == "password" )
      {
        if ( TSys.getPasswordValidator().validate ( t ) )
        {
          src.xMandatoryOk = true ;
          src.className = cn ;
        }
        else
        {
          src.xMandatoryOk = false ;
          if ( ! src.mandatoryTextDisplayed ) src.className = cnm ;
        }
        if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
        return ;
      }
      if ( src.extendedType == "email" )
      {
        if ( TGui.checkEmail ( t ) )
        {
          src.xMandatoryOk = true ;
          src.className = cn ;
        }
        else
        {
          src.xMandatoryOk = false ;
          if ( ! src.mandatoryTextDisplayed ) src.className = cnm ;
        }
        if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
        return ;
      }

      if ( src.minlength )
      {
        if ( t.length < src.minlength )
        {
          src.xMandatoryOk = false ;
          if ( ! src.mandatoryTextDisplayed ) src.className = cnm ;
          if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
          return ;
        }
      }
      if ( TSys.isNumber ( src.xMin ) )
      {
        var i = parseInt ( t ) ;
        if ( isNaN ( i ) || i < src.xMin )
        {
          src.xMandatoryOk = false ;
          if ( ! src.mandatoryTextDisplayed ) src.className = cnm ;
          if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
          return ;
        }
      }

      src.xMandatoryOk = true ;
      if ( ! src.disabled && ! src.readOnly )
      {
        src.className = cn ;
      }
    }
    else
    {
      src.xMandatoryOk = false ;
      if ( ! src.mandatoryTextDisplayed ) src.className = cnm ;
    }
    if ( src.mandatoryTextDisplayed ) src.value = src.mandatory ;
  }
  else
  if ( src.xClassName == "TextArea" )
  {
    var t = src.value ;
    if ( src.minlength && src.value.length < src.minlength )
    {
      src.xMandatoryOk = false ;
      src.className = "ThemeTextAreaMandatory" ;
    }
    else
    if ( src.mandatory )
    {
      if ( t && t.length > 0 )
      {
        src.xMandatoryOk = true ;
        src.className = "ThemeTextArea" ;
      }
      else
      {
        src.xMandatoryOk = false ;
        src.className = "ThemeTextAreaMandatory" ;
      }
    }
  }
  else
  if ( src.xClassName == "Date" || src.xClassName == 'DateTime' )
  {
    this.setMandatoryDecorationDateFromElement ( src, event ) ;
  }
  else
  if ( src.xClassName == "Choice" )
  {
    if ( src.mandatory )
    {
      if ( src.selectedIndex > 0 )
      {
        src.xMandatoryOk = true ;
        src.className = "ThemeChoice" ;
      }
      else
      {
        src.xMandatoryOk = false ;
        src.className = "ThemeChoiceMandatory" ;
      }
    }
    else
    {
//      src.xMandatoryOk = true ;
      src.className = "ThemeChoice" ;
    }
  }
  else
  if ( src.xClassName == "Label" )
  {
    if ( src.mandatory )
    {
      if ( src.innerHTML.trim() )
      {
        src.className = "ThemeLabelNormal" ;
      }
      else
      {
        src.className = "ThemeLabelMandatory" ;
      }
    }
  }
  return false ;
};
TGuiClass.prototype.eventCache = function()
{
  var listEvents = [];
  return {
    listEvents : listEvents,
    add : function(node, sEventName, fHandler)
    {
      listEvents.push(arguments);
    },
    flush : function()
    {
      var i, item;
      for(i = listEvents.length - 1; i >= 0; i = i - 1)
      {
        item = listEvents[i];
        if(item[0].removeEventListener){
          item[0].removeEventListener(item[1], item[2], item[3]);
        }
        if(item[1].substring(0, 2) != "on"){
          item[1] = "on" + item[1];
        }
        if(item[0].detachEvent){
          item[0].detachEvent(item[1], item[2]);
        }
        item[0][item[1]] = null;
      }
      var body = document.getElementsByTagName ( "body" )[0] ;
      TGui.flushEventListener ( body ) ;
    }
  };
}();
TGuiClass.prototype.enableAllInput = function()
{
  var body = document.getElementsByTagName("body")[0] ;
  this.setAllInputEnabled ( body, true ) ;
};
TGuiClass.prototype.disableAllInput = function()
{
  var body = document.getElementsByTagName("body")[0] ;
  this.setAllInputEnabled ( body, false ) ;
};
TGuiClass.prototype.setAllInputEnabled = function ( elem, state )
{
  if ( ! elem ) return ;
  for ( var ch = elem.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType !== DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.jsPeer && typeof ( ch.jsPeer.setEnabled ) == 'function' )
    {
      state = state ? true : false ;
      if ( state )
      {
        if ( ch.dynDisabled )
        {
          ch.jsPeer.setEnabled ( state ) ;
          ch.dynDisabled = false ;
        }
      }
      else
      {
        if ( ! ch.disabled )
        {
          ch.jsPeer.setEnabled ( state ) ;
          ch.dynDisabled = true ;
        }
      }
    }
    else
    if ( ch.xClassName == 'PushButton' )
    {
      state = state ? true : false ;
      var c = new TButton ( ch ) ;
      if ( state )
      {
        if ( ch.dynDisabled )
        {
          c.setEnabled ( state ) ;
          ch.dynDisabled = false ;
        }
      }
      else
      {
        if ( ! ch.disabled )
        {
          c.setEnabled ( state ) ;
          ch.dynDisabled = true ;
        }
      }
    }
    else
    if (  ch.nodeName.toUpperCase() == "INPUT"
       || ch.nodeName.toUpperCase() == "TEXTAREA"
       || ch.nodeName.toUpperCase() == "SELECT"
       )
    {
      state = state ? true : false ;
      if ( state )
      {
        if ( ch.dynDisabled )
        {
          ch.disabled = false ;
          ch.dynDisabled = false ;
        }
        if ( ch.type == 'checkbox' || ch.type == 'radio' )
        {
          if ( ch.xLabelId )
          {
            var l = document.getElementById ( ch.xLabelId ) ;
            if ( l )
            {
              l.disabled = false ;
              l.style.cursor = "pointer" ;
            }
          }
        }
      }
      else
      {
        if ( ! ch.disabled )
        {
          ch.disabled = true ;
          ch.dynDisabled = true ;
        }
        if ( ch.type == 'checkbox' || ch.type == 'radio' )
        {
          if ( ch.xLabelId )
          {
            var l = document.getElementById ( ch.xLabelId ) ;
            if ( l )
            {
              l.disabled = true ;
              l.style.cursor = "default" ;
            }
          }
        }
      }
    }
    else
    if ( ch.firstChild )
    {
      this.setAllInputEnabled ( ch, state ) ;
    }
  }
};
TGuiClass.prototype.setAllInputReadOnly = function ( elem, state, tfClassName )
{
  if ( ! elem ) return ;
  state = state ? true : false ;
  for ( var ch = elem.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType !== DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if (  ch.nodeName.toUpperCase() == "INPUT"
       || ch.nodeName.toUpperCase() == "TEXTAREA"
       )
    {
      ch.readOnly = state ;
      if (  ch.type == 'text'
         || ch.type == 'password'
         || ch.type == 'textarea'
         || ch.type == 'int'
         )
      {
        if ( tfClassName ) ch.className = tfClassName ;
      }
      else
      if ( ch.type == 'checkbox' || ch.type == 'radio' )
      {
        ch.disabled = state ;
        if ( ch.xLabelId )
        {
          var l = document.getElementById ( ch.xLabelId ) ;
          if ( l )
          {
            l.disabled = state ;
            if ( state ) l.style.cursor = "default" ;
            else l.style.cursor = "pointer" ;
          }
        }
      }
    }
    else
    if ( ch.nodeName.toUpperCase() == "SELECT" )
    {
      ch.disabled = state ;
    }
    else
    if (  ch.xClassName == 'Date' || ch.xClassName == 'DateTime' )
    {
      new TDate ( ch ).setEnabled ( ! state ) ;
    }
    else
    if ( ch.firstChild )
    {
      this.setAllInputReadOnly ( ch, state, tfClassName ) ;
    }
  }
};
/*
function intersects(Rectangle r) {
	int tw = this.width;
	int th = this.height;
	int rw = r.width;
	int rh = r.height;
	if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
	    return false;
	}
	int tx = this.x;
	int ty = this.y;
	int rx = r.x;
	int ry = r.y;
	rw += rx;
	rh += ry;
	tw += tx;
	th += ty;
	//      overflow || intersect
	return ((rw < rx || rw > tx) &&
		(rh < ry || rh > ty) &&
		(tw < tx || tw > rx) &&
		(th < ty || th > ry));
    }
*/
/*
function intersects( TRectangle r ) {
	int tw = this.width;
	int th = this.height;
	int rw = r.width;
	int rh = r.height;
	if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
	    return false;
	}
	int tx = this.x;
	int ty = this.y;
	int rx = r.x;
	int ry = r.y;
	rw += rx;
	rh += ry;
	tw += tx;
	th += ty;
	//      overflow || intersect
	return ((rw < rx || rw > tx) &&
		(rh < ry || rh > ty) &&
		(tw < tx || tw > rx) &&
		(th < ty || th > ry));
    }
*/
TGuiClass.prototype.setAllInputVisible = function ( targetElement, hidingElementBounds, state, ignoreElement )
{
  if  ( ! targetElement ) targetElement = document.body ;
  for ( var ch = targetElement.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType !== DOM_ELEMENT_NODE )
    {
      continue ;
    }
    var b = this.getBoundsOnPageOf ( ch ) ;
    if ( ! b ) continue ;
    if ( ! b.y ) continue ;
    if ( b.y + b.height < hidingElementBounds.y ) continue ;
    if ( b.y > hidingElementBounds.y + hidingElementBounds.height ) continue ;
    if ( b.x + b.width < hidingElementBounds.x ) continue ;
    if ( b.x > hidingElementBounds.x + hidingElementBounds.width ) continue ;
    if (  ch.nodeName.toUpperCase() == "INPUT"
       || ch.nodeName.toUpperCase() == "TEXTAREA"
       || ch.nodeName.toUpperCase() == "SELECT"
       )
    {
      state = state ? true : false ;
      if ( state )
      {
        ch.dynHidden -= 1 ;
        if ( ch.dynHidden <= 0 )
        {
          ch.style.visibility = "inherit" ;
          ch.dynHidden = 0 ;
        }
      }
      else
      {
        if ( ch.style.visibility != "hidden" )
        {
          ch.dynHidden = 1 ;
          ch.style.visibility = "hidden" ;
        }
        else ch.dynHidden += 1 ;
      }
    }
    else
    if ( ch.firstChild && ch != ignoreElement )
    {
      this.setAllInputVisible ( ch, hidingElementBounds, state, ignoreElement ) ;
    }
  }
};
TGuiClass.prototype.flushBody = function()
{
  var body = document.getElementsByTagName ( "body" )[0] ;
  this.flushAttributes ( body ) ;
  var ch = body.firstChild ;
  while ( ch )
  {
    var nextSibling = ch.nextSibling ;
    body.removeChild ( ch ) ;
    ch = nextSibling ;
  }
};
TGuiClass.prototype.addToBeFlushed = function ( elem, toBeFlushed )
{
  if ( ! elem.xToBeFlushed ) elem.xToBeFlushed = [] ;
  elem.xToBeFlushed.push ( toBeFlushed ) ;
};
TGuiClass.prototype.flushAttributes = function ( elem, includeSelf )
{
  if ( includeSelf )
  {
//    if ( elem.xEventHandlerList ) this.flushEventListener ( elem ) ;
    if ( elem.xConstraints ) elem.xConstraints.flush() ;
    if ( elem.jsPeer && elem.jsPeer.flush ) elem.jsPeer.flush() ;
    if ( elem.nodeName.toUpperCase() == 'IFRAME' )
    {
      try
      {
        var doc = elem.contentDocument;
        if ( ! doc ) doc = elem.contentWindow.document;
        if ( doc && doc.body )
        {
          var b = doc.body ;
          if ( b.jsPeer && b.jsPeer.flush ) b.jsPeer.flush() ;
        }
      }
      catch ( exc )
      {
      }
    }
    if ( elem.listenerContext ) elem.listenerContext.flush() ;
    if ( elem.fExecutor ) elem.fExecutor.flush() ;
    if ( elem.dndSource ) elem.dndSource.flush() ;
    if ( elem.dndTarget ) elem.dndTarget.flush() ;
    if ( elem.decorator ) elem.decorator.flush() ;
    if ( elem.xToBeFlushed )
    {
      for ( var i = 0 ; i < elem.xToBeFlushed.length ; i++ )
      {
        elem.xToBeFlushed[i].flush() ;
      }
      elem.xToBeFlushed.length = 0 ;
      elem.xToBeFlushed = undefined ;
    }
    elem.xConstraints = null ;
    elem.jsPeer = null ;
    elem.listenerContext = null ;
    elem.fExecutor = null ;
    elem.dndSource = null ;
    elem.dndTarget = null ;
    elem.decorator = null ;
    if ( elem.xContentIsHtml ) return ;
  }
  this.flushEventListener ( elem ) ;
  for ( var ch = elem.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.xEventHandlerList ) this.flushEventListener ( ch ) ;
    if ( ch.xConstraints ) ch.xConstraints.flush() ;
    if ( ch.jsPeer && ch.jsPeer.flush )
    {
      ch.jsPeer.flush() ;
    }
    if ( ch.xToBeFlushed )
    {
      for ( var i = 0 ; i < ch.xToBeFlushed.length ; i++ )
      {
        ch.xToBeFlushed[i].flush() ;
      }
      ch.xToBeFlushed.length = 0 ;
      ch.xToBeFlushed = undefined ;
    }
    if ( ch.nodeName.toUpperCase() == 'IFRAME' )
    {
      try
      {
        var doc = ch.contentDocument;
        if ( ! doc && ch.contentWindow ) doc = ch.contentWindow.document;
        if ( doc && doc.body )
        {
          var b = doc.body ;
          if ( b.jsPeer && b.jsPeer.flush ) b.jsPeer.flush() ;
        }
      }
      catch ( exc )
      {
      }
    }
    if ( ch.listenerContext ) ch.listenerContext.flush() ;
    if ( ch.fExecutor ) ch.fExecutor.flush() ;
    if ( ch.dndSource ) ch.dndSource.flush() ;
    if ( ch.dndTarget ) ch.dndTarget.flush() ;
    if ( ch.decorator ) ch.decorator.flush() ;
    ch.xConstraints = null ;
    ch.jsPeer = null ;
    ch.listenerContext = null ;
    ch.fExecutor = null ;
    ch.dndSource = null ;
    ch.dndTarget = null ;
    ch.decorator = null ;

    if (  ch.nodeName.toUpperCase() == "DIV"
       || ch.nodeName.toUpperCase() == "SPAN"
       )
    {
      var t = ch.xClassName ? ch.xClassName : "" ;
      if ( ! this.guiElementClassNames[ch.xClassName] && ! this.guiElementClassNames[ch.className] )
      {
        arguments.callee.call ( this, ch ) ;
      }
    }
  }
};
TGuiClass.prototype.flushEventListener = function ( elem )
{
  if ( ! elem ) return ;
  if ( elem.xEventHandlerList )
  {
    var i, item;
    for ( i = elem.xEventHandlerList.length - 1; i >= 0; i = i - 1)
    {
      item = elem.xEventHandlerList[i];
      if ( item[0].removeEventListener )
      {
        item[0].removeEventListener(item[1], item[2], item[3]);
      }
      if ( item[1].substring(0, 2) != "on" )
      {
        item[1] = "on" + item[1];
      }
      if ( item[0].detachEvent )
      {
        item[0].detachEvent(item[1], item[2]);
      }
      item[0][item[1]] = null;
    }
    elem.xEventHandlerList.length = 0 ;
    elem.xEventHandlerList = null ;
  }
};
/*
    this.addEventListener ( "click", this, this.mouseclick ) ;
    TGui.addEventListener ( this.TABLE, "dblclick", this.mouseDoubleClicked.bindAsEventListener ( this ) ) ;
*/
TGuiClass.prototype.addMouseDownEventListener = function ( obj, fn )
{
  if ( Tango.ua.realMobile )
  {
    this.addEventListener ( obj, "touchstart", fn ) ;
    return ;
  }
  this.addEventListener ( obj, "mousedown", fn ) ;
};
TGuiClass.prototype.addMouseUpEventListener = function ( obj, fn )
{
  if ( Tango.ua.realMobile )
  {
    this.addEventListener ( obj, "touchend", fn ) ;
    return ;
  }
  this.addEventListener ( obj, "mouseup", fn ) ;
};
TGuiClass.prototype.addEventListener = function ( obj, type, fn )
{
  if (obj.addEventListener)
  {
    obj.addEventListener( type, fn, false );
    if ( ! obj.xEventHandlerList ) obj.xEventHandlerList = [];
    obj.xEventHandlerList.push ( [ obj, type, fn ] ) ;
  }
  else
  if (obj.attachEvent)
  {
    if ( typeof ( obj["X"+type] ) == 'undefined' )
    {
      var xfn = function()
      {
        var listEvents = [];
        return {
          listEvents : listEvents,
          type : type,
          add : function ( node, type, fHandler)
          {
            if ( ! listEvents ) node.xEventFunctionList = [] ;
            listEvents.push(fHandler);
          },
          execute: function ( type, event )
          {
            for ( var n = 0 ; n < listEvents.length ; n++ )
            {
              listEvents[n] ( event || window.event ) ;
            }
          }
        } ;
      }();
      obj["X"+type] = xfn ;
      obj["X"+type].add ( obj, type, fn ) ;
      obj[type+fn] = function() { obj["X"+type].execute.call ( obj["X"+type], type, window.event ); } ;
      obj.attachEvent( "on"+type, obj[type+fn] );
    }
    else
    {
      obj["X"+type].add ( obj, type, fn ) ;
    }
  }
  else
  {
    obj["on"+type] = obj["e"+type+fn];
  }
};
TGuiClass.prototype.addEventListenerCache = function ( obj, type, fn )
{
  if (obj.addEventListener)
  {
    obj.addEventListener( type, fn, false );
    this.eventCache.add(obj, type, fn);
  }
  else
  if (obj.attachEvent)
  {
    obj["e"+type+fn] = fn;
    obj[type+fn] = function() { obj["e"+type+fn]( window.event ); } ;
    obj.attachEvent( "on"+type, obj[type+fn] );
    this.eventCache.add(obj, type, fn);
  }
  else
  {
    obj["on"+type] = obj["e"+type+fn];
  }
};
  
TGuiClass.prototype.getEventSrc = function (e)
{
  if (!e) e = window.event;
  if (e.originalTarget)
  return e.originalTarget;
  else if (e.srcElement)
  return e.srcElement;
};
TGuiClass.prototype.getPageOffsetLeft = function ( el )
{
  return el.offsetLeft - el.scrollLeft + (el.offsetParent ? this.getPageOffsetLeft(el.offsetParent) : 0);
};

TGuiClass.prototype.getPageOffsetTop = function ( el )
{
  return el.offsetTop - el.scrollTop + (el.offsetParent ? this.getPageOffsetTop(el.offsetParent) : 0);
};

TGuiClass.prototype.getPageScrollPosition = function()
{
  if ( window.pageXOffset )
  {
    return new TPoint ( window.pageXOffset, window.pageYOffset ) ;
  }
  else
  if ( document.documentElement )
  {
    return new TPoint ( document.body.scrollLeft + document.documentElement.scrollLeft
                       , document.body.scrollTop + document.documentElement.scrollTop
                       ) ;
  }
  else
  if ( document.body.scrollLeft >= 0 )
  {
    return new TPoint ( document.body.scrollLeft, document.body.scrollTop ) ;
  }
  else
  {
    return new TPoint ( 0, 0 ) ;
  }
};
TGuiClass.prototype.getAdjustedBrowserWindowSize = function()
{
  var size = this.getBrowserWindowSize() ;
  var minSize = this.getMinPageSize() ;
  if ( minSize.width && minSize.height
     && ( size.width < minSize.width || size.height < minSize.height )
     )
  {
    document.body.style.overflow = 'auto' ;
    if ( size.width < minSize.width ) size.width = minSize.width ;
    if ( size.height < minSize.height ) size.height = minSize.height ;
  }
  else
  {
    document.body.style.overflow = 'hidden' ;
  }
  return size ;
};
TGuiClass.prototype.getScreenSize = function()
{
  return new TDimension ( screen.width, screen.height ) ;
};
TGuiClass.prototype.getBrowserWindowSize = function()
{
  if (self.innerHeight) // all except Explorer
  {
    return new TDimension ( self.innerWidth, self.innerHeight ) ;
  }
  else
  if (document.documentElement && document.documentElement.clientHeight)
  // Explorer 6 Strict Mode
  {
    return new TDimension ( document.documentElement.clientWidth
                           , document.documentElement.clientHeight
                           ) ;
  }
  else
  if (document.body) // other Explorers
  {
    return new TDimension ( document.body.clientWidth
                           , document.body.clientHeight
                           ) ;
  }
};
TGuiClass.prototype.getSizeOf = function ( element )
{
  return new TDimension ( element.offsetWidth, element.offsetHeight ) ;
};
TGuiClass.prototype.getLocationOf = function ( element )
{
  if ( ! element ) return null ;
  return new TPoint ( element.offsetLeft, element.offsetTop ) ;
};
TGuiClass.prototype.getLocationOnPageOf = function ( element )
{
  if ( ! element ) return null ;
  return new TPoint ( this.getPageOffsetLeft ( element ), this.getPageOffsetTop ( element ) ) ;
};
TGuiClass.prototype.getBoundsOnPageOf = function ( element )
{
  if ( ! element ) return null ;
  return new TRectangle ( this.getPageOffsetLeft ( element )
                        , this.getPageOffsetTop ( element )
                        , element.offsetWidth
                        , element.offsetHeight
                        ) ;
};

TGuiClass.prototype.getMouseLocation = function ( event )
{
  return new TPoint ( document.all ? window.event.clientX : event.pageX
                     , document.all ? window.event.clientY : event.pageY
                     ) ;
};
/**
 *  @constructor
 */
var TGlobalEventHandlerClass = function ()
{
  this.onMouseDownExecutor = [] ;
  this.onMouseDownId = [] ;
  this.onLayoutChangedExecutor = [] ;
  this.activeComponent = undefined ;
  this.activeElement = undefined ;
  this.pendingRemoveMouse = undefined ;
  this.pendingRemoveKey = undefined ;
  this.onKeyDownExecutor = [] ;
  this.active = false ;
//  this.shortcutHash = new MultiHash() ;
};
var nnn = 0 ;
TGlobalEventHandlerClass.prototype =
{
  addToShortCutList: function ( c, elem, fe, text )
  {
    var p = {} ;
    if ( typeof ( c ) == 'number' ) p.kc = c ;
    else p.c = c.toUpperCase() ;
    p.elem = elem ;
    p.fe = fe ;
    p.text = text ;
    p.flush = function()
    {
      TGlobalEventHandler._removeFromShortCutList ( this ) ;
    } ;
    if ( ! this.shortcutHash ) this.shortcutHash = new MultiHash() ;
    if ( p.kc ) this.shortcutHash.put ( p.kc, p ) ;
    if ( p.c ) this.shortcutHash.put ( p.c, p ) ;
    if ( p.elem )
    {
      p.w = TWM.getWindow ( elem ) ;
      TGui.addToBeFlushed ( elem, p ) ;
    }
    p.toString = function()
    {
      return "text=" + this.text ;
    } ;
  },
  _removeFromShortCutList: function ( p )
  {
    if ( p.kc ) this.shortcutHash.remove ( p.kc, p ) ;
    if ( p.c ) this.shortcutHash.remove ( p.c, p ) ;
  },
  addOnLayoutChanged: function ( fe )
  {
    this.onLayoutChangedExecutor.push ( fe ) ;
  },
  layoutChanged: function(event)
  {
    var aExecutor = [] ;
    for ( var i = 0 ; i < this.onLayoutChangedExecutor.length ; i++ )
    {
      if ( this.onLayoutChangedExecutor[i].executeWithEvent ( event ) )
      {
        aExecutor.push ( this.onLayoutChangedExecutor[i] ) ;
      }
      else
      {
//        this.onMouseDownExecutor[i].flush() ;
      }
    }
    this.onLayoutChangedExecutor.length = 0 ;
    this.onLayoutChangedExecutor = aExecutor ;
  },
  removeOnLayoutChanged: function ( e )
  {
    for ( var i = 0 ; i < this.onLayoutChangedExecutor.length ; i++ )
    {
      if ( e === this.onLayoutChangedExecutor[i] )
      {
        this.onLayoutChangedExecutor[i].flush() ;
        this.onLayoutChangedExecutor.splice ( i, 1 ) ;
        break ;
      }
    }
  },
  addOnKeyDown: function ( fe )
  {
    this.onKeyDownExecutor.push ( fe ) ;
  },
  removeOnKeyDown: function ( e )
  {
    if ( this.pendingRemoveKey )
    {
      this.pendingRemoveKey.push ( e ) ;
      return ;
    }
    for ( var i = 0 ; i < this.onKeyDownExecutor.length ; i++ )
    {
      if ( e === this.onKeyDownExecutor[i] )
      {
        this.onKeyDownExecutor[i].flush() ;
        this.onKeyDownExecutor.splice ( i, 1 ) ;
        break ;
      }
    }
  },
  keydownGlobal: function(event)
  {
    this.pendingRemoveKey = [] ;
    var aExecutor = [] ;
    for ( var i = 0 ; i < this.onKeyDownExecutor.length ; i++ )
    {
      if ( this.onKeyDownExecutor[i].executeWithEvent ( event ) )
      {
        aExecutor.push ( this.onKeyDownExecutor[i] ) ;
      }
      else
      {
//        this.onMouseDownExecutor[i].flush() ;
      }
    }
    this.onKeyDownExecutor.length = 0 ;
    this.onKeyDownExecutor = aExecutor ;
    var a = this.pendingRemoveKey ;
    this.pendingRemoveKey = undefined ;
    for ( var i = 0 ; i < a.length ; i++ )
    {
      this.removeOnKeyDown ( a[i] ) ;
    }
    a.length = 0 ;
  },
  addOnMouseDown: function ( fe, id )
  {
    this.onMouseDownExecutor.push ( fe ) ;
    this.onMouseDownId.push ( id ? id : "" ) ;
    return fe ;
  },
  removeOnMouseDown: function ( e )
  {
    if ( this.pendingRemoveMouse )
    {
      this.pendingRemoveMouse.push ( e ) ;
      return ;
    }
    for ( var i = 0 ; i < this.onMouseDownExecutor.length ; i++ )
    {
      if ( e === this.onMouseDownExecutor[i] )
      {
        this.onMouseDownExecutor[i].flush() ;
        this.onMouseDownExecutor.splice ( i, 1 ) ;
        this.onMouseDownId.splice ( i, 1 ) ;
        break ;
      }
      if ( e === this.onMouseDownId[i] )
      {
        this.onMouseDownExecutor[i].flush() ;
        this.onMouseDownExecutor.splice ( i, 1 ) ;
        this.onMouseDownId.splice ( i, 1 ) ;
        break ;
      }
    }
  },
  mousedown: function(event)
  {
    this._lastKeyIsTabOnly = false ;
    this._lastKeyIsTab = false ;
    this.pendingRemoveMouse = [] ;
    var aExecutor = [] ;
    var aId = [] ;
    for ( var i = 0 ; i < this.onMouseDownExecutor.length ; i++ )
    {
      if ( this.onMouseDownExecutor[i].executeWithEvent ( event ) )
      {
        aExecutor.push ( this.onMouseDownExecutor[i] ) ;
        aId.push ( this.onMouseDownId[i] ) ;
      }
      else
      {
//        this.onMouseDownExecutor[i].flush() ;
      }
    }
    this.onMouseDownExecutor.length = 0 ;
    this.onMouseDownId.length = 0 ;
    this.onMouseDownExecutor = aExecutor ;
    this.onMouseDownId = aId ;
    var a = this.pendingRemoveMouse ;
    this.pendingRemoveMouse = undefined ;
    for ( var i = 0 ; i < a.length ; i++ )
    {
      this.removeOnMouseDown ( a[i] ) ;
    }
    a.length = 0 ;
    if ( this.activeComponent )
    {
    }
    this._handleMouseEventForFocus ( event ) ;
  },
  mouseup: function(event)
  {
    this._lastKeyIsTabOnly = false ;
    this._lastKeyIsTab = false ;
  },
  _handleMouseEventForFocus: function(event)
  {
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    if ( src.nodeName == "BODY" || src.nodeName == "HTML" )
    {
    }
    else
    if ( src.nodeName == "INPUT" || src.nodeName == "SELECT" || src.nodeName == "TEXTAREA" || src.nodeName == "BUTTON" )
    {
      if ( this.activeComponent ) this.activeComponent.focusLost() ;
      this.activeComponent = undefined ;
      if ( this.activeElement ) this.activeElement.isFocusOwner = false ;
      this.activeElement = undefined ;
    }
    else
    {
      var found = false ;
      for ( var ch = src ; ch ; ch = ch.parentNode )
      {
        if ( ch.nodeName == 'BODY' ) break ;
        if ( ch.isFocusable )
        {
          if ( this.activeComponent != ch.jsPeer )
          {
            if ( this.activeComponent ) this.activeComponent.focusLost() ;
            if ( this.activeElement ) this.activeElement.isFocusOwner = false ;
            if ( ch.jsPeer._focusHelper )
            {
              // ch.jsPeer._focusHelper.focus() ;
              this.activeComponent = ch.jsPeer ;
              this.activeComponent.focusGained() ;
              this.activeElement = ch ;
              this.activeElement.isFocusOwner = true ;
            }
            else
            {
              this.activeComponent = ch.jsPeer ;
              this.activeComponent.focusGained() ;
              this.activeElement = ch ;
              this.activeElement.isFocusOwner = true ;
            }
          }
          found = true ;
          break ;
        }
      }
      if ( ! found )
      {
        if ( this.activeComponent ) this.activeComponent.focusLost() ;
        this.activeComponent = undefined ;
        if ( this.activeElement ) this.activeElement.isFocusOwner = false ;
        this.activeElement = undefined ;
      }
    }
  },
  setFocus: function ( elem )
  {
    if ( this.activeElement === elem ) return ;
    if ( this.activeComponent ) this.activeComponent.focusLost() ;
    this.activeComponent = undefined ;
    if ( this.activeElement ) this.activeElement.isFocusOwner = false ;
    this.activeElement = undefined ;
    if ( document.activeElement )
    {
      var e = document.activeElement ;
      if ( e.nodeName == "INPUT" || e.nodeName == "SELECT" || e.nodeName == "TEXTAREA" || e.nodeName == "BUTTON" )
      {
        if ( document.activeElement._focusHelperOwner )
        {
        }
        else
        {
          document.activeElement.blur() ;
        }
      }
    }
    if ( elem.nodeName == "INPUT" || elem.nodeName == "SELECT" || elem.nodeName == "TEXTAREA" || elem.nodeName == "BUTTON" )
    {
      elem.focus() ;
    }
    else
    if ( elem.jsPeer && elem.isFocusable )
    {
      this.activeComponent = elem.jsPeer ;
      this.activeComponent.focusGained() ;
      this.activeElement = elem ;
      this.activeElement.isFocusOwner = true ;
    }
  },
  unFocus: function()
  {
    if ( this.activeComponent ) this.activeComponent.focusLost() ;
    this.activeComponent = undefined ;
    if ( this.activeElement ) this.activeElement.isFocusOwner = false ;
    this.activeElement = undefined ;
    if ( document.activeElement )
    {
      var e = document.activeElement ;
      if ( e.nodeName == "INPUT" || e.nodeName == "SELECT" || e.nodeName == "TEXTAREA" || e.nodeName == "BUTTON" )
      {
        document.activeElement.blur() ;
      }
    }
  },
  keydown: function(event)
  {
    if ( this.active ) return ;
    this.active = true ;
    var ev = new TEvent ( event ) ;
    this._lastKeyIsTabOnly = ev.isTabOnly() ;
    this._lastKeyIsTab = ev.isTab() ;
    this.keydownGlobal ( event ) ;
    if ( this.activeElement )
    {
      if ( this.activeComponent.onkeydown ) this.activeComponent.onkeydown ( event ) ;
      else TGui.dispatchKeyEvent ( this.activeElement, event ) ;
    }
    this.active = false ;
  },
  keyup: function(event)
  {
    if ( this.active ) return ;
    this.active = true ;
    var ev = new TEvent ( event ) ;
    this._lastKeyIsTabOnly = ev.isTabOnly() ;
    this._lastKeyIsTab = ev.isTab() ;
    this.tryShortcut ( ev ) ;
    if ( this.activeElement )
    {
      if ( this.activeComponent.onkeyup ) this.activeComponent.onkeyup ( event ) ;
      else TGui.dispatchKeyEvent ( this.activeElement, event ) ;
    }
    this.active = false ;
  },
  keypress: function(event)
  {
    if ( this.active ) return ;
    this.active = true ;
    var ev = new TEvent ( event ) ;
    this._lastKeyIsTabOnly = ev.isTabOnly() ;
    this._lastKeyIsTab = ev.isTab() ;
    if ( this.activeElement )
    {
      if ( this.activeComponent.onkeypress ) this.activeComponent.onkeypress ( event ) ;
      else TGui.dispatchKeyEvent ( this.activeElement, event ) ;
    }
    this.active = false ;
  },
  /*---------------------------------------------------------------------------------
  --------------------- Linux -----------
  Firefox: Alt ( +Ctrl )
  Chrome: Alt
  Opera: Alt + Shift
 --------------------- Windows ---------
  Firefox: Alt ( Alt Gr )
  Chrome: Alt ( Alt Gr )
  IE: Alt ( Alt Gr )
  Opera: Alt ( Alt Gr )
  ---------------------------------------------------------------------------------*/
  tryShortcut: function ( ev )
  {
    if ( ev.isAlt() && ev.isCtrl() && ev.isShift() && ev.getCharCode() == "O" )
    {
      var bws = TGui.getBrowserWindowSize() ;
      var s = "Browswer window size=" + bws.width + "x" + bws.height
            + "\nScreensize        =" + window.screen.width + "x" + window.screen.height
            + "\nAvailable size    =" + window.screen.availWidth + "x" + window.screen.availHeight
            ;
      log ( s ) ;
      if ( TWM.getNumberOfWindows() )
      {
        var n = TWM.getNumberOfWindows() ;
        log ( "---------------- windows ---------------" ) ;
        for ( var i = 0 ; i < n ; i++ )
        {
          var w = TWM.windows[i] ;
          log ( " [" + i + "]" + w.getName() ) ;
          log ( "    " + w.getId() ) ;
          log ( "    \"" + w.getTitle() + "\"" ) ;
          log ( "    " + w.getBounds() ) ;
        }
      }
      return ;
    }
    if ( ! this.shortcutHash ) return ;
    var cc = ev.getCharCode() ;
    if ( ! cc ) return ;
//    if ( ! ev.isAlt() && ! ev.isCtrl() ) cc = "" ;

    var w = TWM.getTopWindow() ;
    var kc = ev.getKeyCode() ;
    var wfound = null ;
    var found = null ;

    cc = cc.toUpperCase() ;
    var lcc = this.shortcutHash.get ( cc ) ;
    var charOnly = false ;
    if ( lcc && ! ev.isAlt() )
    {
      charOnly = true ;
    }
    var lkc = this.shortcutHash.get ( kc ) ;

    if ( kc == 13 )
    {
      var src = ev.getSource() ;
      if ( src.nodeName == 'BUTTON' && ! src.defaultButton ) return ;
    }
    if ( lkc )
    {
      for ( var i = 0 ; i < lkc.length ; i++ )
      {
        var ignore = false ;
        for ( var ch = lkc[i].elem ; ch ; ch = ch.parentNode )
        {
          if ( ch.nodeName.toUpperCase() == 'BODY' ) break ;
          if ( ch.style.visibility == 'hidden' )
	        {
            ignore = true ;
            break ;
	        }
      	}
      	if ( ignore ) continue ;
        if ( w && w === lkc[i].w ) wfound = lkc[i] ;
        else                       found = lkc[i] ;
        if ( found && wfound ) break ;
      }
    }
    if ( lcc )
    {
      for ( var i = 0 ; i < lcc.length ; i++ )
      {
        var ignore = false ;
	      var focusOwnerFound = false ;
        for ( var ch = lcc[i].elem ; ch ; ch = ch.parentNode )
	      {
          if ( ch.nodeName.toUpperCase() == 'BODY' ) break ;
          if ( ch.style.visibility == 'hidden' )
	        {
            ignore = true ;
            break ;
	        }
          if ( charOnly )
	        {
      	    if ( ch.isFocusOwner )
      	    {
      	      focusOwnerFound = true ;
      	      break ;
      	    }
      	  }
      	}
      	if ( ignore ) continue ;
        if ( charOnly && ! focusOwnerFound ) continue ;
        if ( w && w === lcc[i].w ) wfound = lcc[i] ;
        else                       found = lcc[i] ;
        if ( found && wfound ) break ;
      }
    }
    var p = found ;
    if ( wfound ) p = wfound ;
    if ( p )
    {
      if ( p.elem )
      {
        if ( p.elem.disabled ) return ;
        ev.setHtmlSource ( p.elem ) ;
      }
      p.fe.executeWithEvent ( ev ) ;
    }
  }
};
TGlobalEventHandlerClass.prototype._add_focushandler = function ( elem, layoutContext )
{
  if ( ! Tango.ua.useGenericButtons ) return ;
  if ( elem.nodeName == "BUTTON" && elem.xClassName == "PushButton" )
  {
    elem.style.backgroundColor = 'transparent' ;
  }
  if ( layoutContext )
  {
    elem.window = layoutContext.window ;
    layoutContext.lastFocusableElementInContainer = elem ;
  }
  TGui.addEventListener ( elem, "focus", this._onfocus.bindAsEventListener ( this ) ) ;
  TGui.addEventListener ( elem, "blur", this._onblur.bindAsEventListener ( this ) ) ;
} ;
TGlobalEventHandlerClass.prototype._onfocus = function ( event, renderOnly )
{
  var ev = new TEvent ( event ) ;
  var elem = ev.getSource() ;
  if ( elem.nodeName == "BUTTON" && elem.xClassName == "PushButton" )
  {
    var b = elem ;
    if ( Tango.ua.useGenericButtons && ! b.disabled )
    {
      if ( b.xInside || b.xPressed )
      {
      }
      else
      {
        var src = Tango.getThemeImageSrc ( "PushButton", stat ) ;
        if ( src != 'none' )
        {
          var w = b.offsetWidth ;
          var h = b.offsetHeight ;
          var stat = "focused" ;
          var txml = Tango.getThemeXml ( "PushButton", stat ) ;
          if ( ! txml )
          {
            stat = "default" ;
            txml = Tango.getThemeXml ( "PushButton", stat ) ;
          }
          if ( ! txml )
          {
            stat = "inside" ;
          }
          b.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "PushButton", stat, w, h ) ;
        }
      }
    }
  }
} ;
TGlobalEventHandlerClass.prototype._onblur = function ( event )
{
  var ev = new TEvent ( event ) ;
  var elem = ev.getSource() ;
//log ( "------- _onblur ----" ) ;
//log ( "elem.name=" + elem.name ) ;
  if ( elem.nodeName == "BUTTON" && elem.xClassName == "PushButton" )
  {
    var b = elem ;
    if ( Tango.ua.useGenericButtons && ! b.disabled )
    {
      var w = b.offsetWidth ;
      var h = b.offsetHeight ;
      var stat = "normal" ;
      if ( b.xInside ) stat = "inside" ;
      if ( b.xPressed ) stat = "pressed" ;
      var src = Tango.getThemeImageSrc ( "PushButton", stat ) ;
      if ( src != 'none' )
      {
        b.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "PushButton", stat, w, h ) ;
      }
    }
  }
  if ( ! Tango.ua.useGenericButtons ) return ;
  if ( this._lastKeyIsTabOnly )
  {
    if ( elem.isLastInContainer && elem.window )
    {
      var firstINP = new TComponent ( elem ).findFirstFocusableSibling() ;
      if ( ! firstINP )
      {
        firstINP = elem.window.findFirstFocusableElement() ;
      }
//log ( "firstINP=" + firstINP ) ;
      if ( firstINP )
      {
//log ( "firstINP=" + firstINP.name ) ;
        firstINP.focus() ;
	return ;
      }
    }
    if ( ! elem.window ) return ;
    var ae = document.activeElement ;
    if ( ae )
    {
      if ( ae.nodeName == 'BODY' )
      {
        return ;
      }
      if ( ! elem.window && ae.window )
      {
        return ;
      }
      if ( elem.window && ! ae.window )
      {
        elem.focus() ;
      }
    }
  }
  else
  if ( this._lastKeyIsTab )
  {
    if ( elem.window )
    {
      var firstINP = elem.window.findFirstFocusableElement() ;
      if ( firstINP === elem )
      {
        var lastINP = elem.window.findLastFocusableElement() ;
        if ( lastINP )
        {
          lastINP.focus() ;
        }
	return ;
      }
    }
  }
} ;

var TGlobalEventHandler = new TGlobalEventHandlerClass() ;

function TGlobalEventHandler_mousedown(event)
{
  TGlobalEventHandler.mousedown(event) ;
}
function TGlobalEventHandler_mouseup ( event ) { TGlobalEventHandler.mouseup ( event ) ; }
function TGlobalEventHandler_keydown ( event ) { TGlobalEventHandler.keydown ( event ) ; }
function TGlobalEventHandler_keyup ( event ) { TGlobalEventHandler.keyup ( event ) ; }
function TGlobalEventHandler_keypress ( event ) { TGlobalEventHandler.keypress ( event ) ; }

TGuiClass.prototype.tooltipOver = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! src.tooltip )
  {
    var ch = src ;
    while ( ch )
    {
      if ( ch.tooltip )
      {
        src = ch ;
        break ;
      }
      ch = ch.parentNode ;
    }
  }
  if ( ! src.tooltip ) return ;
  if ( ! src.tooltipId )
  {
    if ( src.closedByTimer )
    {
      src.closedByTimer = false ;
    }
    // if ( src.tooltip.startsWith ( "url:" ) )
    // {
    //   var pos = src.tooltip.indexOf ( ':' ) ;
    //   src = "javascript:TSys.getText ( '" + src.tooltip.substring ( pos+1 ) + "')" ;
    // }
    if ( src.tooltip.startsWith ( "javascript:" ) )
    {
      try
      {
        var pos = src.tooltip.indexOf ( ':' ) ;
        var str = src.tooltip.substring ( pos+1 ) ;
        str = str.trim() ;
        var fe = new TFunctionExecutor ( str ) ;
        var t2 = fe.execute ( src ) ;
        if ( t2 === "&" + "nbsp;" ) t2 = "" ;
        if ( ! t2 ) return ;
      }
      catch ( exc )
      {
        TSys.log ( exc  ) ;
      }
    }

    var mousePageX = document.all ? window.event.clientX : event.pageX;
    var mousePageY = document.all ? window.event.clientY : event.pageY;
    var srcPageX = TGui.getPageOffsetLeft(src) ;
    var srcPageY = TGui.getPageOffsetTop(src) ;

    var mouseX = mousePageX - srcPageX ;
    var mouseY = mousePageY - srcPageY ;

    var id = TSys.getTempId() ;
    src.tooltipId = id ;

    var timeout = new Date().getTime() - TGui.lastTooltipClosedMillis ;
    timeout = Math.min ( timeout, 700 ) ;
    timeout = Math.max ( timeout, 50 ) ;
    src.timer = new TTimer ( timeout, function()
    {
      var _src = src ;
      var _srcPageX = srcPageX ;
      var _srcPageY = srcPageY ;
      var _mousePageX = mousePageX ;
      var _mousePageY = mousePageY ;

      var div = document.createElement ( "div" ) ;
      div.style.position = "absolute" ;
      div.className = "ThemeTooltip" ;
      div.id = id ;
      div.style.top = ( _mousePageY + 16 ) + "px" ;
      div.style.left = ( _mousePageX + 0 ) + "px" ;
      div.style.visibility = "hidden" ;

      div.style.zIndex = TGui.zIndexTooltip ;
      document.getElementsByTagName ( "body" )[0].appendChild ( div ) ;
      src.tooltip = src.tooltip.trim() ;
      if ( src.tooltip.charAt ( 0 ) == "{" && src.tooltip.charAt ( src.tooltip.length-1 ) == "}" )
      {
        src.tooltipStyle = new EStyle ( src.tooltip ) ;
      }
      if ( src.tooltip.startsWith ( "url:" ) )
      {
        var pos = src.tooltip.indexOf ( ':' ) ;
        src = "javascript:TSys.getText ( '" + src.tooltip.substring ( pos+1 ) + "')" ;
      }
      if ( src.tooltip.startsWith ( "javascript:" ) )
      {
        try
        {
          var pos = src.tooltip.indexOf ( ':' ) ;
          var str = src.tooltip.substring ( pos+1 ) ;
          str = str.trim() ;
          var fe = new TFunctionExecutor ( str ) ;
          div.innerHTML = fe.execute(_src) ;
        }
        catch ( exc )
        {
          div.innerHTML = src.tooltip ;
          TSys.log ( exc  ) ;
        }
      }
      else
      if ( src.tooltipStyle )
      {
        div.innerHTML = TGui.substituteThemeImages ( src.tooltipStyle.style.text ) ;
      }
      else
      {
        div.innerHTML = src.tooltip ;
      }
      _src.divX = _mousePageX + 16 ;
      _src.divY = _mousePageY + 0 ;
			var src_h = _src.offsetHeight ;
			if ( src_h <= 32 && _srcPageY + src_h > div.offsetTop )
			{
        div.style.top = ( _srcPageY + src_h + 2 ) + "px" ;
			}

      if ( src.tooltipStyle )
      {
        src.tooltipStyle.apply ( div ) ;
      }
      else
      {
        var dom = Tango.getThemeDom ( "Tooltip", "normal" ) ;
        if ( dom )
        {
          var w = div.offsetWidth ;
          var h = div.offsetHeight ;
          var url = TGui.buildThemeBackgroundImageUrl ( "Tooltip", "normal", w, h ) ;
          div.style.backgroundImage = url ;
        }
      }
      var wsize = TGui.getBrowserWindowSize() ;
      if ( div.offsetLeft + div.offsetWidth > wsize.width )
      {
        div.style.left = ( wsize.width - div.offsetWidth - 1 ) + "px" ;
      }
      div.style.visibility = "visible" ;

      TGlobalEventHandler.addOnMouseDown ( new TFunctionExecutor ( TGui, TGui.tooltipCloseOnElement, _src ), _src ) ;
      src.closeTimer = new TTimer ( 3000, function()
      {
        var __src = src ;
        __src.closedByTimer = true ;
        TGui.tooltipCloseOnElement ( __src ) ;
        TGlobalEventHandler.removeOnMouseDown ( __src ) ;
      } ) ;
      src.closeTimer.setRepeats ( false ) ;
      src.closeTimer.start() ;
    } ) ;

    src.timer.setRepeats ( false ) ;
    src.timer.start() ;
  }
};
TGuiClass.prototype.tooltipOut = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( ! src.tooltipId )
  {
    var ch = src ;
    src = null ;
    while ( ch )
    {
      if ( ch.tooltipId )
      {
        src = ch ;
        break ;
      }
      ch = ch.parentNode ;
    }
  }
  if ( ! src ) return ;
  if ( ! src.tooltipId )
  {
    if ( src.timer )
    {
      src.timer.stop() ;
      src.timer = null ;
    }
    if ( src.closeTimer )
    {
      src.closeTimer.stop() ;
      src.closeTimer = null ;
    }
  }
  src.closedByTimer = false ;
  if ( ! src.tooltipId ) return ;

  var mousePageX = document.all ? window.event.clientX : event.pageX;
  var mousePageY = document.all ? window.event.clientY : event.pageY;
  var srcPageX = TGui.getPageOffsetLeft(src) ;
  var srcPageY = TGui.getPageOffsetTop(src) ;
  var d = 1 ;
  if ( src.nodeName == 'INPUT' ) d = 2 ;
  if (  mousePageX <= srcPageX + d
     || mousePageX >= srcPageX + src.offsetWidth
     || mousePageY <= srcPageY + d
     || mousePageY >= srcPageY + src.offsetHeight
     )
  {
    TGui.tooltipCloseOnElement ( src ) ;
    TGlobalEventHandler.removeOnMouseDown ( src ) ;
  }
  else
  {
    var div = document.getElementById ( src.tooltipId ) ;
    var divX = 0 ;
    var divY = 0 ;
    if ( Math.abs ( src.divX - mousePageX ) < 8 )
    {
      divX = src.divX + 8 ;
    }
    if ( Math.abs ( src.divY - mousePageY ) < 8 )
    {
      divY = src.divY + 8 ;
			var src_h = src.offsetHeight ;
			if ( src_h <= 32 && srcPageY + src_h > divY )
			{
        divY = srcPageY + src_h + 2 ;
			}
    }
    if ( divX > 0 || divY > 0 )
    {
      if ( div )
      {
        if ( divX > 0 )
        {
          div.style.left = divX + "px" ;
          src.divX = divX ;
        }
        if ( divY > 0 )
        {
          div.style.top = divY + "px" ;
          src.divY = divY ;
        }
      }
    }
  }
};
TGuiClass.prototype.tooltipClose = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;

  if ( ! src.tooltipId )
  {
    var ch = src ;
    src = null ;
    while ( ch )
    {
      if ( ch.tooltipId )
      {
        src = ch ;
        break ;
      }
      ch = ch.parentNode ;
    }
  }
  TGui.tooltipCloseOnElement ( src ) ;
  TGlobalEventHandler.removeOnMouseDown ( src ) ;
};
TGuiClass.prototype.tooltipCloseOnElement = function ( element, ooo )
{
  var src = element ;
  if ( ! src ) return ;
  TGlobalEventHandler.removeOnMouseDown ( src ) ;
  src.closedByTimer = false ;
  if ( src.timer ) src.timer.stop() ;
  if ( src.closeTimer ) src.closeTimer.stop() ;
  src.timer = null ;
  src.closeTimer = null ;
  var div = document.getElementById ( src.tooltipId ) ;
  if ( div )
  {
    TGui.lastTooltipClosedMillis = new Date().getTime() ;
    div.parentNode.removeChild ( div ) ;
  }
  src.tooltipId = null ;
};
TGuiClass.prototype.unload = function ( event )
{
  TSys.unload() ;
  TGui.eventCache.flush() ;
};
TGuiClass.prototype.resetForm = function ( id )
{ 
  var xml = TSys.getXmlById ( id ) ;
  if ( ! xml ) return ;
  xml.reset() ;
};
TGuiClass.prototype.renderStartPage = function ( startAxlName )
{
  var response  = TSys.getStartAxl ( startAxlName ) ;
  var dir = this.getTextDirection() ;
  document.body.dir = dir ;
  this._previousBrowserWindowSize = this.getBrowserWindowSize() ;
  this._previousWindowOrientation = window.orientation ;
  this.createHtmlElements ( response ) ;
  this.setClassImages() ;
};
TGuiClass.prototype.renderWorkPage = function()
{ 
  var workPage = TSys.getWebConfig().getWorkAxl() ;
  var response  = TSys.getAxl ( workPage ) ;
  this.flushBody() ;
  var dir = this.getTextDirection() ;
  document.body.dir = dir ;
  if ( ! this._previousBrowserWindowSize )
  {
    this._previousBrowserWindowSize = this.getBrowserWindowSize() ;
    this._previousWindowOrientation = window.orientation ;
  }
  this.createHtmlElements ( response ) ;
  this.setClassImages() ;
  this._fireLoginEndEvent(null) ;
};
TGuiClass.prototype.addLoginEndListener = function ( fe )
{
  this._loginEndListener.push ( fe ) ;
};
TGuiClass.prototype._fireLoginEndEvent = function ( event )
{
  for ( var i = 0 ; i < this._loginEndListener.length ; i++ )
  {
    try
    {
      this._loginEndListener[i].executeWithEvent ( event ) ;
    }
    catch ( exc )
    {
    }
  }
};
TGuiClass.prototype.substituteThemeImages = function ( str )
{
  if ( ! str ) return str ;
  var pos = str.indexOf ( "Tango/" ) ;
  while ( pos > 0 )
  {
    var q = str.charAt ( pos - 1 ) ;
    var pos2 = str.indexOf ( q, pos ) ;
    if ( pos2 < 0 ) break ;
    var img = str.substring ( pos, pos2 ) ;
    var aa = img.split ( "/" ) ;
    if ( aa.length != 3 ) break ;
    img = TGui.buildThemeImageUrl ( aa[1], aa[2], NaN, NaN )  ;
    str = str.substring ( 0, pos ) + img + str.substring ( pos2 ) ;
    pos = str.indexOf ( "Tango/", pos ) ;
  }
  return str ;
};
TGuiClass.prototype.collectExtendedProperties = function ( dom )
{
  if ( ! dom || ! dom.firstChild ) return null ;
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeName == "Properties" )
    {
      var xProperties = null ;
      for ( var prop = ch.firstChild ; prop ; prop = prop.nextSibling )
      {
        if ( prop.nodeType != DOM_ELEMENT_NODE ) continue ;
        var n = prop.tagName ;
        var v = "" ;
        if ( prop.firstChild )
        {
          if ( typeof ( prop.firstChild.nodeValue ) != 'undefined' ) v = prop.firstChild.nodeValue ;
        }
        if ( ! xProperties ) xProperties = [] ;
        xProperties[n] = v ;
      }
      return xProperties ;
    }
    if ( ch.nodeType == DOM_ELEMENT_NODE )
    {
      break ;
    }
  }
  return null ;
};
/**
 *  @constructor
 */
var TConstraints = function()
{
  this.taraWidth = NaN ;
  this.taraHeight = NaN ;
  this.rightComponent = null ;
};
TConstraints.prototype =
{
  toString: function()
  {
    return "(TConstraints)["
         + "\n rightAttach=" + this.rightAttach + "\n rightMinus=" + this.rightMinus + "\n rightValue=" + this.rightValue
         + "\n bottomAttach=" + this.bottomAttach + "\n bottomMinus=" + this.bottomMinus + "\n bottomValue=" + this.bottomValue
         + "\n center: x=" + ( this.centerX ? "true" : "false" ) + ", y=" + ( this.centerY ? "true" : "false" )
         + "\n rightAttachComponent=" + this.rightAttachComponent
         + "\n bottomAttachComponent=" + this.bottomAttachComponent
         + ( this.rightComponent ? "\n" + new TComponent ( this.rightComponent ) : "" )
         + "]"
         ;
  },
  getTaraWidth: function ( e )
  {
    if ( ! isNaN ( this.taraWidth ) ) return this.taraWidth ;
    this.taraWidth = TGui.getComputedTaraWidth ( e ) ;
    return this.taraWidth ;
  },
  getTaraHeight: function ( e )
  {
    if ( ! isNaN ( this.taraHeight ) ) return this.taraHeight ;
    this.taraHeight = TGui.getComputedTaraHeight ( e ) ;
    return this.taraHeight ;
  },
  setRightComponent: function ( comp )
  {
    this.rightComponent = comp ;
  },
  setBottomComponent: function ( comp )
  {
    this.bottomComponent = comp ;
  },
  flush: function()
  {
    this.rightComponent = null ;
  },
  parseRight: function ( str )
  {
    if ( str.indexOf ( "-0" ) == 0 )
    {
      this.rightAttach = true ;
      this.rightMinus = true ;
      this.rightValue = 0 ;
    } 
    else
    if ( str.indexOf ( "0" ) == 0 )
    {
      this.rightAttach = true ;
      this.rightMinus = false ;
      this.rightValue = 0 ;
    }
    else
    {
      this.rightValue = parseInt ( str ) ;
      if ( ! isNaN ( this.rightValue ) )
      {
        this.rightAttach = true ;
        this.rightMinus = this.rightValue < 0 ;
        this.rightValue = Math.abs ( this.rightValue ) ;
      }
    }
  },
  parseBottom: function ( str )
  {
    if ( str.indexOf ( "-0" ) == 0 )
    {
      this.bottomAttach = true ;
      this.bottomMinus = true ;
      this.bottomValue = 0 ;
    }
    else
    if ( str.indexOf ( "0" ) == 0 )
    {
      this.bottomAttach = true ;
      this.bottomMinus = false ;
      this.bottomValue = 0 ;
    }
    else
    {
      this.bottomValue = parseInt ( str ) ;
      if ( ! isNaN ( this.bottomValue ) )
      {
        this.bottomAttach = true ;
        this.bottomMinus = this.bottomValue < 0 ;
        this.bottomValue = Math.abs ( this.bottomValue ) ;
      }
    }
  },
  parseCenter: function ( str )
  {
    if ( ! str ) return ;
    if ( str.indexOf ( "x" ) >= 0 ) this.centerX = true ;
    if ( str.indexOf ( "y" ) >= 0 ) this.centerY = true ;
  },
  setBottomAttachComponent: function()
  {
    this.bottomAttachComponent = true ;
  },
  setRightAttachComponent: function()
  {
    this.rightAttachComponent = true ;
  }
};
TGuiClass.prototype.dispatchKeyEvent = function ( htmlElement, event )
{
  var ev = new TEvent ( event ) ;
  if ( TSys.isIE() )
  {
    var e = document.createEventObject ( event );
    htmlElement.fireEvent ("on" + event.type, e );
    ev.consume() ;
  }
  else
  {
    ev.consume() ;
    var kc = ev.getKeyCode() ;
    var cc = ev.getCharCode() ;
    if (event.initKeyEvent)
    {        // Firefox, Safari
      var e = document.createEvent ("KeyEvents");
      e.initKeyEvent ( "keyup", true, true, window 
                     , event.ctrlKey, event.altKey, event.shiftKey, event.metaKey
                     , kc, null
                     ) ;
      htmlElement.dispatchEvent ( e ) ;
    }
    else
    {
      var e = document.createEvent ( "Event" ) ;
      e.initEvent( event.type, true, true ) ;
      e.keyCode = kc ;
      htmlElement.dispatchEvent ( e ) ;
    }
  }
};
TGuiClass.prototype.isComponent = function ( obj )
{
  if ( ! obj ) return false ;
  if ( obj instanceof TComponent ) return true ;
  if ( obj.xPeerIsComponent ) return true ;
  return false ;
};
TGuiClass.prototype.getComponent = function ( htmlElement )
{
  if ( typeof ( htmlElement ) == 'string' ) htmlElement = document.getElementById ( htmlElement ) ;
  if ( htmlElement )
  {
    var e = htmlElement ;
    if ( this.isComponent ( e.jsPeer ) ) return e.jsPeer ;
    var xClassName = e.xClassName ;
    if ( ! xClassName )
    {
      if ( e.className == "ButtonImage" || e.className == "ButtonText" )
      {
        return new TButton ( e.parentNode ) ;
      }
    }
    if ( xClassName == "ButtonImage" || xClassName == "ButtonText" )
    {
      if ( this.isComponent ( e.parentNode.jsPeer ) ) return e.parentNode.jsPeer ;
    }
    if ( xClassName == 'TextField' ) return new TTextField ( e ) ;
    else
    if ( xClassName == 'TextArea' ) return new TTextArea ( e ) ;
    else
    if (  xClassName == 'ToolbarToggle'
       || xClassName == 'ToolbarButton'
       || xClassName == 'ToolbarButtonSmall'
       || xClassName == 'ToolbarToggleSmall'
       )
    {
      return new TButton ( e ) ;
    }
    else
    if ( xClassName == 'PushButton' ) return new TButton ( e ) ;
    else
    if ( xClassName == 'ButtonText' || xClassName == 'ButtonImage' ) return new TButton ( e.parentNode ) ;
    else
    if ( xClassName == 'Label' )
    {
      if ( e.xParentComponent ) return this.getComponent ( e.xParentComponent ) ;
      return new TLabel ( e ) ;
    }
    else
    if ( xClassName == 'Choice' ) return new TChoice ( e ) ;
    else
    if ( xClassName == 'Date' ) return new TDate ( e ) ;
    else
    if ( xClassName == 'DateTime' ) return new TDate ( e ) ;
    else
    if ( xClassName == 'Container' ) return new TContainer ( e ) ;
    else
    if (  xClassName == 'MultiformBody'
       || xClassName == "Notebook"
       || xClassName == "NotebookBody"
       )
    {
      return new TContainer ( e ) ;
    }
    else
    if (  xClassName == 'DateDay'
       || xClassName == 'DateMonth'
       || xClassName == 'DateYear'
       || xClassName == 'DateHour'
       || xClassName == 'DateMinute'
       || xClassName == 'DateSecond'
       )
    {
      return new TDate ( e.parentNode ) ;
    }
    else
    if ( e.nodeName.toUpperCase() == 'INPUT' )
    {
      if ( e.type == "checkbox" ) return new ACNativeCheckbox ( e ) ;
      if ( e.type == "radio" ) return new ACNativeRadio ( e ) ;
    }
  }
  return new TComponent ( htmlElement ) ;
};
TGuiClass.prototype.createElement = function ( src, targetElement )
{
  var span = document.createElement ( "span" ) ;
  if ( ! targetElement ) targetElement = document.body ;
  targetElement.appendChild ( span ) ;
  if ( typeof ( src ) == 'string' ) span.innerHTML = src ;
  else                              this.setAxl ( span, src ) ;
  var e = span.firstChild ;
  span.removeChild ( e ) ;
  targetElement.removeChild ( span ) ;
  return e ;
};
TGuiClass.prototype.getTextDirection = function()
{
  if ( this.textDirection ) return this.textDirection ;
  this.textDirection = TSys.getWebConfig().getTextDirection() ;
  return this.textDirection ;
} ;
TGuiClass.prototype.isLTR = function()
{
  if ( this.textDirection ) return this.textDirection == "ltr" ;
  this.getTextDirection() ;
  return this.textDirection == "ltr" ;
} ;
TGuiClass.prototype.findPageletFromElement = function ( elem, qualifier )
{
  if ( typeof ( qualifier ) == 'function' )
  {
    for ( var p = elem ; p ; p = p.parentNode )
    {
      if ( p.jsPeer )
      {
        if ( typeof ( p.jsPeer.isPagelet ) == 'function' && p.jsPeer.isPagelet() )
        {
          if ( p.jsPeer instanceof qualifier )
          {
            return p.jsPeer ;
          }
        }
        if ( typeof ( p.jsPeer.getPagelet ) == 'function' )
        {
          var pl = p.jsPeer.getPagelet() ;
          if ( pl instanceof qualifier ) return pl ;
        }
      }
    }
    return null ;
  }
  for ( var p = elem ; p ; p = p.parentNode )
  {
    if ( p.jsPeer )
    {
      if ( typeof ( p.jsPeer.isPagelet ) == 'function' && p.jsPeer.isPagelet() )
      {
        return p.jsPeer ;
      }
      if ( typeof ( p.jsPeer.getPagelet ) == 'function' )
      {
        var pl = p.jsPeer.getPagelet() ;
        if ( pl ) return pl ;
      }
    }
  }
  return null ;
};
TGuiClass.prototype.getValueLabel = function ( elem )
{
  if ( typeof ( elem.trueValue ) != 'undefined' ) return elem.trueValue ;

  var s = elem.innerHTML ;
  if ( elem.xType == 'money' || elem.xType == 'float' )
  {
    if ( isNaN ( parseFloat ( s ) ) ) return "" ;
  }
  else
  if ( elem.xType == 'int' )
  {
    if ( isNaN ( parseInt ( s ) ) ) return "" ;
  }
  else
  if ( elem.xsi_type == 'xsd_date' )
  {
  }
  if ( s ) return s.trim() ;
  return s ;
};
TGuiClass.prototype.setValueLabel = function ( ch, value )
{
  if ( ch.xType )
  {
    if ( ch.xType == 'float' )
    {
      var d = value ;
      if ( typeof ( value ) != 'number' ) d = parseFloat ( value ) ;
      if ( isNaN ( d ) )
      {
        ch.innerHTML = "" ;
        ch.trueValue = null ;
      }
      else
      {
        ch.innerHTML = TSys.getLocale(ch).formatMoney ( d ) ;
        ch.trueValue = d ;
      }
    }
    else
    if ( ch.xType == 'int' )
    {
      var d = value ;
      if ( typeof ( value ) != 'number' ) d = parseInt ( value ) ;
      if ( isNaN ( d ) )
      {
        ch.innerHTML = "" ;
        ch.trueValue = null ;
      }
      else
      {
        ch.innerHTML = value ;
        ch.trueValue = d ;
      }
    }
    else
    if ( ch.xType == 'money' )
    {
      var d = value ;
      if ( typeof ( value ) != 'number' ) d = parseFloat ( value ) ;
      if ( isNaN ( d ) )
      {
        ch.innerHTML = "" ;
        ch.trueValue = null ;
      }
      else
      {
        ch.innerHTML = TSys.formatMoneyWithCurrency ( d ) ;
        ch.trueValue = d ;
      }
    }
  }
  else
  if ( ch.xsi_type )
  {
    var t = value ;
    var date = value ;
    if ( t )
    {
      if ( ch.xsi_type == "xsd-date" )
      {
        if ( TSys.isDate ( value ) ) date = value ;
        else                         date = DateUtils.parseDate ( value ) ;
        t = DateUtils.formatDateShort ( date ) ;
      }
      if ( ch.xsi_type == "xsd-datetime" )
      {
        if ( TSys.isDate ( value ) ) date = value ;
        else                         date = DateUtils.parseDate ( value ) ;
        t = DateUtils.formatDateTimeShort ( date ) ;
      }
    }
    ch.innerHTML = t ;
    ch.trueValue = date ;
  }
  else
  if ( ch.xMappings )
  {
    var t1 = ch.xMappings[value] ;
    if ( t1 ) value = t1 ;
    if ( typeof ( value ) == 'undefined' )
    {
      ch.innerHTML = "" ;
      ch.trueValue = undefined ;
    }
    else
    if ( typeof ( value ) == 'string' )
    {
      ch.trueValue = value ;
      if ( value.indexOf ( '&' ) >= 0 ) ch.innerHTML = value.replace ( /&/g, "&amp;" ) ;
      else                              ch.innerHTML = value ;
    }
    else
    {
      ch.trueValue = undefined ;
      ch.innerHTML = value ;
    }
  }
  else
  {
    if ( typeof ( value ) == 'undefined' )
    {
      ch.innerHTML = "" ;
      ch.trueValue = undefined ;
    }
    else
    if ( typeof ( value ) == 'string' && value.indexOf ( '&' ) >= 0 )
    {
      var str =    value.replace ( /&nbsp;/g, "XXXXXX" ) ;
      ch.trueValue = value ;
      ch.innerHTML = str.replace ( /&/g, "&amp;" ).replace ( /XXXXXX/g, "&nbsp;" ) ;
    }
    else
    {
      ch.trueValue = undefined ;
      ch.innerHTML = value ;
    }
  }
  if ( ch.mandatory )
  {
    TGui.setMandatoryDecoration ( ch ) ;
  }
} ;
TGuiClass.prototype.isVisibleOnScreen = function ( elem )
{
  for ( var ch = elem ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeName == 'BODY' ) return true ;
    if ( ch.style.visibility == 'hidden' ) return false ;
  }
};
TGuiClass.prototype.setDialogDecorator = function ( obj, method )
{
  this._dialogDecorator = new TFunctionExecutor ( obj, method ) ;
};
TGuiClass.prototype.setWindowDecorator = function ( obj, method )
{
  this._windowDecorator = new TFunctionExecutor ( obj, method ) ;
};
TGuiClass.prototype.cancelWindow = function ( event )
{
  this.windowCancel ( event ) ;
};
TGuiClass.prototype.windowCancel = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  if ( w.hasChanged() )
  {
    ev.consume() ;
    var d = new TUserDialog ( "WindowDataAreChangedDiscard" ) ;
    d.setUserFunction ( this.windowCancelAnswer, [ w ], this ) ;
    d.setOwnerWindow ( w ) ;
    d.askYesNo() ;
  }
  else
  {
    w.closeImediately() ;
  }
} ;
TGuiClass.prototype.windowCancelAnswer = function ( answer, w )
{
  if ( ! answer.isYes() ) return ;
  w.closeImediately() ;
} ;
TGuiClass.prototype.hasScrollbars = function ( elem )
{
  return this.hasVerticalScrollbar ( elem ) || this.hasHorizontalScrollbar ( elem ) ;
} ;
TGuiClass.prototype.hasVerticalScrollbar = function ( elem )
{
  var scrollHeight = elem.scrollHeight ;
  if ( elem.innerHeight ) // all except Explorer
  {
    return elem.innerHeight < scrollHeight ;
  }
  if ( elem.clientHeight )
  {
    return elem.clientHeight + 1 < scrollHeight ;
  }
} ;
TGuiClass.prototype.hasHorizontalScrollbar = function ( elem )
{
  var scrollWidth = elem.scrollWidth ;
  if ( elem.innerWidth ) // all except Explorer
  {
    return elem.innerWidth < scrollWidth ;
  }
  if ( elem.clientWidth )
  {
    return elem.clientWidth + 1 < scrollWidth ;
  }
} ;
TGuiClass.prototype.renderShortcutText = function ( text, renderAlways )
{
  if ( typeof ( this.shortcuts ) == 'undefined' )
  {
    this.shortcuts = TSys.getWebConfig().shortcuts ;
  }
  var render = this.shortcuts || renderAlways ;
  if ( TSys.keyboardShortcutsDisabled ) render = false ;

  var p = {} ;
  p.shortcutCharacter = "" ;
  p.text = text ;
  if ( ! text || text.indexOf ( "~" ) < 0 ) return p ;
 
  var pos = text.indexOf ( "~" ) ;
  if ( pos >= text.length - 1 ) return p ;

  if ( pos == 0 )
  {
    if ( render )
    {
      p.shortcutCharacter = text.substring ( 1, 2 ) ;
      text = text.substring ( 2 ) ;
      p.text = "<u><b>" + p.shortcutCharacter + "</b></u>" + text ;
    }
    else
    {
      p.text = text.substring ( 1 ) ;
    }
  }
  else
  {
    if ( render )
    {
      p.shortcutCharacter = text.substring ( pos+1, pos+2 ) ;
      p.text = text.substring ( 0, pos ) + "<u><b>" + p.shortcutCharacter + "</b></u>" + text.substring ( pos+2 )  ;
    }
    else
    {
      p.text = text.substring ( 0, pos ) + text.substring ( pos+1, pos+2 ) + text.substring ( pos+2 )  ;
    }
  }
  return p ;
} ;

TGuiClass.prototype.isEvent = function ( event )
{
  return typeof ( event.type ) == 'string' && typeof ( event.shiftKey ) == 'boolean' ;
};
TGuiClass.prototype.parsePixel = function ( pix )
{
  if ( typeof ( pix ) === 'string' )
  {
    var i = parseInt ( pix ) ;
    if ( pix.indexOf ( '.' ) >= 0 )
    {
      if ( i >= 0 ) i = parseInt ( parseFloat ( pix ) + 0.5 ) ;
      else          i = - parseInt ( - parseFloat ( pix ) + 0.5 ) ;
    }
    return i ;
  }
  return pix ;
};
TGuiClass.prototype.findFirstFocusableElement = function ( dom, excludeDom )
{ 
  if ( ! dom ) return ;
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.readOnly || ch.disabled || ch.style.visibility == "hidden" ) continue ;
    if ( ch == excludeDom ) continue ;
    if ( ch.type )
    {
      if (  ch.type == 'select-one'
         || ch.type == 'select-multiple'
         || ch.type == 'checkbox'
         || ch.type == 'radio'
         || ch.type == 'text'
         || ch.type == 'password'
         || ch.type == 'textarea'
         || ch.nodeName == 'BUTTON'
   )
      {
        return ch ;
      }
    }
    if ( ch.firstChild )
    {
      var e = this.findFirstFocusableElement ( ch ) ;
      if ( e ) return e ;
    }
  }
  return null ;
};
TGuiClass.prototype.findFirstFocusableSibling = function ( dom )
{ 
  if ( ! dom ) return ;
  var p = dom.parentNode ;
  if ( ! p ) return ;
  p = p.nextSibling ;
  for ( var ch = p ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeName == 'BODY' ) return ;
    if ( ch.xPseudoTopWindow ) return ;
    var e = this.findFirstFocusableElement ( ch, dom.parentNode ) ;
    if ( e ) return e ;
  }
  return null ;
};
TGuiClass.prototype.findLastFocusableElement = function ( dom )
{ 
  if ( ! dom ) return ;
  var lastFound = null ;
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.readOnly || ch.disabled || ch.style.visibility == "hidden" ) continue ;
    if ( ch.type )
    {
      if (  ch.type == 'select-one'
         || ch.type == 'select-multiple'
         || ch.type == 'checkbox'
         || ch.type == 'radio'
         || ch.type == 'text'
         || ch.type == 'password'
         || ch.type == 'textarea'
         || ch.nodeName == 'BUTTON'
   )
      {
        lastFound = ch ;
      }
      continue ;
    }
    if ( ch.firstChild )
    {
      var e = this.findLastFocusableElement ( ch ) ;
      if ( e ) lastFound = e ;
    }
  }
  return lastFound ;
};
/*
** Used as Trait
*/
PageletInterface = {}
PageletInterface._parent = null ;
PageletInterface._children = { create: function(){return [] ;} } ;
PageletInterface.isPagelet = function() { return true ; } ;
PageletInterface.getParent = function ( qualifier )
{
  if ( typeof ( qualifier ) == 'function' )
  {
    if ( this instanceof qualifier )
    {
      return this ;
    }
    else
    if ( this._parent )
    {
      if ( this._parent instanceof qualifier )
      {
        return this._parent ;
      }
      if ( typeof ( this._parent.getParent ) == 'function' )
      {
        return this._parent.getParent() ;
      }
    }
    return null ;
  }
  return this._parent ;
} ;
PageletInterface.setParent = function ( parentPagelet )
{
  this._parent = parentPagelet ;
} ;
PageletInterface.getChild = function ( nameOrId )
{
  for ( var i = 0 ; i < this._children.length ; i++ )
  {
    if ( this._children[i].dom.name == nameOrId )
    {
      return this._children[i] ;
    }
  }
} ;
PageletInterface.addChild = function ( child )
{
  this._children.push ( child ) ;
  child._parent = this ;
}
PageletInterface.removeChild = function ( child )
{
  for ( var i = 0 ; i < this._children.length ; i++ )
  {
    if ( child === this._children[i] )
    {
      this._children.splice ( i, 1 ) ;
      break ;
    }
  }
}

// ---------- drag ---------------------------
/**
 *  @constructor
 */
var DraggerClass = function()
{
  this.active = false ;
  this.mouseOffsetX = 0 ;
  this.mouseOffsetY = 0 ;
  this.mouseX  = 0 ;
  this.mouseY  = 0 ;
  this.mouseXOld  = 0 ;
  this.mouseYOld  = 0 ;
  this.dragElement = null ;
  this.resizeComponent = null ;
  this.dragSplitbar = null ;
  this.dragSplitbarHorizontal = false ;
  this.dndSource = null ;
  this.dragSourceEvent = null ; // new DragSourceEvent ( null, this ) ;
  this.dragSourceDropEvent = null ; // new DragSourceDropEvent ( null, this ) ;
  this.dragSourceStartEvent = null ; // new DragSourceStartEvent ( null, this ) ;
  this.dropTargetEvent = null ; // new DropTargetEvent ( null, this ) ;
  this.dropTargetDropEvent = null ; // new DropTargetDropEvent ( null, this ) ;

  this.dndCurrentDropTarget = null ;
  this.dndDropTargets = [] ;
  this.dndDragSources = [] ;

  this.dndDropTargetDragAcceptAction = 0 ;
  this.dndDropTargetRejectDrag = false ;

  this.dndDropTargetDropAcceptAction = 0 ;
  this.dndDropTargetRejectDrop = false ;
  this.dndDropTargetDropCompleteSuccess = false ;

  this.userAction = 1 ;
  this.dragWatermarkPixel = 2 ;
  this.dndDragStartPending = false ;
  this.dragStartPending = false ;
  this.dragStartX = 0 ;
  this.dragStartY = 0 ;
  TGlobalEventHandler.addOnLayoutChanged ( new TFunctionExecutor ( this, this.layoutChanged ) ) ;
  this.dragArea = null ;
  this.dragInside = false ;
  this.dragEvent = new ACDragEvent ( null ) ;
  this.dragEvent.setDragger ( this ) ;
}  ;
DraggerClass.prototype.N_RESIZE = 1 ;
DraggerClass.prototype.NW_RESIZE = 12 ;
DraggerClass.prototype.W_RESIZE = 2 ;
DraggerClass.prototype.SW_RESIZE = 23 ;
DraggerClass.prototype.S_RESIZE = 3 ;
DraggerClass.prototype.E_RESIZE = 4 ;
DraggerClass.prototype.SE_RESIZE = 34 ;
DraggerClass.prototype.NE_RESIZE = 41 ;
DraggerClass.prototype.setDragArea = function ( insets )
{
  if ( insets ) this.dragArea = insets ;
};
DraggerClass.prototype.setDragInside = function ( state )
{
  this.dragInside = state ;
  if ( this.dragElement.parentNode )
  {
    var b = new TComponent ( this.dragElement.parentNode ).getBoundsOnPage() ;
//log ( b ) ;
    var browserWindowSize = TGui.getBrowserWindowSize() ;
    var da = new Insets ( b.y, b.x, b.y + b.height, b.x + b.width ) ;
//log ( da2 ) ;
//    this.dragArea = da ;
  }
};
DraggerClass.prototype.layoutChanged = function()
{
  for ( var i = 0 ; i < this.dndDropTargets.length ; i++ )
  {
    this.dndDropTargets[i].resized() ;
  }
  return true ;
};
DraggerClass.prototype.init = function()
{
  document.onmousemove = Dragger_drag ;
  document.onmouseup = Dragger_stop ;
};
DraggerClass.prototype.initDnDDropStates = function()
{
  this.dndDropTargetDropAcceptAction = 0 ;
  this.dndDropTargetRejectDrop = false ;
  this.dndDropTargetDropCompleteSuccess = false ;
  for ( var i = 0 ; i < this.dndDropTargets.length ; i++ )
  {
    var dt = this.dndDropTargets[i] ;
    dt.visibleOnScreen = true ;
    for ( var p = dt.getElement() ; p ; p = p.parentNode )
    {
      if ( p.nodeName == 'BODY' ) break ;
      if ( p.style.visibility == 'hidden' )
      {
        dt.visibleOnScreen = false ;
        break ;
      }
    }
  }
  
};
DraggerClass.prototype.initDnDDragStates = function()
{
  this.dndDropTargetDragAcceptAction = 0 ;
  this.dndDropTargetRejectDrag = false ;
};
DraggerClass.prototype.addDropTarget = function ( dndTarget )
{
  this.dndDropTargets.push ( dndTarget ) ;
};
DraggerClass.prototype.addDragSource = function ( dndSource )
{
  this.dndDragSources.push ( dndSource ) ;
};
DraggerClass.prototype.removeDropTarget = function ( dndTarget )
{
  for ( var i = 0 ; i < this.dndDropTargets.length ; i++ )
  {
    if ( dndTarget === this.dndDropTargets[i] )
    {
      this.dndDropTargets.splice ( i, 1 ) ;
      break ;
    }
  }
};
DraggerClass.prototype.removeDragSource = function ( dndSource )
{
  for ( var i = 0 ; i < this.dndDragSources.length ; i++ )
  {
    if ( dndSource === this.dndDragSources[i] )
    {
      this.dndDragSources.splice ( i, 1 ) ;
      break ;
    }
  }
};
DraggerClass.prototype.getDragObject = function ( dragType )
{
  var newDragObject = this.dndSource.getDragElement ( this.dragSourceEvent, dragType, this.dragElement ) ;
  if ( newDragObject === this.dragElement )
  {
  }
  else
  {
    this.dragElement = newDragObject ;
  }
};
DraggerClass.prototype.userActionChanged = function ( newUserAction )
{
  this.userAction = newUserAction ;
  if ( ! this.dndCurrentDropTarget )
  {
    this.getDragObject ( this.userAction ) ;
  }
  else
  if ( this.dndDropTargetRejectDrag )
  {
    this.getDragObject ( this.userAction | DnDConstants.REJECT ) ;
  }
  else
  {
    var mask = this.userAction & this.dndDropTargetDragAcceptAction ;
    if ( ! mask ) mask = this.userAction ;
    mask |= DnDConstants.ACCEPT ;
    this.getDragObject ( mask ) ;
  }
  if ( this.dndCurrentDropTarget )
  {
    this.dropTargetEvent.mouseXOnPage = this.mouseX ;
    this.dropTargetEvent.mouseYOnPage = this.mouseY ;
    this.dndCurrentDropTarget.userActionChanged ( this.dropTargetEvent ) ;
  }
};
DraggerClass.prototype.acceptDragByDropTarget = function ( dragOperation )
{
  if ( ! dragOperation ) dragOperation = DnDConstants.MOVE ;
  this.dndDropTargetDragAcceptAction = dragOperation ;
  this.dndDropTargetRejectDrag = false ;
  var mask = this.userAction & this.dndDropTargetDragAcceptAction ;
  if ( ! mask ) mask = this.userAction ;
  mask |= DnDConstants.ACCEPT ;
  this.getDragObject ( mask ) ;
};
DraggerClass.prototype.rejectDragByDropTarget = function()
{
  this.dndDropTargetRejectDrag = true ;
  this.getDragObject ( this.userAction | DnDConstants.REJECT ) ;
};
DraggerClass.prototype.acceptDropByDropTarget = function ( dropAction )
{
  this.dndDropTargetDropAcceptAction = dropAction ;
  this.dndDropTargetRejectDrop = false ;
};
DraggerClass.prototype.rejectDropByDropTarget = function()
{
  this.dndDropTargetRejectDrop = true ;
};
DraggerClass.prototype.dropCompleteByDropTarget = function ( success )
{
  this.dndDropTargetDropCompleteSuccess = success ;
};
DraggerClass.prototype.startDrag = function ( event, element, noDelay )
{
  if ( this.dragElement ) return ;
  if ( this.resizeComponent ) return ;
  this.dragInside = false ;
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  this.dragArea = new Insets ( 0, 0, browserWindowSize.height, browserWindowSize.width ) ;

  var ev = new TEvent ( event ) ;
  var hasHorizontalScrollbar = TGui.hasHorizontalScrollbar ( ev.getSource() ) ;
  var hasVerticalScrollbar = TGui.hasVerticalScrollbar ( ev.getSource() ) ;
  if ( hasHorizontalScrollbar || hasVerticalScrollbar )
  {
    var b = TGui.getBoundsOnPageOf ( ev.getSource() ) ;
    if ( hasVerticalScrollbar && ev.getX() >= b.x + b.width - 20 ) return ;
    if ( hasHorizontalScrollbar && ev.getY() >= b.y + b.height - 20 ) return ;
  }

  this.dragEvent._setEvent ( event ) ;
/*
  if ( element && element.jsPeer && element.jsPeer.dragStart )
  {
    this.dragEvent._setEvent ( event ) ;
    if ( ! element.jsPeer.dragStart ( this.dragEvent ) ) return ;
  }
*/
  this.active = true ;
  this.dragElement = element ;
  this.resizeComponent = null ;
  this.dragSplitbar = null ;
  this.mouseOffsetX = this.mouseX - this.dragElement.offsetLeft;
  this.mouseOffsetY = this.mouseY - this.dragElement.offsetTop;
  this.dragStartX = noDelay ? -1 : this.mouseX ;
  this.dragStartY = noDelay ? -1 : this.mouseY ;
  this.dndCurrentDropTarget = null ;
  this.dragStartPending = true ;

  if ( noDelay ) this.drag ( event, noDelay ) ;
};
DraggerClass.prototype.startSplitbarMove = function ( event, eSplitbar, horizontal )
{
  this.dragInside = false ;
  this.active = true ;
  this.dragElement = null ;
  this.resizeComponent = null ;
  this.dragSplitbar = eSplitbar ;
  this.dragSplitbarHorizontal = horizontal ? true : false ;
  this.mouseOffsetX = this.mouseX - this.dragSplitbar.offsetLeft;
  this.mouseOffsetY = this.mouseY - this.dragSplitbar.offsetTop;
  this.dndCurrentDropTarget = null ;
  if ( typeof ( this.dragSplitbar.style.MozUserSelect ) != 'undefined' )
  {
    this.dragSplitbar.style.MozUserSelect = "none" ;
    if ( this.dragSplitbar.eTop ) this.dragSplitbar.eTop.style.MozUserSelect = "none" ;
    if ( this.dragSplitbar.eBottom ) this.dragSplitbar.eBottom.style.MozUserSelect = "none" ;
  }
  else
  if ( typeof ( this.dragSplitbar.style.KhtmlUserSelect ) != 'undefined' )
  {
    this.dragSplitbar.style.KhtmlUserSelect = "none" ;
    if ( this.dragSplitbar.eTop ) this.dragSplitbar.eTop.style.KhtmlUserSelect = "none" ;
    if ( this.dragSplitbar.eBottom ) this.dragSplitbar.eBottom.style.KhtmlUserSelect = "none" ;
  }
  else
  if ( typeof ( opera ) != 'undefined' )
  {
    this.dragSplitbar.unselectable = 'on' ;
    if ( this.dragSplitbar.eTop ) this.dragSplitbar.eTop.unselectable = 'on' ;
    if ( this.dragSplitbar.eBottom ) this.dragSplitbar.eBottom.unselectable = 'on' ;
  }
  TGui.setSelectable ( false ) ;
};
DraggerClass.prototype.startResizeComponent = function ( event, component, what )
{
  this.dragInside = false ;
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  this.dragArea = new Insets ( 0, 0, browserWindowSize.height, browserWindowSize.width ) ;
  this.what = what ;
  this.dragElement = null ;
  if ( typeof ( component.resizeStart ) == 'function' )
  {
    component.resizeStart ( event ) ;
  }
  this.active = true ;
  this.dragElement = null ;
  this.resizeComponent = null ;
  this.resizeMinimumWidth = -1 ;
  this.resizeMinimumHeight = -1 ;
  if ( this.what == 0 )
  {
    this.dragElement = component.getDom() ;
    this.mouseOffsetX = this.mouseX - this.dragElement.offsetLeft;
    this.mouseOffsetY = this.mouseY - this.dragElement.offsetTop;
  }
  else
  {
    this.resizeComponent = component ;
    var loc = this.resizeComponent.getLocation() ;
    if ( typeof ( this.resizeComponent.getMinimumWidth ) == 'function' )
    {
      this.resizeMinimumWidth = this.resizeComponent.getMinimumWidth() ;
    }
    if ( typeof ( this.resizeComponent.getMinimumHeight ) == 'function' )
    {
      this.resizeMinimumHeight = this.resizeComponent.getMinimumHeight() ;
    }
    if ( this.resizeComponent.dom && typeof ( this.resizeComponent.dom.style.MozUserSelect ) != 'undefined' )
    {
      this.resizeComponent.dom.style.MozUserSelect = "none" ;
    }
    else
    if ( this.resizeComponent.dom && typeof ( this.resizeComponent.dom.style.KhtmlUserSelect ) != 'undefined' )
    {
      this.resizeComponent.dom.style.KhtmlUserSelect = "none" ;
    }
    else
    if ( this.resizeComponent.dom && typeof ( opera ) != 'undefined' )
    {
      this.resizeComponent.dom.unselectable = 'on' ;
    }
    this.mouseOffsetX = this.mouseX - loc.x ;
    this.mouseOffsetY = this.mouseY - loc.y ;
  }
  TGui.setSelectable ( false ) ;
};
DraggerClass.prototype.stop = function ( event )
{
  this.active = false ;
  if ( this.dndSource )
  {
    if ( this.dndSource.dom && typeof ( this.dndSource.dom.style.MozUserSelect ) != 'undefined' )
    {
      this.dndSource.dom.style.MozUserSelect = "" ;
    }
    else
    if ( this.dndSource.dom && typeof ( this.dndSource.dom.style.KhtmlUserSelect ) != 'undefined' )
    {
//      this.dndSource.dom.style.KhtmlUserSelect = "" ;
      document.body.style.KhtmlUserSelect = "" ;
    }
    else
    if ( this.dndSource.dom && typeof ( opera ) != 'undefined' )
    {
      this.dndSource.dom.unselectable = 'off' ;
    }
    if ( ! this.dndDragStartPending )
    {
      if ( this.dndCurrentDropTarget )
      {
        this.dropTargetDropEvent._setEvent ( event ) ;
        this.dropTargetDropEvent.mouseX = this.mouseX - this.dndCurrentDropTarget.left ;
        this.dropTargetDropEvent.mouseY = this.mouseY - this.dndCurrentDropTarget.top ;
        this.dropTargetDropEvent.mouseXOnPage = this.mouseX ;
        this.dropTargetDropEvent.mouseYOnPage = this.mouseY ;
        this.dndCurrentDropTarget.drop ( this.dropTargetDropEvent ) ;
      }
      this.dragSourceDropEvent.mouseXOnPage = this.mouseX ;
      this.dragSourceDropEvent.mouseYOnPage = this.mouseY ;
      this.dndSource.dragDropEnd ( this.dragSourceDropEvent ) ;
    }
  }
  else
  if ( ! this.dragStartPending )
  {
    if ( this.dragElement && this.dragElement.jsPeer && this.dragElement.jsPeer.dragEnd )
    {
      this.dragElement.jsPeer.dragEnd ( event ) ;
    }
    else
    if ( this.resizeComponent && this.resizeComponent.resizeEnd )
    {
      this.resizeComponent.resizeEnd ( event ) ;
    }
    if ( this.dragElement || this.resizeComponent )
    {
      this.layoutChanged() ;
    }
    if ( this.dragElement && typeof ( this.dragElement.style.MozUserSelect ) != 'undefined' )
    {
      this.dragElement.style.MozUserSelect = "" ;
    }
    else
    if ( this.dragElement && typeof ( this.dragElement.style.KhtmlUserSelect ) != 'undefined' )
    {
      this.dragElement.style.KhtmlUserSelect = "" ;
    }
    else
    if ( this.dragElement && typeof ( opera ) != 'undefined' )
    {
      this.dragElement.unselectable = 'off' ;
    }
    if ( this.resizeComponent && typeof ( this.resizeComponent.dom.style.MozUserSelect ) != 'undefined' )
    {
      this.resizeComponent.dom.style.MozUserSelect = "" ;
    }
    else
    if ( this.resizeComponent && typeof ( this.resizeComponent.dom.style.KhtmlUserSelect ) != 'undefined' )
    {
      this.resizeComponent.dom.style.KhtmlUserSelect = "" ;
    }
    else
    if ( this.resizeComponent && typeof ( opera ) != 'undefined' )
    {
      this.resizeComponent.dom.unselectable = 'off' ;
    }
  }
  if ( this.dragSplitbar )
  {
    if ( typeof ( this.dragSplitbar.style.MozUserSelect ) != 'undefined' )
    {
      this.dragSplitbar.style.MozUserSelect = "" ;
    }
    else
    if ( typeof ( this.dragSplitbar.style.KhtmlUserSelect ) != 'undefined' )
    {
      this.dragSplitbar.style.KhtmlUserSelect = "" ;
    }
    else
    if ( typeof ( opera ) != 'undefined' )
    {
      this.dragSplitbar.unselectable = 'off' ;
    }
  }
  TGui.setSelectable ( true ) ;
  this.dragStartPending = false ;
  this.dndDragStartPending = false ;

  this.dragElement = null ;
  this.resizeComponent = null ;
  this.dragSplitbar = null ;
//  TGui.flushEventListener ( document ) ;
  this.dndSource = null ;
  this.dndCurrentDropTarget = null ;
};
DraggerClass.prototype.drag = function ( event, immediately )
{
/*
  this.mouseX = document.all ? window.event.clientX : event.pageX;
  this.mouseY = document.all ? window.event.clientY : event.pageY;
*/

  if ( ! event ) event = window.event;
  this.mouseX = event.pageX
             || ( event.clientX + ( document.documentElement.scrollLeft
//                                  || document.body.scrollLeft
                                  )) ;
  this.mouseY = event.pageY
             || ( event.clientY + (  document.documentElement.scrollTop
//                                  || document.body.scrollTop
                                  ));
  if ( ! this.active )
  {
    this.mouseXOld  = this.mouseX ;
    this.mouseYOld  = this.mouseY ;
    return ;
  }
  if ( ! immediately )
  {
    if ( event.preventDefault )
    {
      event.preventDefault();
      event.stopPropagation();
    }
    else
    {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  }
  if ( this.active )
  {
    if ( this.dndDragStartPending )
    {
      if (  Math.abs ( this.mouseX - this.dragStartX ) >= this.dragWatermarkPixel
         || Math.abs ( this.mouseY - this.dragStartY ) >= this.dragWatermarkPixel
         )
      {
        this.dndDragStartPending = false ;
        if ( ! this.dndSource.dragStart ( this.dragSourceStartEvent ) )
        {
          this.stop() ;
          return ;
        }
        this.dragElement = this.dndSource.getDragElement ( this.dragSourceEvent, this.userAction & DnDConstants.COPY_OR_MOVE ) ;
        if ( this.dndSource.dom && typeof ( this.dndSource.dom.style.MozUserSelect ) != 'undefined' )
        {
          this.dndSource.dom.style.MozUserSelect = "none" ;
        }
        else
        if ( this.dndSource.dom && typeof ( this.dndSource.dom.style.KhtmlUserSelect ) != 'undefined' )
        {
//          this.dndSource.dom.style.KhtmlUserSelect = "none" ;
          document.body.style.KhtmlUserSelect = "none" ;
        }
        else
        if ( this.dndSource.dom && typeof ( opera ) != 'undefined' )
        {
          this.dndSource.dom.style.unselectable = true ;
          document.body.style.unselectable = true ;
          this.dndSource.dom.style.userSelect = 'none' ;
        }
        this.mouseOffsetX = this.mouseX - this.dragElement.offsetLeft;
        this.mouseOffsetY = this.mouseY - this.dragElement.offsetTop;
      }
      else
      {
        return ;
      }
    }
    if ( this.dragSplitbar )
    {
      if ( this.dragSplitbarHorizontal )
      {
        var y = this.mouseY - this.mouseOffsetY ;
        var dy = this.mouseY - this.mouseYOld ;

        var hTop = this.dragSplitbar.eTop.offsetHeight - TGui.getComputedTaraHeight ( this.dragSplitbar.eTop, 3 ) + dy ;
        var hBot = this.dragSplitbar.eBottom.offsetHeight - TGui.getComputedTaraHeight ( this.dragSplitbar.eBottom, 3 ) - dy ;
        if ( hTop < 10 || hBot < 10 )
        {
          this.mouseXOld  = this.mouseX ;
          this.mouseYOld  = this.mouseY ;
	  this.stop() ;
          return ;
        }

        var yTop = y + this.dragSplitbar.offsetHeight ;

        this.dragSplitbar.style.top = y + "px" ;
        this.dragSplitbar.eTop.style.height = hTop + "px" ;
        this.dragSplitbar.eBottom.style.top = yTop + "px" ;
        this.dragSplitbar.eBottom.style.height = hBot + "px" ;
        TGui.layoutConstraints ( this.dragSplitbar.eTop, true ) ;
        TGui.layoutConstraints ( this.dragSplitbar.eBottom, true ) ;
      }
      else
      {
        var x = this.mouseX - this.mouseOffsetX ;
        var dx = this.mouseX - this.mouseXOld ;

        var wLeft = this.dragSplitbar.eLeft.offsetWidth - TGui.getComputedTaraWidth ( this.dragSplitbar.eLeft, 3 ) + dx ;
        var dd = this.dragSplitbar.eRight.offsetWidth ;
        var wRight = dd - TGui.getComputedTaraWidth ( this.dragSplitbar.eRight, 3 ) - dx ;
        if ( wLeft < 20 || wRight < 20 )
        {
          this.mouseXOld  = this.mouseX ;
          this.mouseYOld  = this.mouseY ;
          return ;
        }

        var xLeft = x + this.dragSplitbar.offsetWidth ;

        this.dragSplitbar.style.left = x + "px" ;
        this.dragSplitbar.eLeft.style.width = wLeft + "px" ;
        this.dragSplitbar.eRight.style.left = xLeft + "px" ;
        this.dragSplitbar.eRight.style.width = wRight + "px" ;
        TGui.layoutConstraints ( this.dragSplitbar.eLeft, true ) ;
        TGui.layoutConstraints ( this.dragSplitbar.eRight, true ) ;
      }
    }
    else
    if ( this.dndSource )
    {
      this._dndMove( event ) ;
    }
    else
    if ( this.dragElement )
    {
      if ( this.dragStartPending )
      {
        if ( (  Math.abs ( this.mouseX - this.dragStartX ) >= this.dragWatermarkPixel
             || Math.abs ( this.mouseY - this.dragStartY ) >= this.dragWatermarkPixel
	     )
           || ( this.dragStartX < 0 && this.dragStartY < 0 )
           )
        {
          this.dragStartPending = false ;
          if ( this.dragElement && this.dragElement.jsPeer && this.dragElement.jsPeer.dragStart )
          {
            if ( ! this.dragElement.jsPeer.dragStart ( this.dragEvent ) )
            {
              this.stop() ;
              return ;
            }
          }
          if ( typeof ( this.dragElement.style.MozUserSelect ) != 'undefined' )
          {
            this.dragElement.style.MozUserSelect = "none" ;
          }
          else
          if ( typeof ( this.dragElement.style.KhtmlUserSelect ) != 'undefined' )
          {
            this.dragElement.style.KhtmlUserSelect = "none" ;
          }
          else
          if ( typeof ( opera ) != 'undefined' )
          {
            this.dragElement.unselectable = 'on' ;
          }
          this.mouseOffsetX = this.mouseX - this.dragElement.offsetLeft;
          this.mouseOffsetY = this.mouseY - this.dragElement.offsetTop;
          TGui.setSelectable ( false ) ;
        }
        else
        {
          return ;
        }
      }
      var x = this.mouseX -  this.mouseOffsetX ;
      if ( this.dragInside )
      {
        if ( x >= this.dragArea.left && x + this.dragElement.offsetWidth < this.dragArea.right )
        {
          this.dragElement.style.left = x + "px" ;
        }
        var y  = this.mouseY - this.mouseOffsetY ;
        if ( y >= this.dragArea.top && y + this.dragElement.offsetHeight < this.dragArea.bottom )
        {
          this.dragElement.style.top  = y + "px" ;
        }
      }
      else
      {
        if ( this.mouseX >= this.dragArea.left && this.mouseX < this.dragArea.right )
        {
          this.dragElement.style.left = x + "px" ;
        }
        var y  = this.mouseY - this.mouseOffsetY ;
        if ( this.mouseY >= this.dragArea.top && this.mouseY < this.dragArea.bottom )
        {
          this.dragElement.style.top  = y + "px" ;
        }
      }
    }
    else
    if ( this.resizeComponent )
    {
      var w = this.resizeComponent.dom.offsetWidth + ( this.mouseX - this.mouseXOld ) ;
      var h = this.resizeComponent.dom.offsetHeight + ( this.mouseY - this.mouseYOld ) ;
      w = Math.max ( w, Math.max ( 60, this.resizeMinimumWidth ) ) ;
      h = Math.max ( h, Math.max ( 60, this.resizeMinimumHeight ) ) ;


      if ( this.what == this.N_RESIZE )
      {
        h = this.resizeComponent.dom.offsetHeight - ( this.mouseY - this.mouseYOld ) ;
        h = Math.max ( h, 60 ) ;
        this.resizeComponent.setSize ( this.resizeComponent.dom.offsetWidth, h ) ;
        this.resizeComponent.dom.style.top = ( this.mouseY -  this.mouseOffsetY ) + "px" ;
      }
      else
      if ( this.what == this.NW_RESIZE )
      {
        h = this.resizeComponent.dom.offsetHeight - ( this.mouseY - this.mouseYOld ) ;
        h = Math.max ( h, 60 ) ;
        w = this.resizeComponent.dom.offsetWidth - ( this.mouseX - this.mouseXOld ) ;
        w = Math.max ( w, 60 ) ;
        this.resizeComponent.setSize ( w, h ) ;
        this.resizeComponent.dom.style.top = ( this.mouseY -  this.mouseOffsetY ) + "px" ;
        this.resizeComponent.dom.style.left = ( this.mouseX -  this.mouseOffsetX ) + "px" ;
      }
      else
      if ( this.what == this.W_RESIZE )
      {
        w = this.resizeComponent.dom.offsetWidth - ( this.mouseX - this.mouseXOld ) ;
        w = Math.max ( w, 60 ) ;
        this.resizeComponent.setSize ( w, this.resizeComponent.dom.offsetHeight ) ;
        this.resizeComponent.dom.style.left = ( this.mouseX -  this.mouseOffsetX ) + "px" ;
      }
      else
      if ( this.what == this.SW_RESIZE )
      {
        w = this.resizeComponent.dom.offsetWidth - ( this.mouseX - this.mouseXOld ) ;
        w = Math.max ( w, 60 ) ;
        this.resizeComponent.setSize ( w, h ) ;
        this.resizeComponent.dom.style.left = ( this.mouseX -  this.mouseOffsetX ) + "px" ;
      }
      else
      if ( this.what == this.S_RESIZE )
      {
        this.resizeComponent.setSize ( this.resizeComponent.dom.offsetWidth, h ) ;
      }
      else
      if ( this.what == this.E_RESIZE )
      {
        this.resizeComponent.setSize ( w, this.resizeComponent.dom.offsetHeight ) ;
      }
      else
      if ( this.what == this.SE_RESIZE )
      {
        this.resizeComponent.setSize ( w, h ) ;
      }
      else
      if ( this.what == this.NE_RESIZE )
      {
        h = this.resizeComponent.dom.offsetHeight - ( this.mouseY - this.mouseYOld ) ;
        h = Math.max ( h, 60 ) ;
        this.resizeComponent.setSize ( w, h ) ;
        this.resizeComponent.dom.style.top = ( this.mouseY -  this.mouseOffsetY ) + "px" ;
      }
if ( this.resizeComponent.resizing ) this.resizeComponent.resizing ( event ) ;
    }
  }
  this.mouseXOld  = this.mouseX ;
  this.mouseYOld  = this.mouseY ;
};
function Dragger_drag ( event )
{
  Dragger.drag ( event ) ;
}
function Dragger_stop ( event )
{
  Dragger.stop ( event ) ;
}
function Dragger_keyDown ( event )
{
  if ( !event ) event = window.event;
  var kc = event.keyCode ? event.keyCode : event.which ;
//log ( "kc down: " + kc ) ;
  if ( kc != 17 && kc != 16 ) return ;
  Dragger.pendingUserAction = 2 ;
  if ( ! Dragger.dndSource )
  {
    return ;
  }
  if ( Dragger.userAction == 2 ) return ;
  Dragger.userActionChanged ( 2 ) ;
}
function Dragger_keyUp ( event )
{
  if ( !event ) event = window.event;
  var kc = event.keyCode ? event.keyCode : event.which ;
//log ( "kc up: " + kc ) ;
  if ( kc != 17 && kc != 16 ) return ;
  Dragger.pendingUserAction = 1 ;
  if ( ! Dragger.dndSource )
  {
    return ;
  }
  if ( Dragger.userAction == 1 ) return ;
  Dragger.userActionChanged ( 1 ) ;
}

// ------------------------------------------------------------------
/**
 *  @constructor
 */
var ACThemeChooser = function()
{
};
ACThemeChooser.prototype =
{
  openWindow: function()
  {
    var windowId = "Window.Themes" ;
    var w = TWM.getWindow ( windowId ) ;
    if ( w ) return ;
    var x = TSys.getXml ( "themes/Themes.xml" ) ;
    if ( ! x ) return ;
    var xThemes = new TXml ( x ) ;
    w = new TWindow ( "Window.Themes" ) ;
    w.setId ( windowId ) ;
    w.create() ;
    w.setValues ( xThemes ) ;
    w.show() ;
  }
};
/**
 *  @constructor
 */
var TFunctionExecutor = function ( self, method, args )
{
  this.jsClassName = "TFunctionExecutor" ;
  this.argsArray = null ;
  var strOrig = null ;
  if ( typeof ( self ) == 'string' )
  {
    var str2 = self.trim() ;
    if ( self.indexOf ( "{" ) >= 0 )
    {
      if ( str2.startsWith ( "function" ) && str2.indexOf ( "(" ) > 0 && str2.charAt(str2.length-1) == "}" )
      {
        this.method = TSys.eval ( str2 ) ;
        this.self = null ;
        return ;
      }
      if ( str2.charAt ( 0 ) == "{" && str2.charAt ( str2.length - 1 ) == "}" )
      {
        this.object = TSys.eval ( str2 ) ;
        if ( this.object && typeof ( this.object._constructor_ ) == 'function' )
        {
          this.object._constructor_() ;
        }
        return ;
      }
    }
    if ( str2.startsWith ( "*." ) )
    {
      if ( method && typeof ( method ) == 'object' )
      {
        var p1 = str2.indexOf ( "(" ) ;
        var methodName = null ;
        if ( p1 > 0 ) methodName = str2.substring ( 2, p1 ) ;
        else          methodName = str2.substring ( 2 ) ;
        methodName = methodName.trim() ;
        var pagelet = null ;
        if ( method.jsClassName == "LayoutContext" || method.jsClassName == "TCreateHtmlContext" )
        {
          pagelet = method.getPagelet ( null, methodName ) ;
        }
        else
        if ( typeof ( method.isPagelet ) == "function" )
        {
          pagelet = method ;
        }
        if ( ! pagelet )
        {
          var estr = "TFunctionExecutor, pagelet for method not found: " + str2 ;
          TSys.log ( estr ) ;
          throw estr ;
        }
        var f = pagelet[methodName] ;
        if ( typeof ( f ) != 'function' )
        {
          var estr = "TFunctionExecutor, pagelet has no function: " + str2 + " of " + pagelet ;
          TSys.log ( estr ) ;
          throw estr ;
        }
        this.self = pagelet ;
        this.method = f ;
        this.argsArray = this._parseCommaList ( str2 ) ;
      }
      return ;
    }
    if ( str2.startsWith ( "new " ) && str2.indexOf ( "(" ) > 0 )
    {
      var c = str2 ;
      var p1 = c.indexOf ( "(" ) ;
      if ( p1 > 0 ) c = c.substring ( 0, p1 ).trim() ;
      c += "(" ;

      var a = this._parseCommaList ( str2 ) ;
      var fString = "function(" ;
      var first = true ;
      var aa = [] ;
      if ( a )
      {
        for ( var i = 0 ; i < a.length ; i++ )
        {
          if ( first ) first = false ;
          else
          {
            fString += "," ;
            c += "," ;
          }
          fString += "p" + aa.length ;
          c += "p" + aa.length ;
          aa.push ( a[i] ) ;
        }
      }
      if ( TSys.isArray ( method ) )
      {
        for ( var i = 0 ; i < method.length ; i++ )
        {
          if ( first ) first = false ;
          else
          {
            fString += "," ;
            c += "," ;
          }
          fString += "p" + aa.length ;
          c += "p" + aa.length ;
          aa.push ( method[i] ) ;
        }
      }
      c += ");" ;
      fString += "){ return " + c + "}" ;
      var func = TSys.eval ( fString ) ;
      this.object = func.apply ( func, aa ) ;
      if ( this.object && typeof ( this.object._constructor_ ) == 'function' )
      {
        this.object._constructor_() ;
      }
      return ;
    }
    strOrig = self ;
    var str = strOrig ;
    var parPos = str.indexOf ( "(" ) ;
    if ( parPos > 0 ) str = str.substring ( 0, parPos ) ;
    str = str.trim() ;
    var func = TSys.eval ( str ) ;
    if ( typeof ( func ) != 'function' )
    {
      self = null ;
    }
    else
    {
      var p1 = str.lastIndexOf ( "." ) ;
      if ( p1 > 0 )
      {
        var objName = str.substring ( 0, p1 ) ;
        var mthName = str.substring ( p1+1 ) ;
        var obj = TSys.eval ( objName ) ;
        if ( obj )
        {
          self = obj ;
          method = func ;
        }
        else
        {
          self = func ;
        }
      }
      else
      {
        self = func ;
      }
    }
    this.argsArray = this._parseCommaList ( strOrig ) ;
  }
  var a = null ;
  if ( typeof ( self ) == "function" && method != null && typeof ( method ) == 'object' )
  {
    this.self = method ;
    this.method = self ;
    if ( args )
    {
      if ( TSys.isArray ( args ) ) a = args ;
      else
      {
        a = TSys.toArray ( arguments ) ;
        a.splice ( 0, 2 ) ;
      }
    }
  }
  else
  if ( self != null && typeof ( self ) == "object" && typeof ( method ) == 'function' )
  {
    this.self = self ;
    this.method = method ;
    if ( args )
    {
      if ( TSys.isArray ( args ) ) a = args ;
      else
      {
        a = TSys.toArray ( arguments ) ;
        a.splice ( 0, 2 ) ;
      }
    }
  }
  else
  if ( typeof ( self ) == "function" )
  {
    this.self = null ;
    this.method = self ;
    if ( method )
    {
      if ( TSys.isArray ( method ) ) a = method ;
      else { a = TSys.toArray(arguments) ; a.splice ( 0, 2 ) ; }
    }
    else
    if ( args )
    {
      if ( TSys.isArray ( args ) ) a = args ;
      else { a = TSys.toArray(arguments) ; a.splice ( 0, 2 ) ; }
    }
  }
  else
  if ( typeof ( method ) == "function" )
  {
    this.self = null ;
    this.method = method ;
    if ( args )
    {
      if ( TSys.isArray ( args ) ) a = args ;
      else { a = TSys.toArray(arguments) ; a.splice ( 0, 2 ) ; }
    }
  }
  else
  {
    var estr = "TFunctionExecutor, self & method must be functions or self must be a function: " + strOrig ;
    TSys.logStackTrace ( estr ) ;
    throw estr ;
  }
  if ( a )
  {
    this.argsArray = a ;
  }
};
TFunctionExecutor.prototype.flush = function()
{
  this.self = null ;
  this.method = null ;
  if ( this.argsArray ) this.argsArray.length = 0 ;
  this.argsArray = undefined ;
  if ( this.object && typeof ( this.object.flush ) == 'function' )
  {
    this.object.flush() ;
  }
};
TFunctionExecutor.prototype.executeWithEvent = function ( event )
{
  if ( ! this.argsArray )
  {
    if ( TSys.showNativeErrors )
    {
      return this.execute ( event ) ;
    }
    if ( TSys.isIE() )
    {
      try
      {
        return this.execute ( event ) ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
      }
      return ;
    }
    return this.execute ( event ) ;
  }
  else
  {
    var aa = [] ;
    var eventPushed = false ;
    for ( var k = 0 ; k < this.argsArray.length ; k++ )
    {
      var str = this.argsArray[k] ;
      if ( typeof ( str ) == 'string' )
      {
        if ( str == "event" )
        {
          aa.push ( event ) ;
          eventPushed = true ;
        }
        else
        if ( str.indexOf ( "{" ) >= 0 )
        {
          var str2 = str.trim() ;
          if ( str2.charAt ( 0 ) == '{' && str2.charAt ( str2.length - 1 ) == '}' )
          {
            var o = TSys.eval ( str ) ;
            if ( typeof ( o._initialize_ ) == 'function' )
            {
              o._initialize_(event) ;
            }
            aa.push ( o ) ;
          }
          else
          {
            aa.push ( str ) ;
          }
        }
        else
        {
          aa.push ( str ) ;
        }
      }
      else
      {
        aa.push ( str ) ;
      }
    }
    if ( ! eventPushed ) aa.push ( event ) ;
    if ( TSys.showNativeErrors )
    {
      return this.execute ( aa ) ;
    }
    if ( TSys.isIE() )
    {
      try
      {
        return this.execute ( aa ) ;
      }
      catch ( exc )
      {
        TSys.log ( exc ) ;
      }
      return ;
    }
    return this.execute ( aa ) ;
  }
};
TFunctionExecutor.prototype.execute = function ( argumentArray )
{
  if ( ! this.method && ! this.object ) return ;
  if ( ! argumentArray )
  {
    argumentArray = this.argsArray ;
  }
  else
  if ( ! TSys.isArray ( argumentArray ) )
  {
    argumentArray = [ argumentArray ] ;
  }
  if ( this.object )
  {
    if ( ! this.object.isInitialized )
    {
      if ( typeof ( this.object._initialize_ ) == 'function' )
      {
        if ( argumentArray ) this.object._initialize_.apply(this.object,argumentArray) ;
        else                 this.object._initialize_.apply(this.object) ;
      }
      this.object.isInitialized = true ;
    }
    if ( typeof ( this.object.execute ) == 'function' )
    {
      if ( ! argumentArray ) return this.object.execute.apply ( this.object ) ;
      return this.object.execute.apply ( this.object, argumentArray ) ;
    }
    return ;
  }
  if ( this.self )
  {
    if ( ! argumentArray ) return this.method.apply ( this.self ) ;
    return this.method.apply ( this.self, argumentArray ) ;
  }
  else
  {
    if ( ! argumentArray ) return this.method.apply ( this.method ) ;
    return this.method.apply ( this.method, argumentArray ) ;
  }
};
TFunctionExecutor.prototype._parseCommaList = function ( str )
{
//log ( "---------------------------------" ) ;
//log ( "str: " + str ) ;
  var aa= [] ;
  var p1 = str.indexOf ( "(" ) ;
  if ( p1 < 0 ) return null ;
  var p2 = str.lastIndexOf ( ")" ) ;
  if ( p2 < 0 ) return null ;
  if ( p2 <= p1 ) return null ;
  if ( p1 + 1 == p2 ) return null ;
  str = str.substring ( p1 + 1, p2 ).trim() ;
  if ( ! str ) return null ;

  var t = null ;
  var lastWasBackSlash = false ;
  var lastWasComma = false ;
  for ( var i = 0 ; i < str.length ; i++ )
  {
    if ( str.charAt ( i ) == '\\' )
    {
      if ( lastWasBackSlash ) t += '\\' ;
      lastWasBackSlash = true ;
      continue ;
    }
    if ( ( str.charAt ( i ) == '"' || str.charAt ( i ) == "'" ) && i+1 < str.length )
    {
      var q = str.charAt ( i ) ;
      if ( lastWasBackSlash )
      {
        t += q ;
        continue ;
      }
//      if ( t === null ) t = "" ;
      t = "" ;
      lastWasComma = false ;
      lastWasBackSlash = false ;
      for ( i = i+1 ; i < str.length ; i++ )
      {
        if ( str.charAt ( i ) == '\\' )
        {
          if ( lastWasBackSlash ) t += '\\' ;
          lastWasBackSlash = true ;
          continue ;
        }
        if ( str.charAt ( i ) == q )
        {
          if ( lastWasBackSlash )
          {
            t += q ;
            lastWasBackSlash = false ;
            continue ;
          }
          break ;
        }
        t += str.charAt ( i ) ;
      }
      aa.push ( t ) ;
      t = null ;
      continue ;
    }
    if ( str.charAt ( i ) == ',' )
    {
      if ( lastWasBackSlash )
      {
        if ( t === null ) t = "" ;
        t += '\\' ;
        t += ',' ;
        lastWasBackSlash = false ;
        continue ;
      }
      if ( t !== null )
      {
        t = t.trim() ;
        if ( t == 'event' ) {}
	else
        if ( t == 'null' ) { t = null ; }
	else
        if ( t == 'true' ) { t = true ; }
	else
        if ( t == 'false' ) { t = false ; }
	else
        {
          var d = parseFloat ( t ) ;
	  if ( isFinite ( d ) && ! isNaN ( d ) ) t = d ;
	}
        aa.push ( t ) ;
      }
      else
      if ( lastWasComma ) aa.push ( "" ) ;
      else
      if ( i == 0 ) aa.push ( "" ) ;
      t = null ;
      lastWasComma = true ;
      continue ;
    }
    if ( lastWasBackSlash ) t += '\\' ;
    if ( t === null ) t = str.charAt ( i ) ;
    else              t += str.charAt ( i ) ;
    lastWasComma = false ;
  }
  if ( t !== null )
  {
    t = t.trim() ;
    if ( t == 'event' ) {}
    else
    if ( t == 'null' ) { t = null ; }
    else
    if ( t == 'true' ) { t = true ; }
    else
    if ( t == 'false' ) { t = false ; }
    else
    {
      var d = parseFloat ( t ) ;
      if ( isFinite ( d ) && ! isNaN ( d ) ) t = d ;
    }
    aa.push ( t ) ;
  }
  else
  if ( lastWasComma ) aa.push ( "" ) ;
  return aa ;
};
TFunctionExecutor.prototype._getArgsArray = function ( str )
{
  var aa = [] ;
  var p1 = str.indexOf ( "(" ) ;
  if ( p1 < 0 ) return null ;
  var p2 = str.lastIndexOf ( ")" ) ;
  if ( p2 < 0 ) return null ;
  if ( p2 <= p1 ) return null ;
  if ( p1 + 1 == p2 ) return null ;
  str = str.substring ( p1 + 1, p2 ).trim() ;
  if ( ! str ) return null ;
  if ( str.indexOf ( "," ) < 0 )
  {
    if ( str.charAt ( 0 ) == '"' )
    {
      var p = str.lastIndexOf ( '"' ) ;
      if ( p > 0 && p == str.length - 1 )
      {
        aa.push ( str.substring ( 1, p ) ) ;
        return aa ;
      }
    }
    if ( str.charAt ( 0 ) == "'" )
    {
      var p = str.lastIndexOf ( "'" ) ;
      if ( p > 0 && p == str.length - 1 )
      {
        aa.push ( str.substring ( 1, p ) ) ;
        return aa ;
      }
    }
    aa.push ( str ) ;
    return aa ;
  }
  var a = str.split ( "," ) ;
  for ( var k = 0 ; k < a.length ; k++ )
  {
    a[k] = a[k].trim() ;
    if ( a[k] == "event" )
    {
      aa.push ( a[k] ) ;
      continue ;
    }
    if ( a[k] == "''" || a[k] == '""' )
    {
      aa.push ( "" ) ;
      continue ;
    }
    if ( a[k].charAt ( 0 ) == '"' )
    {
      var p = a[k].lastIndexOf ( '"' ) ;
      if ( p > 0 && p == a[k].length - 1 )
      {
        aa.push ( a[k].substring ( 1, p ) ) ;
        continue ;
      }
    }
    else
    if ( a[k].charAt ( 0 ) == "'" )
    {
      var p = a[k].lastIndexOf ( "'" ) ;
      if ( p > 0 && p == a[k].length - 1 )
      {
        aa.push ( a[k].substring ( 1, p ) ) ;
        continue ;
      }
    }
    aa.push ( a[k] ) ;
  }
  return aa ;
} ;
TSysClass.prototype.loadLib = function ( name, attributes )
{
  name = "lib/" + name + "/Style.xml" ;
  var x = new TXml ( this.getAxl ( name, attributes ) ) ;
  var str = x.getContent ( "Script" ) ;
  str = str.trim() ;
  if ( str.charAt ( 0 ) == "{" && str.charAt ( str.length - 1 ) == "}" )
  {
    var script = TSys.eval ( str ) ;
    if ( typeof ( script._constructor_ ) == 'function' )
    {
      script._constructor_() ;
    }
    if ( typeof ( script._initialize_ ) == 'function' )
    {
      script._initialize_() ;
    }
  }
  var xCss = x.getXml ( "Css" ) ;
  if ( xCss )
  {
    var cssName = xCss.getContent() ;
    if ( cssName ) Tango.loadCss ( cssName ) ;
  }
  var axl = x.getXml ( "Axl" ) ;
  if ( axl )
  {
    var en = null ;
    var xDefinitions = axl.getXml ( "Definitions" ) ;
    if ( xDefinitions )
    {
      en = xDefinitions.getEnum ( "Define" ) ;
    }
    else
    {
      en = axl.getEnum ( "Define" ) ;
    }
    while ( en.hasNext() )
    {
      var xDefine = en.nextXml() ;
      var tag = xDefine.getAttribute ( "tag" ) ;
      if ( tag )
      {
        new TagFactory ( xDefine.getDom() ) ;
      }
    }
  }
};
TSysClass.prototype.getScript = function ( scriptName )
{
  if ( ! scriptName.endsWith ( ".js" ) )
  {
    scriptName += ".js" ;
  }
  var HTTP = TSys.httpGet ( scriptName ) ;
  if ( HTTP.status != 200 )
  {
//    TSys.throwHttpStatusException ( HTTP ) ;
    return ;
  }
  return HTTP.responseText ;
};
TSysClass.prototype.getUserXml = function ( name )
{
  if ( ! name ) throw "TSys.getUserXml: Missing 'name' parameter." ;
  var url = TSys.getDataFactoryUrl()+"&action=GetUserXml&file=" + name ;
  return new TXml ( TSys.getXml ( url ) ) ;
} ;
TSysClass.prototype.saveUserXml = function ( name, xml )
{
  if ( ! name ) throw "TSys.saveUserXml: Missing 'name' parameter." ;
  if ( ! xml ) throw "TSys.saveUserXml: Missing 'xml' parameter." ;
  var url = this.getDataFactoryUrl()+"&action=SaveUserXml&file=" + name ;
  return this.httpPost ( url, String ( xml ), function ( HTTP ) { } ) ;
} ;
TSysClass.prototype.downloadGeneratedDocumentFromTable = function ( str, format )
{
  if ( format != "xls" && format != "csv" ) format = "xls" ;
  str = str.replace ( /<BR>/g, "" ).replace ( /<br>/g, "" ) ;
  var url = this.getDataFactoryUrl()+"&action=GeteneratedDocumentFromTable&format=" + format ;
  var HTTP = TSys.httpPost ( url, str ) ;
  var t = HTTP.responseText ;
  var nuUrl =  this.getDataFactoryUrl() + "&action=RetrieveCachedDocument&key=" + t ;
  window.open( nuUrl, "", "menubar=yes,toolbar=yes,scrollbars=yes,locationbar=yes,resizable=yes,dependent=yes" ) ;
} ;
TSysClass.prototype.periodicalToucherStart = function()
{
  var url = this.getMainServletName()+"?application="+this.getApplicationName()+"&action=TouchUser" ;
  if ( ! window.Worker  )
  {
    this._periodicalToucherStart() ;
    return ;
  }
  var w = this.getWebToucher() ;
  w.postMessage ( { cmd:"start", millis: this.periodicalToucherTimeoutMillis, url: url } ) ;
};
TSysClass.prototype.periodicalToucherStop = function()
{
  if ( ! window.Worker  )
  {
    this._periodicalToucherStop() ;
    return ;
  }
  var w = this.getWebToucher() ;
  w.postMessage ( { cmd:"stop" } ) ;
  w.terminate() ;
};
TSysClass.prototype.errorFromWebToucher = function ( event )
{
  log ( "------ error -------------------" ) ;
  log ( "event.message=" + event.message ) ;
  log ( "event.filename=" + event.filename ) ;
  log ( "event.lineno=" + event.lineno ) ;
};
TSysClass.prototype.msgFromWebToucher = function ( event )
{
  var p = event.data ;
  if ( p && typeof ( p ) == 'object' )
  {
    if ( p.cmd == "logout" )
    {
      TSys.logout() ;
    }
  }
  else
  {
    log ( p  ) ;
  }
};
TSysClass.prototype.getWebToucher = function()
{
  if ( this._WebToucher ) return this._WebToucher ;
  this._WebToucher = new Worker ( "WebToucher.js" ) ;
  this._WebToucher.onerror = this.errorFromWebToucher.bind ( this ) ;
  this._WebToucher.onmessage = this.msgFromWebToucher.bind ( this ) ;
  return this._WebToucher ;
} ;
TSysClass.prototype.logStackTrace = function ( text )
{
  if ( typeof Error === 'undefined' ) return text ;
  var e ;
  if ( typeof text === 'string' )
  {
    e = new Error ( text ) ;
  }
  else
  if ( text instanceof Error )
  {
    e = text ;
  }
  else
  {
    e = new Error ( String ( text ) ) ;
  }
  var l = this.getStackTrace ( e, 0 ) ;
  log ( l ) ;
};
TSysClass.prototype.getStackTrace = function ( e, i0 )
{
  if ( ! e || !e.stack ) return "" + e ;
  var lines = e.stack.split ("\n") ;
/*
Firefox:
[0]=ACSSingletonClass.prototype.doChangeParameter@http://wevli077.de.corp.danet.com:17000/vgecb/ACSHandler.js:982:9
[1]=TFunctionExecutor.prototype.execute@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14475:5
[2]=TFunctionExecutor.prototype.executeWithEvent@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14378:5
[3]=TGlobalEventHandlerClass.prototype.tryShortcut@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:12109:7
[4]=TGlobalEventHandlerClass.prototype.keyup@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:11968:5
[5]=TGlobalEventHandler_keyup@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:12250:49
[6]=

Opera:
[0]=<anonymous function: ACSSingletonClass.prototype.doChangeParameter>([arguments not available])@http://wevli077.de.corp.danet.com:17000/vgecb/ACSHandler.js:982
[1]=<anonymous function: TFunctionExecutor.prototype.execute>([arguments not available])@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:0
[2]=<anonymous function: TFunctionExecutor.prototype.executeWithEvent>([arguments not available])@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14378
[3]=<anonymous function: TGuiClass.prototype.mouseClicked>([arguments not available])@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:10214
[4]=<anonymous function: Function.prototype.bindAsEventListener>([arguments not available])@http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:0

Explorer:
[0]=ReferenceError: "scenario" ist undefiniert
[1]=   at ACSSingletonClass.prototype.doChangeParameter (http://wevli077.de.corp.danet.com:17000/vgecb/ACSHandler.js:982:5)
[2]=   at TFunctionExecutor.prototype.execute (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14475:5)
[3]=   at TFunctionExecutor.prototype.executeWithEvent (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14378:5)
[4]=   at TGuiClass.prototype.mouseClicked (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:10214:3)
[5]=   at Anonymous function (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:15295:7)

Chrome:
[0]=ReferenceError: scenario is not defined
[1]=    at ACSSingletonClass.doChangeParameter (http://wevli077.de.corp.danet.com:17000/vgecb/ACSHandler.js:982:63)
[2]=    at TFunctionExecutor.execute (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14475:24)
[3]=    at TFunctionExecutor.executeWithEvent (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:14378:17)
[4]=    at TGuiClass.mouseClicked (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:10214:17)
[5]=    at HTMLButtonElement.<anonymous> (http://wevli077.de.corp.danet.com:17000/vgecb/TSystem.js:15295:21)
 */
  var nuLines = [] ;
  if ( ! i0 ) i0 = 0 ;
  if ( lines[0].indexOf ( "http" ) > 0 )
  {
    nuLines.push ( "" + e ) ;
  }
  for ( var i = i0 ; i < lines.length ; i++ )
  {
    var line = lines[i] ;
    line = line.trim() ;
    // if ( line.indexOf ( "at " ) === 0 ) line = line.substring ( 3 ) ;
    if ( line.indexOf ( "<anonymous function: " ) === 0 )
    {
      line = line.substring ( "<anonymous function: ".length ) ;
      line = line.trim() ;
    }
    var p1 = line.indexOf ( "http" ) ;
    if ( p1 > 0 )
    {
      var p2 = line.lastIndexOf ( "/" ) ;
      if ( p2 > 0 )
      {
        line = line.substring ( 0, p1 ) + line.substring ( p2 + 1 ) ;
      }
    }
    var p1 = line.indexOf ( "?" ) ;
    if ( p1 > 0 )
    {
      var p2 = line.indexOf ( ":", p1 ) ;
      if ( p2 > 0 )
      {
        line = line.substring ( 0, p1 ) + line.substring ( p2 ) ;
      }
    }
    nuLines.push ( line ) ;
  }
  return nuLines.join ( "\n" ) ;
};

var TSys = new TSysClass() ;
// ------------------------------------------------------------------

var Dragger = null ;
var TGui = null ;
var TMenu = null ;
var _mf = function(e)
{
  var ev = new TEvent ( e ) ;
  var p = ev.getPeer() ;
  if ( p instanceof MenuItem ) return false ;
  if ( p instanceof MenuPane ) return false ;
  if ( p && p.popupMenu ) return false ;
  return true ;
};
document.oncontextmenu = _mf ;
//document.ondragstart = new Function("return false");
Dragger = new DraggerClass() ;
Dragger.init() ;
TGui = new TGuiClass() ;
TGui.addEventListenerCache(window,'unload',TGui.unload);
TGui.addEventListenerCache(document,'mousedown',TGlobalEventHandler_mousedown);
TGui.addEventListenerCache(document,'mouseup',TGlobalEventHandler_mouseup);
TGui.addEventListenerCache(document,'keydown',TGlobalEventHandler_keydown);
TGui.addEventListenerCache(document,'keyup',TGlobalEventHandler_keyup);
TGui.addEventListenerCache(document,'keypress',TGlobalEventHandler_keypress);
TGui.addEventListenerCache(document,'keyup',Dragger_keyUp);
TGui.addEventListenerCache(document,'keydown',Dragger_keyDown);
if ( ! String.prototype.startsWith )
{
  String.prototype.startsWith = function ( needle )
  {
    if ( ! needle ) return false ;
    return this.indexOf ( needle ) == 0 ;
  } ;
}
if ( ! String.prototype.endsWith )
{
  String.prototype.endsWith = function ( needle )
  {
    if ( ! needle ) return false ;
    var pos = this.indexOf ( needle ) ;
    if ( pos < 0 ) return false ;
    if ( this.length - needle.length == pos ) return true ;
    return false ;
  };
}
  String.prototype.trim = function()
  {
    return this.replace (/^\s+|\s+$/g,"") ;
  } ;
  String.prototype.ltrim = function()
  {
    return this.replace(/^\s+/,"");
  } ;
  String.prototype.rtrim = function()
  {
    return this.replace(/\s+$/,"");
  } ;
  String.prototype.toFunction = function()
  {
    var str = this ;
    var pos = str.indexOf ( "(" ) ;
    if ( pos > 0 ) str = str.substring ( 0, pos ) ;
    str = str.trim() ;
    var func = eval ( str ) ;
    if ( typeof ( func ) == 'function' ) return func ;
    return null ;
  } ;
  String.prototype.camelize = function()
  {    
     var oStringList = this.split('-');    
     if (oStringList.length == 1) return oStringList[0];    
             
     var camelizedString = this.indexOf('-') == 0    
     ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)     
     : oStringList[0];    
             
     for (var i = 1, len = oStringList.length; i < len; i++) {    
        var s = oStringList[i];    
        camelizedString += s.charAt(0).toUpperCase() + s.substring(1);    
     }    
     return camelizedString;    
  } ;
String.prototype.sprintf = function ()
{
  StringFormatter.fstring = this.toString() ;
  return StringFormatterClass.prototype.sprintf.apply ( StringFormatter, arguments ) ;
};
StringFormatterClass = function()
{
  var thiz = this ;
  this.converters = [] ;
  this.converters['c'] = function(flags,width,precision,arg) { 
      if (typeof(arg) == 'number') return String.fromCharCode(arg);
      if (typeof(arg) == 'string') return arg.charAt(0);
      return '';
  } ;
  this.converters['d'] = function(flags,width,precision,arg) { 
      return thiz.converters['i'](flags,width,precision,arg); 
  } ;
  this.converters['u'] = function(flags,width,precision,arg) { 
      return thiz.converters['i'](flags,width,precision,Math.abs(arg)); 
  } ;
  this.converters['i'] =  function(flags,width,precision,arg) {
      var iPrecision=parseInt(precision);
      var rs = ((Math.abs(arg)).toString().split('.'))[0];
      if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
      return thiz.processFlags(flags,width,rs,arg); 
  } ;
  this.converters['E'] = function(flags,width,precision,arg) {
      return (thiz.converters['e'](flags,width,precision,arg)).toUpperCase();
  } ;
  this.converters['e'] = function(flags,width,precision,arg) {
      iPrecision = parseInt(precision);
      if(isNaN(iPrecision)) iPrecision = 6;
      var rs = (Math.abs(arg)).toExponential(iPrecision);
      if(rs.indexOf('.')<0 && flags.indexOf('#')>=0) rs = rs.replace(/^(.*)(e.*)$/,'$1.$2');
      return thiz.processFlags(flags,width,rs,arg);        
  } ;
  this.converters['f'] = function(flags,width,precision,arg) { 
      iPrecision = parseInt(precision);
      if(isNaN(iPrecision)) iPrecision = 6;
      var rs = (Math.abs(arg)).toFixed(iPrecision);
      if(rs.indexOf('.')<0 && flags.indexOf('#')>=0)
      {
        rs = rs + '.';
      }
      var str = thiz.processFlags(flags,width,rs,arg);
      return str ;
  } ;
  this.converters['G'] = function(flags,width,precision,arg) { 
      return (thiz.converters['g'](flags,width,precision,arg)).toUpperCase();
  } ;
  this.converters['g'] = function(flags,width,precision,arg) {
      var iPrecision = parseInt(precision);
      var absArg = Math.abs(arg);
      var rse = absArg.toExponential();
      var rsf = absArg.toFixed(6);
      if(!isNaN(iPrecision)) { 
          var rsep = absArg.toExponential(iPrecision);
          rse = rsep.length < rse.length ? rsep : rse;
          var rsfp = absArg.toFixed(iPrecision);
          rsf = rsfp.length < rsf.length ? rsfp : rsf;
      }
      if(rse.indexOf('.')<0 && flags.indexOf('#')>=0) rse = rse.replace(/^(.*)(e.*)$/,'$1.$2');
      if(rsf.indexOf('.')<0 && flags.indexOf('#')>=0) rsf = rsf + '.';
      var rs = rse.length<rsf.length ? rse : rsf;
      return thiz.processFlags(flags,width,rs,arg);        
  }   ;
  this.converters['o'] = function(flags,width,precision,arg) { 
      var iPrecision=parseInt(precision);
      var rs = Math.round(Math.abs(arg)).toString(8);
      if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
      if(flags.indexOf('#')>=0) rs='0'+rs;
      return thiz.processFlags(flags,width,rs,arg); 
  } ;
  this.converters['X'] = function(flags,width,precision,arg) { 
      return (thiz.converters['x'](flags,width,precision,arg)).toUpperCase();
  } ;
  this.converters['x'] = function(flags,width,precision,arg) { 
      var iPrecision=parseInt(precision);
      arg = Math.abs(arg);
      var rs = Math.round(arg).toString(16);
      if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
      if(flags.indexOf('#')>=0) rs='0x'+rs;
      return thiz.processFlags(flags,width,rs,arg); 
  } ;
  this.converters['s'] = function(flags,width,precision,arg) { 
      var iPrecision=parseInt(precision);
      var rs = arg;
      if(rs.length > iPrecision) rs = rs.substring(0,iPrecision);
      return thiz.processFlags(flags,width,rs,0);
  } ;
};
StringFormatterClass.prototype =
{
  pad: function(str,ch,len)
  {
    var ps='';
    for(var i=0; i<Math.abs(len); i++) ps+=ch;
    return len>0?str+ps:ps+str;
  },
  pn: function(flags,arg,rs)
  {
    if(arg>=0)
    { 
      if(flags.indexOf(' ')>=0) rs = ' ' + rs;
      else if(flags.indexOf('+')>=0) rs = '+' + rs;
    }
    else
      rs = '-' + rs;
    return rs;
  },
  processFlags: function(flags,width,rs,arg)
  { 
    var iWidth = parseInt(width,10);
    if ( width.charAt ( 0 ) == '0' )
    {
      var ec=0;
      if(flags.indexOf(' ')>=0 || flags.indexOf('+')>=0) ec++;
      if(rs.length<(iWidth-ec)) rs = this.pad(rs,'0',rs.length-(iWidth-ec));
      return this.pn(flags,arg,rs);
    }
    rs = this.pn(flags,arg,rs);
    if(rs.length<iWidth) {
      if(flags.indexOf('-')<0) rs = this.pad(rs,' ',rs.length-iWidth);
      else rs = this.pad(rs,' ',iWidth - rs.length);
    }    
    return rs;
  },
  sprintf: function()
  {
    var fstring = this.fstring ;
    var farr = fstring.split('%');
    var retstr = farr[0];
    var fpRE = /^([-+ #']*)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;

    var loc = null ;
    if ( this.locale instanceof Locale )
    {
      loc = this.locale ;
    }
    else
    {
      loc = TSys.getLocale() ;
    }
    var ds = loc.getMonetaryDecimalSeparator() ;
    var gs = loc.getGroupingSeparator() ;
    for(var i = 1; i<farr.length; i++)
    { 
      fps=fpRE.exec(farr[i]);
      if(!fps) continue;
      if(arguments[i-1]!=null)
      {
        var t = this.converters[fps[4]](fps[1],fps[2],fps[3],arguments[i-1]);
        if ( fps[1] == "'" )
        {
					var sign = t.substring ( 0, 1 ) ;
					if ( sign == "+" || sign == "-" )
					{
						t = t.substring ( 1 ) ;
					}
					else
					{
					  sign = "" ;
					}
          var pos = t.lastIndexOf ( '.' ) ;
          var pre = t ;
          var post = "" ;
          if ( pos > 0 )
          {
            pre = t.substring ( 0, pos ) ;
            if ( pos < t.length - 1 ) post = t.substring ( pos + 1 ) ;
          }
          if ( pre.length > 6 )
          {
            pre = pre.substring ( 0, pre.length - 6 ) + gs + pre.substring ( pre.length - 6, pre.length - 3 ) + gs + pre.substring ( pre.length - 3 ) ;
          }
          else
          if ( pre.length > 3 )
          {
            pre = pre.substring ( 0, pre.length - 3 ) + gs + pre.substring ( pre.length - 3 ) ;
          }
          if ( fps[3] == "0" ) t = pre ;
          else                 t = pre + ds + post ;
					if ( sign ) t = sign + t ;
        }
        else
        {
          if ( ds != '.' ) t = t.replace ( '.', ds ) ;
        }
        retstr += t ;
      }
    }
    return retstr;
  }
};
StringFormatter = new StringFormatterClass() ;
  Number.prototype.roundTo = function ( n )
  {
    n = Math.floor ( n ) ;
    if ( n == 0 ) return Math.round ( this ) ;
    return Math.round(this*Math.pow(10,n))/Math.pow(10,n);
  };
  Number.prototype.commercialRoundTo = function ( n )
  {
    n = Math.floor ( n ) ;
    var v = this ;
    if ( this < 0 ) v = -1 * v ;
    if ( n == 0 )
    {
      var r = Math.round ( v ) ;
      return this < 0 ? -r : r ;
    }
    var r = Math.round(v*Math.pow(10,n))/Math.pow(10,n);
    return this < 0 ? -r : r ;
  };
/*
  Number.addSeparators = function(val) {
    return val.reverse().replace(/(\d{3})/g, "$1,").reverse().replace(/^(-)?,/, "$1");
  } ;
  String.prototype.reverse = function() {
    var res = "";
    for (var i = this.length; i > 0; --i) {
        res += this.charAt(i - 1);
    }
    return res;
  } ;
*/
if ( ! Array.prototype.shift )
{
  Array.prototype.shift = function()
  {
    var result = this[0];
    for (var i = 0; i < this.length - 1; i++)
      this[i] = this[i + 1];
    this.length--;
    return result;
  } ;
}
if (!Array.prototype.push)
{
  Array.prototype.push = function()
  {
    for(var i=0;i<arguments.length;i++)
      this[this.length]=arguments[i];
    return this.length;
  } ;
}
if (!Array.prototype.pop)
{
  Array.prototype.pop = function()
  {
    lastElement = this[this.length-1];
    this.length = Math.max(this.length-1,0);
    return lastElement;
  } ;
}
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function indexOf(element,index)
  {
    var length = this.length ;
    if ( typeof ( index ) != 'number' )
    {
      index = parseInt ( index ) ;
      if ( isNaN ( index ) ) index = 0 ;
    }
    if ( index < 0 ) index = length + index ;
    if ( index < 0 ) index = 0 ;
    if ( typeof ( element ) == 'string' || typeof ( element ) == 'number' || typeof ( element ) == 'boolean' )
    {
      for ( var i = index ; i < length ; i++ )
      {
       if ( this[i] == element ) return i ;
      }
      return -1 ;
    }
    for ( var i = index ; i < length ; i++ )
    {
      if ( this[i] === element ) return i ;
    }
    return -1 ;
  } ;
}
if (!Array.prototype.remove)
{
  Array.prototype.remove = function (element)
  {
    var length = this.length ;
    if ( typeof ( element ) == 'number' )
    {
      var index = Math.floor ( element ) ;
      if ( index < 0 ) return false ;
      if ( index >= length ) return false ;
      this.splice ( index, 1 ) ;
      return true ;
    }
    if ( typeof ( element ) == 'string' || typeof ( element ) == 'number' || typeof ( element ) == 'boolean' )
    {
      for ( var i = 0 ; i < length ; i++ )
      {
        if ( this[i] == element )
        {
          this.splice ( i, 1 ) ;
          return true ;
	}
      }
      return false ;
    }
    for ( var i = 0 ; i < length ; i++ )
    {
      if ( this[i] === element )
      {
        this.splice ( i, 1 ) ;
        return true ;
      }
    }
    return false ;
  } ;
}
Function.prototype.bindAsEventListener = function(object)
{
  var method = this, args = TSys.toArray(arguments), object = args.shift();
  args.splice ( 0, 0, null ) ;
  return function(event) {
    var _args = args ;
    _args[0] = event || window.event ;
    return method.apply(object, _args);
  };
};
if ( Function.prototype.bind !== 'function' )
{
  Function.prototype.bind = function() {
    var method = this, args = TSys.toArray(arguments), object = args.shift();
    return function() { 
      return method.apply(object, args.concat(TSys.toArray(arguments)));
    } ;
  };
}

TSysClass.prototype.toArray = function (iterable)
{
  if ( !iterable ) return []; 
  if (iterable.toArray)
  {
    return iterable.toArray();
  }
  var results = [];
  for ( var i = 0 ; i < iterable.length ; i++ )
  {
    results.push(iterable[i]);
  }     
  return results;
};
