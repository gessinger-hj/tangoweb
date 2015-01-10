NetEvent = function ( name, type )
{
  if ( name && name.jsClassName == "TXml" )
  {
    this.xEvent = name ;
    this.name = this.xEvent.getContent ( "Name" ) ;
  }
  else
  {
    if ( ! name ) return ;
    this.name = name ;
    this.xEvent = new TXml ( "Event" ) ;
    this.xEvent.add ( "Name", name ) ;
    if ( type )
    {
      this.xEvent.add ( "Type", type ) ;
    }
  }
} ;
NetEvent.prototype.toString = function()
{
  return "" + this.xEvent ;
};
NetEvent.prototype.getName = function()
{
  return this.name ;
};
NetEvent.prototype.getType = function()
{
  return this.xEvent.getContent ( "Type" ) ;
};
NetEvent.prototype.getXml = function()
{
  return this.xEvent ;
};
TailEvent = function ( xEvent )
{
  Tango.initSuper ( this, NetEvent, xEvent ) ;
};
TailEvent.inherits ( NetEvent ) ;
TailEvent.prototype.getText = function()
{
  return this.xEvent.getContent ( "Text" ) ;
};

AuditEvent = function ( name )
{
  if ( ! name ) name = "Log" ;
  this.name = name ;
  this.clazz = "AuditEvent" ;
  this.xEvent = new TXml ( "Event" ) ;
  this.xAUDIT = this.xEvent.add ( "AUDIT" ) ;
} ;
AuditEvent.prototype.toString = function ()
{
  var x = new TXml ( "Event" ) ;
  x.copyAttributesFrom ( this.xEvent ) ;
  x.copyChildrenFrom ( this.xEvent ) ;
  x.addCDATA ( "Name", this.clazz + "<" + this.name + ">" ) ;
  x.add ( "User" ) ;
  return x.toString() ;
};
AuditEvent.prototype.setAction = function ( action )
{
  this.xAUDIT.ensureElement ( "action" ).setContent ( action ) ;
};
AuditEvent.prototype.setText = function ( text )
{
  var xText = this.xAUDIT.get ( "text" ) ;
  if ( xText ) xText.remove() ;
  if ( typeof ( text ) != "string" )
  {
    text = String ( text ) ;
  }
  text = text.replace ( /<!\[CDATA\[/g, "___CDATA_" ) ;
  text = text.replace ( /\]\]/g, "||" ) ;
  text = text.replace ( /\[/g, "|" ).replace ( /\]/g, "|" ) ;
  this.xAUDIT.addCDATA ( "text", text ) ;
};

