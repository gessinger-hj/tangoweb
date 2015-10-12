PluginMonitorClass = function ( prefix )
{
  this.jsClassName = "PluginMonitorClass" ;
  this.netEventListener = null ;
  this.notifier = null ;
  // this._eventName = "plugins" ;
  // this._initEventName = "emit-plugins-info" ;
  if ( prefix )
  {
    this._eventName = prefix + ":plugins" ;
    this._initEventName = prefix + ":emit-plugins-info" ;
  }
  else
  {
    this._eventName = "plugins" ;
    this._initEventName = "emit-plugins-info" ;
  }
};
PluginMonitorClass.prototype.toggleDisplay = function()
{
  if ( this.netEventListener )
  {
    this.notifier.close() ;
    NetEventHandler.removeListener ( this.netEventListener ) ;
    this.netEventListener = null ;
    return ;
  }
  this.display() ;
};
PluginMonitorClass.prototype.display = function()
{
  if ( this.netEventListener )
  {
    this.netEventListener.remove() ;
    NetEventHandler.addListener ( this.netEventListener ) ;
    return ;
  }
  if ( ! this.notifier )
  {
    this.notifier = new SystemNotifierClass ( { width: 500, showIcons: false } ) ;
    var thiz = this ;
    this.notifier.on ( "click", function notifier_onclick(ev)
    {
      thiz.notifier.close() ;
      NetEventHandler.removeListener ( thiz.netEventListener ) ;
      thiz.netEventListener = null ;
    });
  }
  this.netEventListener = new NetEventListener ( this._eventName, this.plugins.bind ( this ) ) ;
  NetEventHandler.addListener ( this.netEventListener ) ;
  NetResource.emit ( this._initEventName ) ;
};
PluginMonitorClass.prototype.plugins = function ( xEvent )
{
  var xPLUGINS = xEvent.get ( "xml/PLUGINS" ) ;
  this.notifier.clear() ;
  this.notifier.notify ( "<b>CISS Transactions</b>" ) ;
  var thiz = this ;
  xPLUGINS.elements ( function PLUGIN_elements ( row )
  {
    var t = "" ;
    var date = row.getDate ( "TRANSACTIONTASKSTART" ) ;
    var tt = DateUtils.formatTimeShort ( date ) ;
    t += tt + " - " ;
    t += row.getContent ( "PARAMVALUEIN0" ) ;
    t += " - " ;
    t += row.getContent ( "PARTNERCODE" ) ;
    t += " - " ;
    t += row.getContent ( "EN" ) ;
    var EXEC_CLASS = row.getContent ( "EXEC_CLASS" ) ;
    if ( EXEC_CLASS.indexOf ( "." ) >= 0 )
    {
      EXEC_CLASS = EXEC_CLASS.substring ( EXEC_CLASS.indexOf ( "." ) + 1 ) ;
    }
    t += " (" + EXEC_CLASS + ")" ;
    thiz.notifier.notify ( t ) ;
  });
  var BDE = xEvent.get ( "xml/BDE" ) ;
  thiz.notifier.notify ( "<b>BDE</b>" ) ;
  if ( ! BDE )
  {
    return ;
  }
  var first = true ;
  var ACTIVE = BDE.get ( "ACTIVE" ) ;
  ACTIVE.elements ( function ACTIVE_elements ( report )
  {
    if ( first )
    {
      thiz.notifier.notify ( "<b>Active</b>" ) ;
      first = false ;
    }
    thiz.notifier.notify ( report.getContent ( "LINE" ) ) ;
  });
  first = true ;
  var QUEUE = BDE.get ( "QUEUE" ) ;
  QUEUE.elements ( function QUEUE_elements ( report )
  {
    if ( first )
    {
      thiz.notifier.notify ( "<b>Queue</b>" ) ;
      first = false ;
    }
    thiz.notifier.notify ( report.getContent ( "LINE" ) ) ;
  });
};
PluginMonitorClass.prototype.removeListener = function()
{
  if ( ! this.netEventListener ) return ;
  this.netEventListener.remove() ;
  this.netEventListener = null ;
};
var PluginMonitor ; //= new PluginMonitorClass ( "vge" ) ;
