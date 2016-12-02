function execute ( ctx, p1 )
{
  var customerId = args.get ( 0 ) ;
  var offset = 0 ;
  var limit = 5 ;
  var resourcesValuePattern = null ;
  if ( args.size() > 1 ) offset = parseInt ( args.get ( 1 ) ) ;
  if ( args.size() > 2 ) limit = parseInt ( args.get ( 2 ) ) ;
  if ( args.size() > 3 ) resourcesValuePattern = args.get ( 3 ) ;

  if ( isNaN ( offset ) ) offset = 0 ;
  if ( isNaN ( limit ) ) limit = 5 ;

  var max = offset + limit ;
//println ( "customerId=" + customerId ) ;
//println ( "resourcesValuePattern=>" + resourcesValuePattern + "<" ) ;
  var u = ctx.user ;
  var ukey = u.getIntegerUid() ;
  var stmt = ctx.createStatement() ;

  var where = "" ;
  if ( resourcesValuePattern && resourcesValuePattern.length() > 0 )
  {
    if ( resourcesValuePattern.indexOf ( "%" ) >= 0 )
    {
      where = " value like '" + resourcesValuePattern + "' AND " ;
    }
    else
    {
      where = " value='" + resourcesValuePattern + "' AND " ;
    }
  }
  var SQL = "select * from ( select VALUE, RESOURCESID, ROWNUM rnum from RESOURCES\n"
          + "  where " + where + " partnerid=" + customerId + " and modified_at is null and rownum<=" + max + "\n"
	  + " ) where rnum>" + offset
	  ;

//println ( "SQL=" + SQL ) ;
  var rset = stmt.executeQuery ( SQL ) ;
  var xResult = ctx.xResults.add ( "resourcesList" ) ;
  ctx.addToBeClosed ( rset ) ;
  while ( rset.next() )
  {
    var VALUE = rset.getString ( 1 ) ;
    var RESOURCESID = rset.getString ( 2 ) ;
    var row = xResult.add ( "resource" ) ;
    row.add ( "resourceValue", VALUE ) ;
    row.add ( "resourceId", RESOURCESID ) ;
    var xChargesList = row.add ( "chargesList" ) ;
    addCharges ( ctx, RESOURCESID, xChargesList ) ;
  }
  ctx.close ( rset ) ;
}
function addCharges ( ctx, RESOURCESID, xChargesList )
{
var SQL = "select\n"
+"  a.invoiceproductbundleid\n"
+", b.invoiceproductbundlecode\n"
//+", c.productbundleid\n"
//+", c.productbundlecode\n"
//+", d.productcode\n"
//+", d.PRICEMODELID\n"
//+", f.priceruleid\n"
//+", g.priceparamid\n"
+", g.value\n"
+", d.name \"productname\"\n"
+", a.valid_from\n"
+", a.valid_to\n"
+"from\n"
+"  SUBSCRPTIONRESOURCES a\n"
+", INVOICEPRODUCTBUNDLE b\n"
+", productbundle c\n"
+", product d\n"
+", pricemodel e\n"
+", pricerule f\n"
+", priceparam g\n"
+"where a.resourcesid=" + RESOURCESID + "\n"
+"and a.modified_at is null\n"
+"and a.invoiceproductbundleid=b.invoiceproductbundleid\n"
+"and b.modified_at is null\n"
+"and c.productbundleid=b.productbundleid and c.modified_at is null\n"
+"and d.productbundleid=c.productbundleid and d.modified_at is null\n"
+"and d.producttypeid=1\n"
+"and d.pricemodelid=e.pricemodelid and e.modified_at is null\n"
+"and f.pricemodelid=e.pricemodelid and f.modified_at is null\n"
+"and g.priceruleid=f.priceruleid and g.modified_at is null and g.valid_to is null\n"
;
  
  var stmt = ctx.createStatement() ;
  var rset = stmt.executeQuery ( SQL ) ;
  ctx.addToBeClosed ( rset ) ;
  while ( rset.next() )
  {
    var row = xChargesList.add ( "charge" ) ;
    row.add ( "serviceChargeId", ctx.plugin.convertSQLResultToString ( rset, 1 ) ) ;
    row.add ( "serviceChargeCode", ctx.plugin.convertSQLResultToString ( rset, 2 ) ) ;
    row.add ( "serviceChargeValue", ctx.plugin.convertSQLResultToString ( rset, 3 ) ) ;
    row.add ( "serviceChargeName", ctx.plugin.convertSQLResultToString ( rset, 4 ) ) ;
    row.add ( "serviceChargeStartDate", ctx.plugin.convertSQLResultToString ( rset, 5 ) ) ;
    row.add ( "serviceChargeEndDate", ctx.plugin.convertSQLResultToString ( rset, 6 ) ) ;
  }
  ctx.close ( rset ) ;
}
/*
select  a.invoiceproductbundleid
, b.invoiceproductbundlecode
, c.productbundleid
, c.productbundlecode
, c.name "PB Name"
, d.productcode
, d.name "Product Name"
, d.PRICEMODELID
, f.priceruleid
, g.priceparamid
, g.value
from
  SUBSCRPTIONRESOURCES a
, INVOICEPRODUCTBUNDLE b
, productbundle c
, product d
, pricemodel e
, pricerule f
, priceparam g
where a.resourcesid=5009421
and a.modified_at is null
and a.invoiceproductbundleid=b.invoiceproductbundleid
and b.modified_at is null
and c.productbundleid=b.productbundleid and c.modified_at is null
and d.productbundleid=c.productbundleid and d.modified_at is null
and d.producttypeid=1
and d.pricemodelid=e.pricemodelid and e.modified_at is null
and f.pricemodelid=e.pricemodelid and f.modified_at is null
and g.priceruleid=f.priceruleid and g.modified_at is null and g.valid_to is null
;

*/