NetLockStoreClass = function()
{
  this.first = true ;
  this._currentLocks = [] ;
  this._pendingLocks = [] ;
  this._timer = null ;
} ;
NetLockStoreClass.prototype._getTimer = function()
{
  if ( this._timer ) return this._timer ;
  this._timer = new TTimer ( 4000, function(t)
  {
    t.store._aquirePending() ;
  });
  this._timer.store = this ;
  return this._timer ;
} ;
NetLockStoreClass.prototype.aquire = function ( name, obj, method )
{
  return new NetLock ( name, obj, method ) ;
} ;
NetLockStoreClass.prototype.release = function ( name )
{
  this._getTimer().stop() ;
  for ( var i = 0 ; i < this._pendingLocks.length ; i++ )
  {
    if ( this._pendingLocks[i].name == name )
    {
      var pl = this._pendingLocks[i] ;
      pl.invalid = true ;
      this._pendingLocks.remove ( pl ) ;
      break ;
    }
  }
  for ( var i = 0 ; i < this._currentLocks.length ; i++ )
  {
    if ( this._currentLocks[i].name == name )
    {
      var l = this._currentLocks[i] ;
      l.invalid = true ;
      this._currentLocks.remove ( l ) ;
      l.release() ;
      break ;
    }
  }
  this._getTimer().start() ;
} ;
NetLockStoreClass.prototype._lockAlreadyExists = function ( name )
{
  for ( var i = 0 ; i < this._currentLocks.length ; i++ )
  {
    if ( this._currentLocks[i].name == name )
    {
      return true ;
    }
  }
  return false ;
} ;
NetLockStoreClass.prototype._remove = function ( nl )
{
  this._pendingLocks.remove ( nl ) ;
  this._currentLocks.remove ( nl ) ;
} ;
NetLockStoreClass.prototype._addToLocks = function ( nl )
{
  this._getTimer().stop() ;
  if ( this.first )
  {
    this.first = false ;
    var fe = new TFunctionExecutor ( this, this.logout ) ;
    TSys.addLogoutListener ( fe ) ;
    TSys.addUnloadListener ( fe ) ;
    TGlobalEventHandler.addToShortCutList ( 116, null, fe ) ;
  }
  this._currentLocks.push ( nl ) ;
  this._getTimer().start() ;
} ;
NetLockStoreClass.prototype._addToPending = function ( nl )
{
  this._getTimer().stop() ;
  if ( this.first )
  {
    this.first = false ;
    var fe = new TFunctionExecutor ( this, this.logout ) ;
    TSys.addLogoutListener ( fe ) ;
    TSys.addUnloadListener ( fe ) ;
    TGlobalEventHandler.addToShortCutList ( 116, null, fe ) ;
  }
  this._pendingLocks.push ( nl ) ;
  this._getTimer().start() ;
} ;
NetLockStoreClass.prototype.logout = function()
{
  this.releaseAll() ;
} ;
NetLockStoreClass.prototype._aquirePending = function()
{
  if ( this._pendingLocks.length == 0 )
  {
    this._getTimer().stop() ;
    return ;
  }
  var url = TSys.getDataFactoryUrl() + "&action=NetLockAquire" ;
  var xml = new TXml() ;
  var a = [] ;
  for ( var i = 0 ; i < this._pendingLocks.length ; i++ )
  {
    if ( this._pendingLocks[i].invalid ) continue ;
    var xx = xml.add ( "NetLock" ) ;
    xx.addAttribute ( "name", this._pendingLocks[i].name ) ;
    a.push ( this._pendingLocks[i] ) ;
  }
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
  var en = xResult.elements() ;
  var index = 0 ;
  while ( en.hasNext() )
  {
    var xnl = en.nextXml() ;
    var owner = xnl.getBoolAttribute ( "isOwner", false ) ;
    var error = xnl.getAttribute ( "error" ) ;
    var nl = a[index] ;
    if ( owner )
    {
      this._currentLocks.push ( nl ) ;
      this._pendingLocks.remove ( nl ) ;
      nl._setIsOwner() ;
    }
    if ( error )
    {
      this._pendingLocks.remove ( nl ) ;
    }
    index++ ;
  }
  a.length = 0 ;
  if ( this._pendingLocks.length == 0 )
  {
    this._getTimer().stop() ;
  }
} ;
NetLockStoreClass.prototype.releaseAll = function()
{
  try
  {
    this._getTimer().stop() ;
    this._pendingLocks.length = 0 ; ;
    var a = this._currentLocks ;
    this._currentLocks = [] ;
    if ( ! a.length ) return ;
    var xml = new TXml() ;
    for ( var i = 0 ; i < a.length ; i++ )
    {
      var xx = xml.add ( "NetLock" ) ;
      xx.addAttribute ( "name", a[i].name ) ;
    }
    var url = TSys.getDataFactoryUrl() + "&action=NetLockRelease" ;
    var HTTP = TSys.httpPost ( url, xml.toString() ) ;
    if ( HTTP.status != 200 )
    {
      if ( HTTP.status != 412 )
        TSys.throwHttpStatusException ( HTTP ) ;
    }
    var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
  }
  catch ( exc )
  {

  }
} ;
NetLockStore = new NetLockStoreClass() ;

