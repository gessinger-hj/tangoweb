//Tango.include ( "TPlot" ) ;
/**
 *  @constructor
 */
var AdminClass = function()
{
  this.notebook              = null ;
  this.tableSubscriber       = null ;
  this.formSubscriber        = null ;
  this.formSubscriberDisplay = null ;
  this.currentName           = null ;
  this.timerMillis           = 3000 ;
  this.windowSessions        = null ;
  this.connIsNew             = true ;
  this.connections           = [] ;
  this.hostPort              = "" ;
  this.host                  = "" ;
  this.port                  = "" ;
  this.port                  = "" ;
  this._ResetStatisticsNext  = false ;
  this._loggerId             = "" ;
  this._dispatcherId         = "" ;
  this.first                 = true ;
  this.pendingHost2          = null ;
  this.pendingPort2          = null ;
};
AdminClass.prototype.getDispatcherId = function()
{
  return this._dispatcherId ;
}
AdminClass.prototype.getLoggerId = function()
{
  return this._loggerId ;
}
AdminClass.prototype.setHostPort = function ( host, port )
{
  if ( typeof ( port ) == 'string' ) port = parseInt ( port ) ;
  if ( typeof ( port ) != 'number' ) return ;
  if ( host ) this.hostPort = "&host=" + host + "&port=" + port ;
  else        this.hostPort = "&port=" + port ;

  this.host = host ;
  this.port = port ;
  if ( this.timer )
  {
    this.timer.stop() ;
    if ( this.canvasRequestsPerSecond )
    {
      this.canvasRequestsPerSecond.reset() ;
    }
    if ( this.canvasStepsPerSecond )
    {
      this.canvasStepsPerSecond.reset() ;
    }
    if ( this.canvasAverageTaskTime )
    {
      this.canvasAverageTaskTime.reset() ;
    }
    this.timer.setInitialDelay ( 20 ) ;
    this.timer.start() ;
  }
};
AdminClass.prototype.getHost = function()
{
  return this.host ;
}
AdminClass.prototype.getPort = function()
{
  return this.port ;
}
AdminClass.prototype.onload = function ( ev )
{
  var c = ev.getComponent() ;
  this.notebookContainer = c ;
  this.notebook = ev.getPeer() ;
  this.formAdminToolbar = new TContainer ( "Form.Admin.Toolbar" ) ;
  this.formSubscriber = c.getComponent ( "Form.Subscriber" ) ;
  this.formSubscriberDisplay = c.getComponent ( "Form.Subscriber.Display" ) ;
  this.formSubscriberRight = c.getComponent ( "Form.Subscriber.Right" ) ;
  this.PBrefreshAxl = c.getComponent ( "PB.refreshAxl" ) ;
  this.PBreplaceSubscriber = c.getComponent ( "PB.replaceSubscriber" ) ;
  this.PBshutdownSubscriber = c.getComponent ( "PB.shutdownSubscriber" ) ;
  this.formStatisticSubscriber = c.getComponent ( "Form.Statistic.Subscriber" ) ;
  this.formStatisticTasks = c.getComponent ( "Form.Statistic.Tasks" ) ;
  this.formStatisticSteps = c.getComponent ( "Form.Statistic.Steps" ) ;
  this.formStatisticPendingSubjects = c.getComponent ( "Form.Statistic.PendingSubjects" ) ;
  this.formMessages = c.getComponent ( "Form.Admin.Messages" ) ;
  this.formDispatcher = c.getComponent ( "Form.Dispatcher" ) ;
  this.formLogger = c.getComponent ( "Form.Logger" ) ;
  this.tableSubscriber = c.getPeer ( "TABLE.SUBSCRIBER" ) ;
//  this.tableMSG = this.formMessages.getPeer ( "MSG" ) ;
  this.peerLogInfo = c.getPeer ( "LogInfo" ) ;
  this.peerActionInfo = c.getPeer ( "ActionInfo" ) ;
  this.logInfo = true ;
  this.actionInfo = true ;
  var thiz = this ;
  this.timer = new TTimer ( this.timerMillis, function()
  {
    thiz.showBasics() ;
  } ) ;
  try
  {
    var xu = this.getUserXml ( "Admin.xml" ) ;
    var h = xu.getContent ( "host" ) ;
    var p = xu.getContent ( "port" ) ;
    if ( h && p )
    {
      this.pendingHost2 = h ;
      this.pendingPort2 = p ;
    }
  }
  catch ( exc )
  {
  }
  var t = new TContainer ( 'Form.Admin.Toolbar' ) ;
  this.PBstartList = t.getComponent ( "PB.startList" ) ;
  this.timer.setInitialDelay ( 2000 ) ;
  this.timer.start() ;
} ;
AdminClass.prototype.refreshAxl = function ( event )
{
  this._showAxl ( this.currentName ) ;
} ;
AdminClass.prototype.showStartListFull = function ( event )
{
  var a = this.getAvailableNameSpaceList ( "CMan" ) ;
  if ( ! a.length ) return ;
  var xml = new TXml() ;
  var xList = xml.add ( "Start.list" ) ;

  for ( var i = 0 ; i < a.length ; i++ )
  {
    var msg = new CoMessage ( a[i] + "::CMAN.REQUEST" ) ;
    msg.setXmlData ( "<CMAN.REQUEST>\n"
		   + "<Operation>getStartList</Operation>\n"
		   + "</CMAN.REQUEST>\n"
	      	   ) ;
    var x = Calypso.getXml ( msg ) ;
    if ( ! x ) return ;
    var xx = x.get ( "CMAN.RESULT/Start.list" ) ;
    if ( ! xx || xx.isEmpty() ) return ;

    xList.copyChildrenFrom ( xx ) ;
  }
  a.length = 0 ;
  var en = xList.getEnum ( "row" ) ;
  var toBeRemoved = [] ;
  while ( en.hasNext() )
  {
    var sub = en.nextXml() ;
    if ( sub.getContent ( "Name" ) == 'CMan' ) toBeRemoved.push ( sub ) ;
  }
  for ( var i = 0 ; i < toBeRemoved.length ; i++ )
  {
    toBeRemoved[i].remove() ;
  }
  toBeRemoved.length = 0 ;

  var s = ""
        + "<xml>\n"
        + "  <Window id='Admin.Window.Start.List' title='Full Startlist'>\n"
        + "    <Container style='bottom:-0px;right:-0px;' onchange='handle:PB.Start'>\n"
        + "      <Table name='Start.list' style='width:250px;height:300px;bottom:-0px;right:-0px;attach-bottom:true;' >\n"
        + "        <Columns>\n"
        + "          <Column name='HostName' title='Host'/>\n"
        + "          <Column name='Name' title='Name'/>\n"
        + "        </Columns>\n"
        + "      </Table>\n"
        + "      <br/>\n"
        + "      <Container style='bottom:0px;right:0px;'>\n"
        + "      <PushButton name='PB.Start' disabled='true' text='Start' onclick='*.startSubscriberFromTable()'/>\n"
        + "      </Container>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  var w = new TWindow ( dom ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( xml ) ;
  w.show() ;
} ;
AdminClass.prototype.showStartList = function ( event )
{
  var v = this.formSubscriberRight.getValues() ;
  var hostName = v.getContent ( "hostName" ) ;
  var xml = new TXml() ;
  var xList = xml.add ( "Start.list" ) ;

  var msg = new CoMessage ( hostName + "::CMAN.REQUEST" ) ;
  msg.setXmlData ( "<CMAN.REQUEST>\n"
		 + "<Operation>getStartList</Operation>\n"
		 + "</CMAN.REQUEST>\n"
	      	 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( ! x ) return ;
  var xx = x.get ( "CMAN.RESULT/Start.list" ) ;
  if ( ! xx || xx.isEmpty() ) return ;

  xList.copyChildrenFrom ( xx ) ;

  var s = ""
        + "<xml>\n"
        + "  <Window id='Admin.Window.Start.List' title='Startlist of: " + hostName + "'>\n"
        + "    <Container style='bottom:-0px;right:-0px;' onchange='handle:PB.Start'>\n"
        + "      <Table name='Start.list' style='width:250px;height:300px;bottom:-0px;right:-0px;attach-bottom:true;' >\n"
        + "        <Columns>\n"
        + "          <Column name='HostName' title='Host'/>\n"
        + "          <Column name='Name' title='Name'/>\n"
        + "        </Columns>\n"
        + "      </Table>\n"
        + "      <br/>\n"
        + "      <Container style='bottom:0px;right:0px;'>\n"
        + "      <PushButton name='PB.Start' disabled='true' text='Start' onclick='*.startSubscriberFromTable()'/>\n"
        + "      </Container>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  var w = new TWindow ( dom ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( xml ) ;
  w.show() ;
} ;
AdminClass.prototype.startSubscriberFromTable = function ( event )
{
  var ev = new TEvent ( event ) ;
  var tab = ev.getWindow().getPeer ( "Start.list" ) ;
  var ud = tab.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var cmd = ud.getContent ( "Cmd" ) ;
  var hostName = ud.getContent ( "HostName" ) ;
  var msg = new CoMessage ( hostName + "::CMAN.REQUEST" ) ;
  msg.setXmlData ( "<CMAN.REQUEST>\n"
		 + "<Operation>startSubscriber</Operation>\n"
		 + "<SubscriberName>" + cmd + "</SubscriberName>\n"
		 + "</CMAN.REQUEST>\n"
	      	 ) ;
  try
  {
    var x = Calypso.getXml ( msg ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( "Could not start: " + cmd + " on host " + hostName ) ;
    d.error() ;
  }
} ;
AdminClass.prototype.replaceSubscriber = function ( event )
{
  var v = this.formSubscriberRight.getValues() ;
  var hostName = v.getContent ( "hostName" ) ;
  var msg = new CoMessage ( hostName + "::" + "CMAN.REQUEST" ) ;
  msg.setXmlData ( "<CMAN.REQUEST>\n"
		 + "<Operation>replaceSubscriber</Operation>\n"
		 + "<SubscriberName>" + this.currentName + "</SubscriberName></CMAN.REQUEST>\n"
	      	 ) ;
  try
  {
    var x = Calypso.getXml ( msg ) ;
  }
  catch ( exc )
  {
    TSys.log ( exc ) ;
  }
} ;
AdminClass.prototype.shutdownSubscriber = function ( event )
{
  var v = this.formSubscriberRight.getValues() ;
  var hostName = v.getContent ( "hostName" ) ;
  var msg = new CoMessage ( hostName + "::" + "CMAN.REQUEST" ) ;
  msg.setXmlData ( "<CMAN.REQUEST>\n"
		 + "<Operation>shutdownSubscriber</Operation>\n"
		 + "<SubscriberName>" + this.currentName + "</SubscriberName></CMAN.REQUEST>\n"
	      	 ) ;
  try
  {
    var x = Calypso.getXml ( msg ) ;
  }
  catch ( exc )
  {
    TSys.log ( exc ) ;
  }
} ;
AdminClass.prototype.showSessions = function()
{
/*
  var x = this.getSessions() ;
  var w = TGui.getWindow ( "Window.Admin.Sessions" ) ;
  if ( ! w )
  {
    w = new TWindow ( "Window.Admin.Sessions" ) ;
    w.create() ;
    w.setValues ( x ) ;
    w.show() ;
  }
  else
  {
    w.setValues ( x ) ;
    w.toFront() ;
  }
*/
}
AdminClass.prototype.getSessions = function()
{
  return null ; //new URClient().getSessions() ;
}
AdminClass.prototype.getStatistics = function()
{
  var url = null ;
  var str = "" ;
  if ( this.logInfo ) str += "&logInfo=true" ;
  if ( this.actionInfo ) str += "&actionInfo=true" ;
  if ( this._ResetStatisticsNext )
  {
    url = TSys.getMainServletName()+"?adminAction=ResetStatistics" + str + this.hostPort ;
    if ( this.subscriberVersion >= 4 && this.currentName ) url += "&PerformanceUsedName=" + encodeURIComponent ( this.currentName ) ;
  }
  else
  {
    url = TSys.getMainServletName()+"?adminAction=GetStatistics" + str + this.hostPort ;
    if ( this.subscriberVersion >= 4 && this.currentName ) url += "&PerformanceUsedName=" + encodeURIComponent ( this.currentName ) ;
  }
  this._ResetStatisticsNext = false ;
  return new TXml ( TSys.getXml ( url ) ) ;
}
AdminClass.prototype.resetStatistics = function()
{
  this._ResetStatisticsNext = true ;
}
AdminClass.prototype.clearLiveLogs = function()
{
  this.peerLogInfo.clear() ;
  this.peerActionInfo.clear() ;
}
AdminClass.prototype.testConnection = function ( host, port )
{
  var url = TSys.getMainServletName()+"?adminAction=GetStatistics&host=" + host + "&port=" + port ;
//  return TSys.getXml ( url ) ;
  TSys.getXml ( url, function ( HTTP )
  {
log ( "1111111111111111" ) ;
var t = new TTimer ( 5000, function() { log ( "222222222222222" ) ; } ) ;
t.start() ;
  } ) ;
}
AdminClass.prototype.showBasics = function()
{
  try
  {
    var x = this.getStatistics() ;
    if ( this.first )
    {
      this.first = false ;
      this.myHost = x.getContent ( "host" ) ;
      this.myPort = x.getContent ( "port" ) ;
      if ( this.pendingHost2 && this.pendingPort2 )
      {
        var h = this.pendingHost2 ;
        var p = this.pendingPort2 ;
        this.pendingHost2 = null ;
        this.pendingPort2 = null ;
	this.setHostPort ( h, p ) ;
      }
      var a = this.getAvailableNameSpaceList ( "CMan" ) ;
      if ( a.length ) this.PBstartList.setVisible ( true ) ;
      else            this.PBstartList.setVisible ( false ) ;
    }
if ( this.pendingChangeConnectionXml )
{
  var ud = this.pendingChangeConnectionXml ;
  this.pendingChangeConnectionXml = null ;
  this.resetAll() ;
  this.setHostPort ( ud.getContent ( "host" ), ud.getContent ( "port" ) ) ;
}
    var canvasMB = this.formDispatcher.getPeer ( "CANVAS" ) ;
    var performanceUsed = x.getContent ( "PerformanceUsed" ) ;
    var xPerformanceUsedElem = x.get ( "PerformanceUsedElem" ) ;
    if ( canvasMB )
    {
      if ( xPerformanceUsedElem )
      {
        this.formDispatcher.setValues ( xPerformanceUsedElem ) ;
        performanceUsed = xPerformanceUsedElem.getContent ( "PerformanceUsedTimeline" ) ;
        var a = TSys.eval ( performanceUsed ) ;
        canvasMB.setData ( a ) ;
      }
      else
      if ( performanceUsed )
      {
        var a = TSys.eval ( performanceUsed ) ;
        canvasMB.setData ( a ) ;
      }
    }
    var xPerformanceUsedClientElem = x.get ( "PerformanceUsedClientElem" ) ;
    var performanceUsedClient = x.getContent ( "PerformanceUsedClient" ) ;
    var canvas = this.formSubscriberDisplay.getPeer ( "CANVAS" ) ;
    if ( canvas )
    {
      if ( xPerformanceUsedClientElem )
      {
        this.formSubscriber.setValues ( xPerformanceUsedClientElem ) ;
        performanceUsed = xPerformanceUsedClientElem.getContent ( "PerformanceUsedTimeline" ) ;
        var a = TSys.eval ( performanceUsed ) ;
        canvas.setData ( a ) ;
      }
      else
      if ( performanceUsedClient )
      {
        var a = TSys.eval ( performanceUsedClient ) ;
        canvas.setData ( a ) ;
      }
    }

    this._dispatcherId = x.getContent ( "Connections/Dispatcher" ) ;
    this._loggerId = x.getContent ( "Connections/Logger" ) ;

    var en = x.getEnum ( "SUBSCRIBER/row" ) ;
    var toBeRemoved = [] ;
    while ( en.hasNext() )
    {
      var sub = en.nextXml() ;
      if ( sub.getContent ( "SubscriberName" ) == 'CMan' ) toBeRemoved.push ( sub ) ;
    }
    for ( var i = 0 ; i < toBeRemoved.length ; i++ )
    {
      toBeRemoved[i].remove() ;
    }
    toBeRemoved.length = 0 ;

    this.formSubscriber.setValues ( x ) ;
    this.formAdminToolbar.setValues ( x ) ;
    if ( this.currentName )
    {
      var found = false ;
      var xx = x.getXml ( "SUBSCRIBER" ) ;
      var en = xx.getEnum ( "row" ) ;
      while ( en.hasNext() )
      {
        var r = en.nextXml() ;
        if ( r.getContent ( "name" ) == this.currentName )
        {
          found = true ; break ;
        }
      }
      if ( ! found )
      {
        this.formSubscriberDisplay.reset() ;
        this.PBrefreshAxl.setEnabled ( false ) ;
        this.PBreplaceSubscriber.setEnabled ( false ) ;
        this.PBreplaceSubscriber.setVisible ( false ) ;
        this.PBshutdownSubscriber.setEnabled ( false ) ;
        this.PBshutdownSubscriber.setVisible ( false ) ;
        this.currentName = null ;
      }
      var r = this.tableSubscriber.findRow ( "name", this.currentName ) ;
      if ( r ) r.setSelected ( true ) ;
    }
    this.formStatisticSubscriber.setText ( x.getContent ( "SUBSCRIBER_PER_NAME" ) ) ;
    this.formStatisticTasks.setText ( x.getContent ( "TASK_PER_NAME" ) ) ;
    this.formStatisticSteps.setText ( x.getContent ( "STEP_PER_NAME" ) ) ;
    this.formStatisticPendingSubjects.setText ( x.getContent ( "PENDING_SUBJECTS" ) ) ;
    if ( this.connIsNew )
    {
      this.connIsNew = false ;
      var en = new TXEnum ( x.getDom ( "Connections" ), DOM_ELEMENT_NODE ) ;
      while ( en.hasNext() )
      {
        var c = en.nextXml() ;
        this.connections[c.getName()] = c.getContent() ;
      }
    }
/*
    var xMsg = x.getXml ( "MSG" ) ;
    if ( xMsg )
    {
      var en = xMsg.getEnum ( "row" ) ;
      while ( en.hasNext() )
      {
        var xe = en.nextXml() ;
        var xt = xe.getXml ( "Text" ) ;
        if ( xt )
        {
          var Text = xt.getContent() ;
          Text = Text.replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ) ;
          xt.setContent ( "<pre>" + Text + "</pre>" ) ;
        }
        this.tableMSG.addRow ( xe ) ;
      }
    }
*/
    var xCoreInfo = x.getXml ( "CoreInfo" ) ;
    var xGENERAL = x.getXml ( "GENERAL" ) ;
    if ( this.canvasRequestsPerSecond )
    {
      var ps = xCoreInfo.getFloat ( "RequestsPerSecond", 0.0 ) ;
      this.canvasRequestsPerSecond.nextValue ( ps ) ;
    }
    if ( this.canvasStepsPerSecond )
    {
      var ps = xGENERAL.getFloat ( "GlobalStepsPerSecond", 0.0 ) ;
      this.canvasStepsPerSecond.nextValue ( ps ) ;
    }
    if ( this.canvasAverageTaskTime )
    {
      var ps = xGENERAL.getFloat ( "AverageTaskTime", 0.0 ) ;
      this.canvasAverageTaskTime.nextValue ( ps ) ;
    }
    if ( this.showDispatcherAxlPending )
    {
      this.showDispatcherAxl() ;
    }
    if ( this.showLoggerAxlPending )
    {
      this.showLoggerAxl() ;
    }
    var logStr = x.getContent ( "LogInfo" ) ;
    var actionStr = x.getContent ( "ActionInfo" ) ;
    if ( logStr )
    {
      this.peerLogInfo.println ( logStr ) ;
    }
    if ( actionStr )
    {
      this.peerActionInfo.println ( actionStr ) ;
    }
  }
  catch ( exc )
  {
    this.notebookContainer.reset() ;
  }
  this.showDispatcherAxlPending = false ;
  this.showLoggerAxlPending = false ;
}
AdminClass.prototype.dispatcherCallback = function(event)
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var c = ev.getComponent() ;
  var cmd = "" ;
  var ext = "" ;
  if ( c.getName() == "QC.Dispatcher.NetAccessAllowed" )
  {
    cmd = v.getContent ( "QC.Dispatcher.NetAccessAllowed" ) ;
    cmd = "QC.Dispatcher.NetAccessAllowed" ;
  }
  if (  c.getName() == "logActions"
     || c.getName() == "traceMsgOff"
     )
  {
    cmd = "QC.Dispatcher.PB_Trace" ;
    if ( v.getContent ( "Traces/logActions" ) ) cmd += "&logActions=true" ;
    var trace = v.getContent ( "Traces/traceMsgOff" ) ;
    if ( trace == "traceMsg" ) ext += "&traceMsg=true" ;
    else
    if ( trace == "traceMsgOff" ) ext += "&traceMsgOff=true" ;
    else
    if ( trace == "traceMsgShort" ) ext += "&traceMsgShort=true" ;
  }
  if ( c.getName() == "PB_runGarbageCollection" )
  {
    cmd = "PB_runGarbageCollection" ;
  }
  var container = null ;
  if ( c.getName() == "PB_ShowEnvVariables" )
  {
    container = ev.getContainer() ;
    cmd = "PB_ShowEnvVariables" ;
  }
  if ( c.getName() == "PB_ShowDefault" )
  {
    container = ev.getContainer() ;
    cmd = "PB_ShowDefault" ;
  }
  var xstr = "<xml></xml>" ;
  var url = TSys.getMainServletName()+"?adminAction=PutAxl&name=" + this._dispatcherId + "&dispatcher=true&cmd=" + cmd + ext + this.hostPort ;
  var HTTP = TSys.httpPost ( url, xstr ) ;
  if ( HTTP.status != 200 )
  {
    t = TSys.createHttpStatusText ( HTTP ) ;
    if ( t )
    {
      var d = new TUserDialog ( t ) ;
      d.error() ;
    }
    return null ;
  }
  var axl = new TXml ( HTTP.responseXML.documentElement ) ;
  if ( container )
  {
    container.setAxl ( axl ) ;
    return ;
  }
  var index = -1 ;
  var nb = this.formDispatcher.getPeer ( "Notebook.Dispatcher" ) ;
  if ( nb ) index = nb.getSelectedIndex() ;
  this.formDispatcher.setAxl ( axl ) ;
  if ( index >= 0 )
  {
    nb = this.formDispatcher.getPeer ( "Notebook.Dispatcher" ) ;
    nb.select ( index ) ;
  }
}
AdminClass.prototype.loggerCallback = function(event)
{
  var ev = new TEvent ( event ) ;
  var c = ev.getComponent() ;
  this.executeAction ( this._loggerId, c.getName(), ev.getValues() ) ;
}
AdminClass.prototype.executeAction = function ( name, cmd, xml )
{
  if ( ! name ) name = this.currentName ;
  var url = TSys.getMainServletName()+"?adminAction=PutAxl&name=" + name + "&cmd=" + cmd + this.hostPort ;
  var HTTP = TSys.httpPost ( url, xml ) ;
  if ( HTTP.status != 200 )
  {
    t = TSys.createHttpStatusText ( HTTP ) ;
    if ( t )
    {
      var d = new TUserDialog ( t ) ;
      d.error() ;
    }
    return null ;
  }
  var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
/*
if ( cmd == 'ShowJarInfo' )
{
  var w = new TWindow ( xResult ) ;
  w.create() ;
  w.show() ;
}
*/
  return xResult ;
}
AdminClass.prototype.notebookChanged = function(ev)
{
  var nb = ev.getPeer() ;
  var newValue = ev.getNewValue() ;

  var index = nb.indexOf ( "Tab.Dispatcher" ) ;
  if ( index == newValue )
  {
    if ( ! this.tabDispatcherSelectedOnce )
    {
      this.tabDispatcherSelectedOnce = true ;
      this.showDispatcherAxl() ;
    }
  }
  index = nb.indexOf ( "Tab.Logger" ) ;
  if ( index == newValue )
  {
    if ( ! this.tabLoggerSelectedOnce )
    {
      this.tabLoggerSelectedOnce = true ;
      this.showLoggerAxl() ;
    }
  }
}
AdminClass.prototype.showLoggerAxl = function(event)
{
  var axl = this.getAxl ( this._loggerId, "logger=true" ) ;
  this.formLogger.setAxl ( axl ) ;
}
AdminClass.prototype.showDispatcherAxl = function(event)
{
  var axl = this.getAxl ( this._dispatcherId, "dispatcher=true" ) ;
//log ( axl ) ;
  var index = -1 ;
  var nb = this.formDispatcher.getPeer ( "Notebook.Dispatcher" ) ;
  if ( nb ) index = nb.getSelectedIndex() ;
  this.formDispatcher.setAxl ( axl ) ;
  if ( index >= 0 )
  {
    nb = this.formDispatcher.getPeer ( "Notebook.Dispatcher" ) ;
    nb.select ( index ) ;
  }
}
AdminClass.prototype.showAxl = function(event)
{
  var x = this.tableSubscriber.getSelectedUserXml() ;
  var name = x.getContent ( "name" ) ;
  this._showAxl ( name ) ;
}
AdminClass.prototype._showAxl = function ( name )
{
  var index = -1 ;
  if ( name == this.currentName )
  {
    var p = this.formSubscriberDisplay.getPeer ( "NB.SUBSCRIBER" ) ;
    if ( p )
    {
      index = p.getSelectedIndex() ;
    }
  }
  this.currentName = name ;
  var axl = this.getAxl ( name ) ;
//       style='background-color:white;color:black;right:4px;'\n" ) ;
// log ( axl ) ;
  axl.visit (
  {
    visit: function ( x )
    {
      if ( x.getName() == 'Canvas' )
      {
        x.addAttribute ( "width", "300" ) ;
        x.addAttribute ( "ymax", "10000000" ) ;
        x.addAttribute ( "fill-color", "rgba(127,127,127,0.3)" ) ;
        return false ;        
      }
      return true ;
    }
  }) ;
  this.subscriberVersion = axl.getFloat ( "version", 0 ) ;
  var replaceAllowed = axl.getBool ( "replaceAllowed", false ) ;
  if ( replaceAllowed )
  {
    this.PBreplaceSubscriber.setVisible ( true ) ;
    this.PBreplaceSubscriber.setEnabled ( true ) ;
    this.PBshutdownSubscriber.setVisible ( true ) ;
    this.PBshutdownSubscriber.setEnabled ( true ) ;
  }
  else
  {
    this.PBreplaceSubscriber.setVisible ( false ) ;
    this.PBreplaceSubscriber.setEnabled ( false ) ;
    this.PBshutdownSubscriber.setVisible ( false ) ;
    this.PBshutdownSubscriber.setEnabled ( false ) ;
  }
  this.formSubscriberDisplay.setAxl ( axl ) ;
  this.PBrefreshAxl.setEnabled ( true ) ;
  if ( index >= 0 )
  {
    var p = this.formSubscriberDisplay.getPeer ( "NB.SUBSCRIBER" ) ;
    if ( p )
    {
      p.select ( index ) ;
    }
  }
}
AdminClass.prototype.getAxl = function ( name, ext )
{
  var url = TSys.getMainServletName()+"?adminAction=GetAxl&name=" + name + this.hostPort ;
  if ( ext ) url += "&" + ext ;
  return new TXml ( TSys.getXml ( url ) ) ;
}
AdminClass.prototype.putAxl = function ( event )
{
  var ev = new TEvent ( event ) ;
  var pb = ev.getComponent() ;
  var cmd = pb.getName() ;
  var x = this.formSubscriberDisplay.getValues() ;
  var str = x.toString() ;
  var url = TSys.getMainServletName()+"?adminAction=PutAxl&name=" + this.currentName + "&cmd=" + cmd + this.hostPort ;
  var HTTP = TSys.httpPost ( url, str ) ;
  if ( HTTP.status != 200 )
  {
    t = TSys.createHttpStatusText ( HTTP ) ;
    if ( t )
    {
      var d = new TUserDialog ( t ) ;
      d.error() ;
    }
    return null ;
  }
  var xData = new TXml ( HTTP.responseXML.documentElement ) ;
  this.formSubscriberDisplay.setAxl ( xData ) ;
}
AdminClass.prototype.setCanvasRequestsPerSecond = function ( canvas )
{
  this.canvasRequestsPerSecond = canvas ;
}
AdminClass.prototype.setCanvasStepsPerSecond = function ( canvas )
{
  this.canvasStepsPerSecond = canvas ;
}
AdminClass.prototype.setCanvasAverageTaskTime = function ( canvas )
{
  this.canvasAverageTaskTime = canvas ;
}
AdminClass.prototype.newConnection = function(event)
{
  var d = new TWindow ( "Dialog.Admin.New.Connection" ) ;
  d.create() ;
  d.show() ;
}
AdminClass.prototype.newConnectionSave = function(event)
{
  var ev = new TEvent ( event ) ;
  var vals = ev.getValues() ;
  var host = vals.getContent ( "host" ) ;
  var port = vals.getContent ( "port" ) ;
  var title = vals.getContent ( "title" ) ;
  if ( ! title ) title = host + ":" + port ;
  ev.getWindow().closeImediately() ;

  var x = new TXml() ;
  var xx = x.addXml ( "row" ) ;
  xx.addDom ( "host", host ) ;
  xx.addDom ( "port", port ) ;
  xx.addDom ( "title", title ) ;

  var tab = this.windowEditConnections.getPeer ( "CONNECTIONS" ) ;
  tab.addRow ( xx ) ;
}
AdminClass.prototype.newConnectionTest = function(event)
{
  var ev = new TEvent ( event ) ;
  var vals = ev.getValues() ;
  var host = vals.getContent ( "host" ) ;
  var port = vals.getContent ( "port" ) ;
  try
  {
    var w = ev.getWindow() ;
//    w.lock() ;
    var url = TSys.getMainServletName()+"?adminAction=GetStatistics&host=" + host + "&port=" + port ;
    TSys.getXml ( url, function ( HTTP )
    {
//      w.unlock() ;
      if ( HTTP.status != 200 )
      {
        var t = TSys.createHttpStatusText ( HTTP ) ;
        var d = new TUserDialog ( "Host: " + host + "<br/>Port: " + port + "<br/><pre>" + t + "</pre>" ) ;
        d.error ( w ) ;
      }
    } ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( "Host: " + host + "<br/>Port: " + port + "<br/><pre>" + exc + "</pre>" ) ;
    d.error ( ev.getWindow() ) ;
  }
}
AdminClass.prototype.setToDefaultConnection = function()
{
  if ( ! this.myHost || ! this.myPort ) return ;
  this.setHostPort ( this.myHost, this.myPort ) ;
}
AdminClass.prototype.editConnections = function()
{
  if ( this.windowEditConnections ) return ;
  var x = null ;
  try
  {
    x = this.getUserXml ( "Admin.xml" ) ;
  }
  catch ( exc )
  {
  }
  this.windowEditConnections = new TWindow ( "Window.Admin.Connections" ) ;
  this.windowEditConnections.create() ;
  if ( x ) this.windowEditConnections.setValues ( x ) ;
  this.windowEditConnections.show() ;
}
AdminClass.prototype.editConnectionsRemove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var vals = w.getValues() ;
  var tab = w.getPeer ( "CONNECTIONS" ) ;
  var ud = tab.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var d = new TUserDialog ( "Delete selected item?" ) ;
  d.callOnConfirmation ( function() { tab.removeSelectedItem() ; } ) ;
  d.askYesNo() ;
}
AdminClass.prototype.editConnectionsSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var vals = w.getValues() ;
  var tab = w.getPeer ( "CONNECTIONS" ) ;
  var ud = tab.getSelectedUserXml() ;
  if ( ud )
  {
//    this.setHostPort ( ud.getContent ( "host" ), ud.getContent ( "port" ) ) ;
  }
  this.windowEditConnections.closeImediately() ;
  this.saveUserXml ( "Admin.xml", vals ) ;
  this.windowEditConnections = null ;
}
AdminClass.prototype.resetAll = function()
{
  this.tabDispatcherSelectedOnce = false ;
  this.tabLoggerSelectedOnce = false ;
  var indexDispatcher = this.notebook.indexOf ( "Tab.Dispatcher" ) ;
  var indexLogger = this.notebook.indexOf ( "Tab.Logger" ) ;
  var index = this.notebook.getSelectedIndex() ;
  this.notebookContainer.reset() ;
  if ( index == indexDispatcher )
  {
    this.showDispatcherAxlPending = true ;
  }
  if ( index == indexLogger )
  {
    this.showLoggerAxlPending = true ;
  }
}
AdminClass.prototype.editConnectionsApply = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var vals = w.getValues() ;
  var tab = w.getPeer ( "CONNECTIONS" ) ;
  var ud = tab.getSelectedUserXml() ;
  if ( ud )
  {
    this.pendingChangeConnectionXml = ud ;
  }
