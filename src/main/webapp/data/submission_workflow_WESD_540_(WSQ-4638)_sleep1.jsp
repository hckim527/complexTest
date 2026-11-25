<%@ page contentType="text/html; charset=UTF-8" language="java" errorPage="" import="websquare.logging.util.*,websquare.util.*,java.util.*, javax.servlet.http.HttpServletResponse"
%><%

try {   
    response.setContentType("application/json");
    System.out.println( "====> start~" );
    Thread.sleep( 500 );
    
%>

{"dltList33": [
{
    "id":"A0001",
    "hobby":"수영",
    "etc":"수영 선수..."
}, {
    "id":"A0002",
    "hobby":"등산",
    "etc":"달리기 동호회..."
}, {
    "id":"A0003",
    "hobby":"낚시",
    "etc":"일반인 ..."
}
]}

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