NetLock = function ( name, obj, method )
{
  this._isOwner = false ;
  this.name = name ;
  this.obj = obj ;
  this.method = method ;
  this._aquire() ;
} ;
NetLock.prototype.toString = function()
{
  return "(NetLock)[name=" + this.name + ",owner=" + this._isOwner + "]" ;
} ;
NetLock.prototype._aquire = function()
{
  var url = TSys.getDataFactoryUrl() + "&action=NetLockAquire" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetLock" ) ;
  xx.addAttribute ( "name", this.name ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
  xx = xResult.get ( "NetLock" ) ;
  this._isOwner = xx.getBoolAttribute ( "isOwner", false ) ;
  var error = xx.getAttribute ( "error" ) ;
  if ( error )
  {
    if ( NetLockStore._lockAlreadyExists ( this.name ) )
    {
      var t = "Resource '" + this.name + "' is already locked." ;
      TSys.log ( t ) ;
      throw t ;
    }
  }
  if ( ! error )
  {
    if ( this._isOwner )
    {
      NetLockStore._addToLocks ( this ) ;
    }
    else
    {
      NetLockStore._addToPending ( this ) ;
    }
  }
} ;
NetLock.prototype.release = function()
{
  NetLockStore._remove ( this ) ;
  if ( ! this._isOwner ) return ;
  var url = TSys.getDataFactoryUrl() + "&action=NetLockRelease" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetLock" ) ;
  xx.addAttribute ( "name", this.name ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
} ;
NetLock.prototype._setIsOwner = function()
{
  this._isOwner = true ;
  if ( this.obj || this.method )
  {
    var fe = new TFunctionExecutor ( this.obj, this.method ) ;
    fe.execute ( [ this] ) ;
  }
} ;
NetLock.prototype.isOwner = function()
{
  return this._isOwner ;
} ;

NetEventHandlerClass = function()
{
  this.jsClassName = "NetEventHandlerClass" ;
  this._timer = null ;
  this.nameToListener = [] ;
  this.nameList = [] ;
  var fe = new TFunctionExecutor ( this, this.logout ) ;
  TSys.addLogoutListener ( fe ) ;
  TSys.addUnloadListener ( fe ) ;
  TGlobalEventHandler.addToShortCutList ( 116, null, fe ) ;
} ;
NetEventHandlerClass.prototype.logout = function()
{
  this._getTimer().stop() ;
  this.removeAllListener() ;
};

NetEventHandlerClass.prototype._getTimer = function()
{
  if ( this._timer ) return this._timer ;
  var thiz = this ;
  this._timer = new TTimer ( 4000, function(t)
  {
    thiz._pullEvents() ;
  });
  return this._timer ;
} ;
NetEventHandlerClass.prototype.addListener = function ( listener )
{
  if ( ! ( listener instanceof NetEventListener ) )
  {
    throw "NetEventHandlerClass.prototype.addListener: parameter listener must be a NetEventListener object" ;
  }
  this._getTimer().stop() ;
  listener.setNetEventHandler ( this ) ;
  var eventName = listener.getEventName() ;
  var listenerArray = this.nameToListener[eventName] ;
  if ( ! listenerArray )
  {
    listenerArray = [] ;
    this.nameToListener[eventName] = listenerArray ;
    this.nameList.push ( eventName ) ;
    this._addListener ( eventName ) ;
  }
  listenerArray.push ( listener ) ;
  this._getTimer().start() ;
} ;
NetEventHandlerClass.prototype.removeListener = function ( listener )
{
  if ( ! ( listener instanceof NetEventListener ) )
  {
    throw "NetEventHandlerClass.prototype._removeListener: parameter listener must be a NetEventListener object" ;
  }
  this._getTimer().stop() ;
  var eventName = listener.getEventName() ;
  var listenerArray = this.nameToListener[eventName] ;
  if ( listenerArray )
  {
    listenerArray.remove ( listener ) ;
    this.nameList.remove ( eventName ) ;
    if ( ! listenerArray.length )
    {
      this._removeListener ( eventName ) ;
      delete this.nameToListener[eventName] ;
    }
  }
  if ( this.nameList.length )
  {
    this._getTimer().start() ;
  }
};
NetEventHandlerClass.prototype.removeAllListener = function()
{
  try
  {
    this._getTimer().stop() ;
    var url = TSys.getDataFactoryUrl() + "&action=NetEventListenerRemove" ;
    var xml = new TXml() ;
    var numberOfRegisteredListeners = this.nameList.length ;
    for ( var i = 0 ; i < this.nameList.length ; i++ )
    {
      var xx = xml.add ( "NetEventListener" ) ;
      xx.addAttribute ( "name", this.nameList[i] ) ;
      delete this.nameToListener[this.nameList[i]] ;
    }
    this.nameList.length = 0 ;
    this.nameToListener.length = 0 ;
    if ( ! numberOfRegisteredListeners ) return ;  
    var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  }
  catch ( exc )
  {

  }
} ;
NetEventHandlerClass.prototype._addListener = function ( eventName )
{
  var url = TSys.getDataFactoryUrl() + "&action=NetEventListenerAdd" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetEventListener" ) ;
  xx.addAttribute ( "name", eventName ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
  xx = xResult.get ( "NetEventListener" ) ;
  var error = xx.getAttribute ( "error" ) ;
  if ( error )
  {
    var t = "NetEventHandlerClass.prototype._addListener '" + eventName + "' " + error ;
    TSys.log ( t ) ;
    throw t ;
  }
} ;
NetEventHandlerClass.prototype._removeListener = function ( eventName )
{
  var url = TSys.getDataFactoryUrl() + "&action=NetEventListenerRemove" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetEventListener" ) ;
  xx.addAttribute ( "name", eventName ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
} ;
NetEventHandlerClass.prototype._pullEvents = function()
{
  var xResult = this.__pullEvents() ;
  var thiz = this ;
  xResult.elements ( function ( e )
  {
    var eventName = e.getContent ( "Name" ) ;
    var listenerArray = thiz.nameToListener[eventName] ;
    if ( listenerArray )
    {
      for ( var i = 0 ; i < listenerArray.length ; i++ )
      {
        listenerArray[i].eventOccured ( e ) ;
      }
    }
  })
} ;
NetEventHandlerClass.prototype.__pullEvents = function()
{
  var url = TSys.getDataFactoryUrl() + "&action=NetEventListenerPullEvents" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetEventListener" ) ;
  xx.addAttribute ( "name", this.eventName ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  return new TXml ( HTTP.responseXML.documentElement ) ;
} ;
NetEventHandlerClass.prototype._peekEvents = function()
{
  var xResult = this.__peekEvents() ;
  var thiz = this ;
  xResult.elements ( function ( e )
  {
    var eventName = e.getContent ( "Name" ) ;
    var listenerArray = thiz.nameToListener[eventName] ;
    if ( listenerArray )
    {
      for ( var i = 0 ; i < listenerArray.length ; i++ )
      {
        listenerArray[i].eventOccured ( e ) ;
      }
    }
  })
} ;
NetEventHandlerClass.prototype.__peekEvents = function()
{
  var url = TSys.getDataFactoryUrl() + "&action=NetEventListenerPeekEvents" ;
  var xml = new TXml() ;
  var xx = xml.add ( "NetEventListener" ) ;
  xx.addAttribute ( "name", this.eventName ) ;
  var HTTP = TSys.httpPost ( url, xml.toString() ) ;
  if ( HTTP.status != 200 )
  {
    if ( HTTP.status != 412 )
      TSys.throwHttpStatusException ( HTTP ) ;
  }
  return new TXml ( HTTP.responseXML.documentElement ) ;
} ;


NetEventHandler = new NetEventHandlerClass() ;

NetEventListener = function ( eventName, obj, method )
{
  this.jsClassName = "NetEventListener" ;
  this.eventName = eventName ;
  this.obj = obj ;
  this.method = method ;
} ;
NetEventListener.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[eventName=" + this.eventName + "]" ;
} ;
NetEventListener.prototype.setNetEventHandler = function ( handler )
{
  this._NetEventHandler = handler ;
} ;
NetEventListener.prototype.getEventName = function()
{
  return this.eventName ;
} ;
NetEventListener.prototype.remove = function()
{
  if ( this._NetEventHandler )
  {
    this._NetEventHandler.removeListener ( this ) ;
  }
} ;
NetEventListener.prototype.eventOccured = function ( xe )
{
  if ( this.obj && typeof ( this.obj ) == "object" && typeof ( this.method ) == "function" )
  {
    this.method.call ( this.obj, xe ) ;
  }
  else
  if ( typeof ( this.obj ) == "function" )
  {
    this.obj ( xe ) ;
  }
} ;

/**
 *  @constructor
 */
var NetResourceClass = function()
{
}
NetResourceClass.prototype.fireEvent = function ( eventName, uniqueId, selectId )
{
  var msg = new CoMessage ( "NETRESOURCE.REQUEST" ) ;
  msg.setHost ( Admin.getHost() ) ;
  msg.setPort ( Admin.getPort() ) ;

  var type = null ;
  if ( typeof ( selectId ) === 'string' )
  {
    var e = document.getElementById ( selectId ) ;
    if ( e )
    {
      type = e.value ;
    }
  }
  msg.setXmlData ( "<NETRESOURCE.REQUEST>"
                 + "<Operation>FireEvent</Operation>"
                 + "<Event>"
                 + "<Name><![CDATA[" + eventName + "]]></Name>"
                 + ( type ? "<Type><![CDATA[" + type + "]]></Type>" : "" )
                 + ( uniqueId ? "<UniqueId>" + uniqueId + "</UniqueId>" : "" )
                 + "</Event>"
                 + "</NETRESOURCE.REQUEST>"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  return x ;
}
NetResourceClass.prototype.auditlog = function ( auditEvent )
{
  var msg = new CoMessage ( "NETRESOURCE.REQUEST" ) ;
  msg.setHost ( Admin.getHost() ) ;
  msg.setPort ( Admin.getPort() ) ;
  msg.setXmlData ( "<NETRESOURCE.REQUEST>"
                 + "<Operation>FireEvent</Operation>"
                 + auditEvent
                 + "</NETRESOURCE.REQUEST>"
                 ) ;
  try
  {
    Calypso.getXml ( msg, function ( HTTP ) { } ) ;
  }
  catch ( exc )
  {
    TSys.log ( exc ) ;
  }
}
var NetResource = new NetResourceClass() ;
