<%@ page contentType="text/html; charset=UTF-8" language="java" errorPage="" import="websquare.logging.util.*,websquare.util.*,java.util.*, javax.servlet.http.HttpServletResponse"
%><%

try {   
    response.setContentType("application/json");
    System.out.println( "====> start~" );
    Thread.sleep( 3000 );
    
%>

{
    "dataList1":[
        {"col2":111,"col3":"aaa"}
        ,{"col1":"BBB","col2":222,"col3":"bbb"}
        ,{"col1":"CCC","col2":333,"col3":"ccc"}
        ,{"col1":"DDD","col2":444,"col3":"ddd"}
        ,{"col1":"EEE","col2":555,"col3":"eee"}
    ],
    "dataList2":[
        {"col1":"xxx","col2":111,"col3":"aaa"}
        ,{"col1":"BBB","col2":222,"col3":"bbb"}
        ,{"col1":"CCC","col2":333,"col3":"ccc"}
        ,{"col1":"DDD","col2":444,"col3":"ddd"}
        ,{"col1":"EEE","col2":555,"col3":"eee"}
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