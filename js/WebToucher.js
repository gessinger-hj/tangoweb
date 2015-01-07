//importScripts("file1.js", "file2.js");
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
    };
  };
}
WebToucher =
{
  _intervalId: undefined,
  _url: undefined,
  _counter: undefined,
  start: function ( url, millis )
  {
    if ( this._intervalId ) return ;
    this._counter = new Date().getTime() ;
    this._url = url ;
    var thiz = this ;
    this._intervalId = self.setInterval ( function()
    {
      try
      {
        var HTTP = thiz.touchHome() ;
        if ( HTTP.status == 0 ) return ;
        if ( thiz.markForLogout )
        {
          thiz.stop() ;
          self.postMessage ( { cmd:"logout" } ) ;
          return ;
        }
        if ( HTTP.status != 200 )
        {
          thiz.stop() ;
          self.postMessage ( { cmd:"logout" } ) ;
        }
      }
      catch ( exc )
      {
        thiz.stop() ;
      }
    }, millis );
  },
  stop: function()
  {
    var id = this._intervalId ;
    this._intervalId = undefined ;
    if ( ! id ) return ;
    self.clearInterval ( id ) ;
  },
  touchHome: function()
  {
    this._counter++ ;
    var u = this._url + "&counter=" + this._counter + "&origin=worker" ;
    return WWHelper.httpPost ( u ) ;
  }
} ;
self.onmessage = function(event)
{
  var p = event.data ;
  var millis = p.millis ;
  if ( typeof ( millis ) != "number" ) millis = 10000 ;
  if ( millis <= 4000 ) millis = 4000 ;
  if ( p.cmd == "markForLogout" )
  {
    WebToucher.markForLogout = true ;
  }
  else
  if ( p.cmd == "start" )
  {
    WebToucher.start ( p.url, millis ) ;
  }
  else
  if ( p.cmd == "stop" )
  {
    WebToucher.stop() ;
  }
};
