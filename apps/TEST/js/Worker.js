//importScripts("file1.js", "file2.js");
var _isRunning = false ;
var _intervalId = undefined ;
WWHelper =
{
  httpPost: function ( url, parameter )
  {
    var HTTP = new XMLHttpRequest() ;
    HTTP.open ( "POST", url, false ) ;
    if ( ! parameter )
    {
      HTTP.send ( "dummy" ) ;
    }
    else
    {
      if ( typeof ( parameter ) != "string" ) parameter = String ( parameter ) ;
      HTTP.send ( parameter ) ;
    }
    return HTTP ;
  },
  toArray: function ( iterable )
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
  }       
};
if ( !Function.prototype.bind )
{
  Function.prototype.bind = function()
  {
    var method = this, args = WWHelper.toArray(arguments), object = args.shift();
    return function() { 
      return method.apply(object, args.concat(WWHelper.toArray(arguments)));
    }
  };
}
self.onmessage = function(event)
{
  var str = event.data ;
  var obj = event.data ;
  if ( obj && typeof ( obj ) == "object" )
  {
    if ( obj.action == "start" ) str = obj.action ;
    else
    if ( obj.action == "stop" ) str = obj.action ;
    else
    if ( obj.action == "http" )
    {
      if ( obj.msg && typeof ( obj.msg ) == "string" )
      {
        var HTTP = WWHelper.httpPost ( obj.url, obj.msg ) ;
        p = { result:"http", mimeType: "text/xml", status: HTTP.status, text: HTTP.responseText } ;
        self.postMessage ( p ) ;
      }
      return ;
    }
  }
  if ( str == "start" )
  {
    if ( _isRunning )
    {
      self.postMessage ( "ALready running." ) ;
      return ;
    }
    _isRunning = true ;
    _intervalId = self.setInterval ( function()
    {
      self.postMessage ( "" + new Date() ) ;
    }, 1000 );
  }
  else
  if ( str == "stop" )
  {
    if ( ! _isRunning )
    {
      self.postMessage ( "Not running." ) ;
      return ;
    }
    _isRunning = false ;
    var id = _intervalId ;
    _intervalId = undefined ;
    self.clearInterval ( id ) ;
  }
  else
  {
    var t = "Hello, " + str + "!" ;
    self.postMessage ( t ) ;
  }
};