//  this.windowEditConnections.close() ;
//  this.saveUserXml ( "Admin.xml", vals ) ;
}
AdminClass.prototype.getUserXml = function ( name )
{
  if ( ! name ) throw "TSys.getUserXml: Missing 'name' parameter." ;
  var url = TSys.getDataFactoryUrl()+"&action=GetUserXml&file=" + name ;
  return new TXml ( TSys.getXml ( url ) ) ;
}
AdminClass.prototype.saveUserXml = function ( name, xml )
{
  if ( ! name ) throw "TSys.saveUserXml: Missing 'name' parameter." ;
  if ( ! xml ) throw "TSys.saveUserXml: Missing 'xml' parameter." ;
  if ( this.pendingHost && this.pendingPort )
  {
    var xh = xml.ensureXml ( "host" ) ;
    var xp = xml.ensureXml ( "port" ) ;
    xh.setContent ( this.pendingHost ) ;
    xp.setContent ( this.pendingPort ) ;
  }
  this.pendingHost = null ;
  this.pendingPort = null ;
  var url = TSys.getDataFactoryUrl()+"&action=SaveUserXml&file=" + name ;
  return TSys.httpPost ( url, String ( xml ) ) ;
}
AdminClass.prototype.showServletInfo = function ( event )
{
  var url = TSys.getMainServletName()+"?adminAction=GetServletInfo" ;
  var axl = new TXml ( TSys.getXml ( url ) ) ;
  var w = TGui.getWindow ( "Window.Admin.Servlet.Info" ) ;
  if ( ! w )
  {
    w = new TWindow ( "Window.Admin.Servlet.Info" ) ;
    w.create() ;
    var c = w.getComponent ( "INFO" ) ;
    c.setAxl ( axl ) ;
    w.show() ;
  }
  else
  {
    var c = w.getComponent ( "INFO" ) ;
    c.setAxl ( axl ) ;
  }
} ;
AdminClass.prototype.showServletInfoGC = function ( event )
{
  var url = TSys.getMainServletName()+"?adminAction=GetServletInfo&GC=true" ;
  var axl = new TXml ( TSys.getXml ( url ) ) ;
  var w = TGui.getWindow ( "Window.Admin.Servlet.Info" ) ;
  if ( ! w )
  {
    w = new TWindow ( "Window.Admin.Servlet.Info" ) ;
    w.create() ;
    var c = w.getComponent ( "INFO" ) ;
    c.setAxl ( axl ) ;
    w.show() ;
  }
  else
  {
    var c = w.getComponent ( "INFO" ) ;
    c.setAxl ( axl ) ;
  }
} ;
AdminClass.prototype.getAvailableNameSpaceList = function ( pattern )
{
  if ( ! pattern ) pattern = "*" ;
  var msg = new CoMessage ( "SYS$::LIST_SUBSCRIBER" ) ;
  msg.setXmlData ( "<Name>" + pattern + "</Name>" ) ;
  var xData = Calypso.getXml ( msg ) ;
  if ( ! xData ) return ;

  var en = xData.getEnum ( "SubscriberList", "Subscriber" ) ;
  var l = [] ;

  while ( en.hasNext() )
  {
    var sub = en.next() ;
    var nameSpace = sub.getAttribute ( "nameSpace" ) ;
    if ( ! nameSpace )
    {
      nameSpace = sub.getAttribute ( "NameSpace" ) ;
    }
    if ( ! nameSpace )
    {
      continue ;
    }
    var pos = nameSpace.indexOf ( "::" ) ;
    if ( pos > 0 )
    {
      nameSpace = nameSpace.substring ( 0, pos ) ;
    }
    l.push ( nameSpace ) ;
  }
  return l ;
} ;
var Admin = new AdminClass() ;

