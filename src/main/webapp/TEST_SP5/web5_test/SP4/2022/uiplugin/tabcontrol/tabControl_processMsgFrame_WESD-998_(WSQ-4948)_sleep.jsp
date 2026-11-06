<%@ page contentType="text/html; charset=UTF-8" language="java" errorPage="" import="websquare.logging.util.*,websquare.util.*,java.util.*, javax.servlet.http.HttpServletResponse"
%><%

try {   
    response.setContentType("application/json");
    System.out.println( "====> start~" );
    Thread.sleep( 2000 );
    
%>

{
    "dlt_excel":[
        {"chk_col":"0","menuCd":"202102241"}
        ,{"chk_col":"0","menuCd":"202102242"}
        ,{"chk_col":"0","menuCd":"202102243"}
        ,{"chk_col":"0","menuCd":"202102244"}
        ,{"chk_col":"0","menuCd":"202102245"}
    ]
}

<%
    System.out.println( "====> end~" );
//     response.setContentType("text/html");  
//     response.setCharacterEncoding("UTF-8");
    //PrintWriter out = response.getWriter();
//     out.print("<html><head>");
//     out.print("<script type=\"text/javascript\">alert(\"sleep end\");</script>");
    //response.getWriter().write("<script type=\"text/javascript\">alert(\"sleep end\");</script>");
//     out.print("</head></html>");
//     out.flush();
} catch (Throwable e) {
System.out.println( "====> here em" );
}%>