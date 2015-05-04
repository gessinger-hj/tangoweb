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
  },
  createHttpStatusText: function ( HTTP )
  {
    if ( HTTP.status == 200 ) return null ;
    return "(" + HTTP.statusText + ": " + HTTP.status + ")" ;
  }
};
if ( !Function.prototype.bind )
{
  Function.prototype.bind = function()
  {
    var method = this, args = WWHelper.toArray(arguments), object = args.shift();
    return function() { 
      return method.apply(object, args.concat(WWHelper.toArray(arguments)));
    };
  };
}
EventWorker =
{
  pullEvents: function ( url, xml )
  {
    var p = { status: "NOK" } ;
    try
    {
      var HTTP = WWHelper.httpPost ( url, xml ) ;
      var p = { status: HTTP.status } ;
      if ( HTTP.status != 200 )
      {
        if ( HTTP.status != 412 )
        {
          p.statusText = WWHelper.createHttpStatusText ( HTTP ) ;
          self.postMessage ( JSON.stringify ( p ) ) ;
          return ;
        }
      }
      p.responseText = HTTP.responseText ;
      self.postMessage ( JSON.stringify ( p ) ) ;
    }
    catch ( exc )
    {
      p.statusText = String ( exc ) ;
      self.postMessage ( JSON.stringify ( p ) ) ;
    }
    return ;
  }
} ;
self.onmessage = function ( event )
{
  var param = event.data ;
  var param = JSON.parse ( event.data ) ;
  if ( param.cmd === "pullEvents" )
  {
    EventWorker.pullEvents ( param.url, param.xml ) ;
  }
  else
  if ( param.cmd === "stop" )
  {

  }
  else
  if ( param.cmd === "terminate" )
  {
  }
};