/**
 *  @constructor
 */
var URClient = function()
{
}
URClient.prototype =
{
  getSessions: function()
  {
    var msg = new CoMessage ( "URSERVER.REQUEST" ) ;
    msg.setXmlData ( "<URSERVER.REQUEST><Operation>GetSessionList</Operation></URSERVER.REQUEST>" ) ;
    var x = Calypso.getXml ( msg ) ;
    if ( ! x ) return ;
    var xx = x.getXml ( "URSERVER.RESULT/xml" ) ;
    return xx ;
/*
  var url = TSys.getMainServletName()+"?adminAction=GetWebSessionXml" + this.hostPort ;
  return new TXml ( TSys.getXml ( url ) ) ;
*/
  }
} ;
/**
 *  @constructor
 */
function NetResource_fireEvent ( eventName, uniqueId, selectId )
{
  NRX.fireEvent ( eventName, uniqueId, selectId ) ;
}
/**
 *  @constructor
 */
var NRXClass = function()
{
}
NRXClass.prototype.fireEvent = function ( eventName, uniqueId, selectId )
{
  var msg = new CoMessage ( "NETRESOURCE.REQUEST" ) ;
  msg.setHost ( Admin.getHost() ) ;
  msg.setPort ( Admin.getPort() ) ;

  var type = null ;
  if ( selectId )
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
NRXClass.prototype.auditlog = function ( auditEvent )
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
var NRX = new NRXClass() ;
