if ( typeof gepard === 'undefined' ) gepard = {} ;

if ( !Array.isArray )
{
  /**
   * Description
   * @method isArray
   * @param {} arg
   * @return LogicalExpression
   */
  Array.isArray = function(arg) {
  	return arg && arg.constructor === Array ;
  };
}
/**
 * Description
 * @constructor
 * @param {} name
 * @param {} type
 * @param {} data
 * @return 
 */
gepard.Event = function ( name, type, data )
{
	this._init ( name, type, data ) ;
};
gepard.Event.prototype =
{
	/**
	 * Description
	 * @method serialize
	 * @param {} obj
	 * @return 
	 */
	serialize: function ( obj )
	{
		if ( ! obj )
		{
			obj = this ;
		}
	  var old = Date.prototype.toJSON ;
	  try
	  {
	    /**
    	 * Description
    	 * @method toJSON
    	 * @return ObjectExpression
    	 */
    	Date.prototype.toJSON = function()
	    {
	      return { type:'Date', 'value': this.toISOString() } ;
	    };
	    return JSON.stringify ( obj ) ;
	  }
	  finally
	  {
	    Date.prototype.toJSON = old ;
	  }
	},
	/**
	 * Description
	 * @method deserialize
	 * @param {} serializedObject
	 * @param {} classNameToConstructor
	 * @param {} deepClassInspection
	 * @return that
	 */
	deserialize: function ( serializedObject, classNameToConstructor, deepClassInspection )
	{
	  var that ;
	  var obj = serializedObject ;
	  if ( deepClassInspection !== false ) deepClassInspection = true ;
	  if ( typeof serializedObject === 'string' )
	  {
			try
			{
		    obj = JSON.parse ( serializedObject ) ;
			}
			catch ( exc )
			{
				console.log ( serializedObject ) ;
				console.log ( exc ) ;
				throw exc ;
			}
	  }
	  if ( deepClassInspection ) gepard.Event.prototype.deepDeserializeClass ( obj ) ;
	  if ( ! classNameToConstructor )
	  {
	  	classNameToConstructor = { "Event": gepard.Event } ;
	  }
	  if ( obj.className && typeof obj.className === 'string' )
	  {
      var mcn = classNameToConstructor[obj.className] ;
      if ( mcn )
      {
        that = f = new mcn() ;
      }
      if ( ! f )
      {
	      f = eval ( obj.className ) ;
		    if ( typeof Object.create === 'function' )
		    {
			    that = Object.create ( f.prototype ) ;
		    }
		    else
		    {
			    /**
    			 * Description
    			 * @method F
    			 * @return 
    			 */
    			function F() { } ;
			    F.prototype = f.prototype ;
	    		that = new F();
	  		}
	    }

	    for ( var k in obj )
	    {
	      if ( ! obj.hasOwnProperty ( k ) ) continue ;
	      var o = obj[k] ;
	      if ( o && typeof o === 'object' )
	      {
	        if ( o.className && typeof o.className === 'string' )
	        {
	          that[k] = this.deserialize ( o ) ;
	          continue ;
	        }
	      }
	      that[k] = obj[k]  ;
	    }
	  }
  	return that ;
	},
	/**
	 * Description
	 * @method deepDeserializeClass
	 * @param {} obj
	 * @return 
	 */
	deepDeserializeClass: function ( obj )
	{
  	if ( ! obj ) return ;
  	for ( var k in obj )
  	{
    	if ( typeof obj.hasOwnProperty === 'function' )
    	{
	    	if ( ! obj.hasOwnProperty ( k ) ) continue ;
    	}
	    var o = obj[k] ;
  	  if ( ! o ) continue ;
    
	    if ( typeof o.type === 'string' )
	    {
	      if ( o.type === 'Date' )
	      {
	        obj[k] = new Date ( o.value ) ;
	        continue ;
	      }
	      if ( typeof document === 'undefined' )
	      {
		      if ( o.type === 'Xml' )
		      {
		        var txml = require ( "Xml" ) ;
		        var f = new txml.XmlFactory() ;
		        obj[k] = f.create ( o.value ) ;
		        continue ;
		      }
		      if ( o.type === "Buffer" && Array.isArray ( o.data ) )
		      {
		        obj[k] = new Buffer ( o.data ) ;
		        continue ;
		      }
	      }
	    }
	    if ( o.className && typeof o.className === 'string' )
	    {
	// console.log ( "o.className=" + o.className ) ;
	    }
	    if ( typeof o === 'object' )
	    {
	      this.deepDeserializeClass ( o ) ;
	    }
	  }
	},
	_init: function ( name, type, data )
	{
		this.className = "Event" ;
		this.name = "" ;
		this.type = "" ;
		this.setName ( name ) ;
		if ( type && typeof type === 'object' )
		{
			data = type ;
			type = "" ;
		}
		this.setType ( type ) ;
		this.user = null ;
		this.control = { createdAt: new Date() } ;
		if ( data )
		{
			if ( typeof data === 'object' ) this.body = data ;
			else
			{
				this.body = {} ;
				this.body.data = data ;
			}
		}
		else this.body = {} ;
	},
	/**
	 * Description
	 * @method getClassName
	 * @return MemberExpression
	 */
	getClassName: function()
	{
		return this.className ;
	},
	/**
	 * Description
	 * @method toString
	 * @return 
	 */
	toString: function()
	{
		return "(" + this.className + ")["
		+  "name=" + this.name
		+ ",type=" + this.type
		+ "]\n"
		+ ( this.user ? "[user=" + this.user + "]" : "" )
		+ "[control=" + this.toFullString ( this.control ) + "]\n"
		+ "[body=" + this.toFullString ( this.body ) + "]"
		;
	},
	toFullString: function ( text, indent )
	{
	  if ( ! indent ) indent = "" ;
	  if ( Array.isArray ( text ) || ( typeof ( text ) == 'object' && text ) )
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
	      if ( Array.isArray ( p ) || ( typeof ( p ) == 'object' && ! ( p instanceof Date ) ) )
	      {
	        str += indent + "\"" + key + "\": <br/>" + this.toFullString ( p, indent + "  " ) + "\n" ;
	        continue ;
	      }
	      str += indent + "\"" + key + "\": \"" + p + "\"\n" ;
	    }
	    return str ;
	  }
	  return String ( text ) ;
	},
	/**
	 * Description
	 * @method getCreatedAt
	 * @return MemberExpression
	 */
	getCreatedAt: function()
	{
  	return this.control.createdAt ;
	},
	/**
	 * Description
	 * @method setIsResult
	 * @return 
	 */
	setIsResult: function()
	{
  	this.control._isResult = true ;
	},
	/**
	 * Description
	 * @method isResult
	 * @return MemberExpression
	 */
	isResult: function()
	{
  	return this.control._isResult ;
	},
	/**
	 * Description
	 * @method setResultRequested
	 * @return 
	 */
	setResultRequested: function()
	{
  	this.control._isResultRequested = true ;
	},
		/**
	 * Description
	 * @method isResultRequested
	 * @return MemberExpression
	 */
	isResultRequested: function()
	{
  	return this.control._isResultRequested ;
	},
	setFailureInfoRequested: function()
	{
  	this.control._isFailureInfoRequested = true ;
	},
	isFailureInfoRequested: function()
	{
  	return this.control._isFailureInfoRequested ;
	},
	/**
	 * Description
	 * @method setIsBroadcast
	 * @return 
	 */
	setIsBroadcast: function()
	{
  	this.control._isBroadcast = true ;
	},
		/**
	 * Description
	 * @method isBroadcast
	 * @return MemberExpression
	 */
	isBroadcast: function()
	{
  	return this.control._isBroadcast ;
	},
	/**
	 * Description
	 * @method getSourceIdentifier
	 * @return MemberExpression
	 */
	getSourceIdentifier: function()
	{
  	return this.control.sourceIdentifier ;
	},
	/**
	 * Description
	 * @method setSourceIdentifier
	 * @param {} sourceIdentifier
	 * @return 
	 */
	setSourceIdentifier: function ( sourceIdentifier )
	{
  	this.control.sourceIdentifier = sourceIdentifier ;
	},
	/**
	 * Description
	 * @method getProxyIdentifier
	 * @return MemberExpression
	 */
	getProxyIdentifier: function()
	{
  	return this.control.proxyIdentifier ;
	},
	/**
	 * Description
	 * @method setProxyIdentifier
	 * @param {} proxyIdentifier
	 * @return 
	 */
	setProxyIdentifier: function ( proxyIdentifier )
	{
  	this.control.proxyIdentifier = proxyIdentifier ;
	},
	/**
	 * Description
	 * @method getWebIdentifier
	 * @return MemberExpression
	 */
	getWebIdentifier: function()
	{
  	return this.control.webIdentifier ;
	},
	/**
	 * Description
	 * @method setWebIdentifier
	 * @param {} webIdentifier
	 * @return 
	 */
	setWebIdentifier: function ( webIdentifier )
	{
  	this.control.webIdentifier = webIdentifier ;
	},
	/**
	 * Description
	 * @method getName
	 * @return MemberExpression
	 */
	getName: function()
	{
  	return this.name ;
	},
	/**
	 * Description
	 * @method setName
	 * @param {} name
	 * @return 
	 */
	setName: function ( name )
	{
  	this.name = name ? name : "" ;
	},
	/**
	 * Description
	 * @method getType
	 * @return MemberExpression
	 */
	getType: function()
	{
		return this.type ;
	},
	/**
	 * Description
	 * @method setType
	 * @param {} type
	 * @return 
	 */
	setType: function ( type )
	{
		if ( typeof type === 'undefined' ) type = "" ;
  	this.type = type ;
	},
	/**
	 * Description
	 * @method getBody
	 * @return MemberExpression
	 */
	getBody: function()
	{
		return this.body ;
	},
	/**
	 * Description
	 * @method setBody
	 * @param {} data
	 * @return 
	 */
	setBody: function ( data )
	{
		if ( data ) this.body = data ;
	},
	/**
	 * Description
	 * @method getUser
	 * @return MemberExpression
	 */
	getUser: function()
	{
		return this.user ;
	},
	/**
	 * Description
	 * @method setUser
	 * @param {} u
	 * @return 
	 */
	setUser: function ( u )
	{
		this.user = u ;
	},
	/**
	 * Description
	 * @method getControl
	 * @return MemberExpression
	 */
	getControl: function()
	{
		return this.control ;
	},
	/**
	 * Description
	 * @method setUniqueId
	 * @param {} uid
	 * @return 
	 */
	setUniqueId: function ( uid )
	{
		if ( ! this.control.uniqueId )
		{
			this.control.uniqueId = uid ;
		}
	},
	/**
	 * Description
	 * @method getUniqueId
	 * @return MemberExpression
	 */
	getUniqueId: function()
	{
		return this.control.uniqueId ;
	},
	/**
	 * Description
	 * @method isBad
	 * @return BinaryExpression
	 */
	isBad: function()
	{
		if ( ! this.control ) return false ;
		if ( ! this.control.status ) return false ;
		if ( this.control.status.code === 'undefined' ) return false ;
		return this.control.status.code !== 0 ;
	},
	/**
	 * Description
	 * @method getStatus
	 * @return MemberExpression
	 */
	getStatus: function()
	{
		if ( ! this.control ) return ;
		return this.control.status ;
	},
	/**
	 * Description
	 * @method getStatusReason
	 * @return MemberExpression
	 */
	getStatusReason: function()
	{
		if ( ! this.control ) return ;
		if ( ! this.control.status ) return ;
		return this.control.status.reason ;
	}
};
if ( typeof document !== 'undefined' )
{
	gepard.serialize = gepard.Event.prototype.serialize ;
	gepard.deserialize = gepard.Event.prototype.deserialize ;
}
else
{
	module.exports = gepard.Event ;

	if ( require.main === module )
	{
		var ne = new gepard.Event ( 'BC', "T" ) ;
		var str = ne.serialize() ;
		console.log ( "str=" + str ) ;
		var o = gepard.Event.prototype.deserialize ( str ) ;
		console.log ( o ) ;
	}
}
