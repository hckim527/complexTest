<%@ page contentType="text/html; charset=UTF-8" session="false" %>

<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.util.zip.*"%><%


  ServletOutputStream  os   = null;
  OutputStream bos  = null;  

	long start =  System.currentTimeMillis();
	long before = start;
	long after = start;

	try{
    	String mediatype = "text/html; charset=UTF-8";
	    os = response.getOutputStream();
	    String ae = request.getHeader( "Accept-Encoding" );
		after = System.currentTimeMillis();
		bos = new BufferedOutputStream(os);
        response.setContentType( mediatype );    
		String  data = "10000,20000,30000,40000,50000,60000,70000,80000,90000,100000";
        for( int k = 0 ; k < 10; k++ ) {
        	if( k > 0 ) {
				bos.write(",".getBytes());
			}
        	bos.write(data.getBytes());
        }

        //System.out.println( "result [" + result + "]" );
        //os = response.getOutputStream();
        //bos = new BufferedOutputStream(os);

	} catch( Exception e ) {
		e.printStackTrace();
	} finally {
		try { 
			if ( bos != null ) { 
				bos.flush(); 
			} 
		} catch ( IOException e ) {}
	    try { if ( bos != null ) { bos.close(); } } catch ( IOException e ) {}
	}
%>