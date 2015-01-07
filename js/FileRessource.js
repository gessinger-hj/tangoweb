Tango.include ( "TSpecialWindows" ) ;
/**
 *  @constructor
 */
var FileRessource = function ( base )
{
  this.forceGet = true ;
  this.base = base ? base : "" ;
}
FileRessource.prototype =
{
  setBase: function ( base )
  {
    this.base = base ? base : "" ;
  },
  createMessage: function()
  {
    var msg = new CoMessage ( "FILE.RESSOURCE" ) ;
    return msg ;
  },
  getFileText: function ( file, plain )
  {
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetFile</Operation>"
                   + "<File>" + file + "</File>"
                   + "<Text>true</Text>"
                   + ( this.base ? "<Base>" + this.base + "</Base>" : "" )
                   + ( plain ? "<Plain>true</Plain>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var x = Calypso.getXml ( msg ) ;
    if ( ! x ) return ;
    return x.getContent ( "FILE.RESSOURCE.RESULT/FileContent" ) ;
  },
  getFileInfo: function ( file, plain )
  {
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetFile</Operation>"
                   + "<File>" + file + "</File>"
                   + "<Info>true</Info>"
                   + ( this.base ? "<Base>" + this.base + "</Base>" : "" )
                   + ( plain ? "<Plain>true</Plain>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var x = Calypso.getXml ( msg ) ;
    if ( ! x ) return ;
    return x.getXml ( "FILE.RESSOURCE.RESULT/FileInfo" ) ;
  },
  downloadFile: function ( file, plain )
  {
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetFile</Operation>"
                   + "<File>" + file + "</File>"
                   + ( this.base ? "<Base>" + this.base + "</Base>" : "" )
                   + ( plain ? "<Plain>true</Plain>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    Calypso.downloadDocument ( msg ) ;
  },
  _buildRessourceUrl: function ( file )
  {
    var msg = this.createMessage() ;
    msg.setReturnFromArgs ( true ) ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetFile</Operation>"
                   + "<File>" + file + "</File>"
                   + ( this.base ? "<Base>" + this.base + "</Base>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var sMsg = encodeURIComponent ( msg.toString() ) ;
    var url = Calypso.tsActionServletName + "?coAction=GetInputStream" ;
    if ( this.forceGet )
    {
      url += "&counter=" + TSys.getCounter() ;
    }
    url += "&msg=" + sMsg ;
    return url ;
  },
  buildImgString: function ( file )
  {
    return "<img src='" + this._buildRessourceUrl ( file ) + "' onmousedown='return false;'/>" ;
  },
  buildImgSrcString: function ( file )
  {
    return this._buildRessourceUrl ( file ) ;
  },
  getAvailableFiles: function ( base, self, method )
  {
    if ( ! base ) base = this.base ;
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetAvailableFiles</Operation>"
                   + ( base ? "<Base>" + base + "</Base>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    if ( self )
    {
      Calypso.getXml ( msg, self, method ) ;
      return ;
    }
    var x = Calypso.getXml ( msg ) ;
    return x ;
  },
  getAvailableImageFiles: function ( pattern, base, self, method )
  {
    if ( ! base ) base = this.base ;
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetAvailableImageFiles</Operation>"
                   + ( base ? "<Base>" + base + "</Base>" : "" )
                   + ( pattern ? "<Pattern>" + pattern + "</Pattern>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;

    if ( self )
    {
      Calypso.getXml ( msg, self, method ) ;
      return ;
    }
    var x = Calypso.getXml ( msg ) ;
    return x ;
  },
  uploadFile: function ( base )
  {
    if ( ! base ) base = this.base ;
    var w = new TUploadWindow() ;
    w.setTaskName ( "FILE.RESSOURCE" ) ;
/*
  w.addUploadAttribute ( "AttributeName-1", "AttributeValue-1" ) ;
  w.addUploadAttribute ( "AttributeName-2", "AttributeValue-2" ) ;
  w.addUploadAttribute ( "AttributeName=-2", "AttributeValue=-2" ) ;
*/
    w.setMsgXmlData ( "<xml>"
                    + "<FILE.RESSOURCE.REQUEST>"
                    + "<Operation>UPLOAD</Operation>"
                    + ( base ? "<Base>" + base + "</Base>" : "" )
                    + "</FILE.RESSOURCE.REQUEST>"
                    + "</xml>"
                    ) ;
    w.create() ;
    w.show() ;
    return w ;
  },
  uploadImageFile: function ( base )
  {
    if ( ! base ) base = this.base ;
    var w = new TUploadWindow() ;
    w.setTaskName ( "FILE.RESSOURCE" ) ;
/*
  w.addUploadAttribute ( "AttributeName-1", "AttributeValue-1" ) ;
  w.addUploadAttribute ( "AttributeName-2", "AttributeValue-2" ) ;
  w.addUploadAttribute ( "AttributeName=-2", "AttributeValue=-2" ) ;
*/
    w.setMsgXmlData ( "<xml>"
                    + "<FILE.RESSOURCE.REQUEST>"
                    + "<Operation>UPLOAD.IMAGE.FILE</Operation>"
                    + ( base ? "<Base>" + base + "</Base>" : "" )
                    + "</FILE.RESSOURCE.REQUEST>"
                    + "</xml>"
                    ) ;
    w.setTitle ( "Image Import..." ) ;
    w.setTopLineText ( "Please select an image file and press <b>Import</b>" ) ;
    w.setButtonUploadText ( "Import" ) ;
    w.create() ;
    w.addActionListener ( this,this._actionSubmit ) ;
    w.show() ;
    return w ;
  },
  _actionSubmit: function ( ev )
  {
    var w = ev.getPeer() ;
    var f = w.getUploadFile() ;
    var isImage = this.isImageFile ( f ) ;
    if ( ! isImage )
    {
      var d = new TUserDialog ( "The choosen file is <b>not</b> an image."
                               , "Image Import..."
                               ) ;
      d.error ( w ) ;
      return false ;
    }
    return true ;
  },
  isImageFile: function ( fileName )
  {
    var FILE = fileName.toUpperCase() ;
    if ( FILE.endsWith ( ".PNG"  ) ) return true ;
    if ( FILE.endsWith ( ".GIF"  ) ) return true ;
    if ( FILE.endsWith ( ".JPG"  ) ) return true ;
    if ( FILE.endsWith ( ".JPEG" ) ) return true ;
    if ( FILE.endsWith ( ".BMP" ) ) return true ;
    if ( FILE.endsWith ( ".JPE" ) ) return true ;
    return false ;
  },
  saveXmlFile: function ( xml, fileName, base )
  {
    if ( ! base ) base = this.base ;
    if ( ! fileName ) throw "Fileressource.saveXmlFile(): Missing 'fileName'." ;
    if ( ! xml ) throw "Fileressource.saveXmlFile(): Missing 'xml'." ;

    if ( typeof ( xml ) == 'string' )
    {
    }
    else
    if ( typeof ( xml ) == 'object' && xml.jsClassName && xml.jsClassName == 'TXml' )
    {
      xml = xml.toString() ;
    }
    else
    {
      throw "Fileressource.saveXmlFile(): Invalid 'xml':\n" + String ( xml ) ;
    }
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>SaveXmlFile</Operation>"
                   + "<File>" + fileName + "</File>"
                   + ( base ? "<Base>" + base + "</Base>" : "" )
                   + xml
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var x = Calypso.getXml ( msg ) ;
  },
  getXmlFile: function ( fileName, base )
  {
    if ( ! base ) base = this.base ;
    if ( ! fileName ) throw "Fileressource.saveXmlFile(): Missing 'fileName'." ;
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>GetXmlFile</Operation>"
                   + "<File>" + fileName + "</File>"
                   + ( base ? "<Base>" + base + "</Base>" : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var x = Calypso.getXml ( msg ) ;
    if ( x )
    {
      return x.getXml ( "FILE.RESSOURCE.RESULT/xml" ) ;
    }
    return null ;
  },
  execute: function ( operation, xml )
  {
    var msg = this.createMessage() ;
    msg.setXmlData ( "<FILE.RESSOURCE.REQUEST>"
                   + "<Operation>" + operation + "</Operation>"
                   + ( this.base ? "<Base>" + this.base + "</Base>" : "" )
                   + ( xml ?  "" + xml : "" )
                   + "</FILE.RESSOURCE.REQUEST>"
                   ) ;
    var x = Calypso.getXml ( msg ) ;
    return x ;
  }
}

