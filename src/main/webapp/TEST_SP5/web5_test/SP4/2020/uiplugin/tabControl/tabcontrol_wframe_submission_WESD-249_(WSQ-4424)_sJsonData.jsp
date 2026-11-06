<%@ page contentType="application/json; charset=utf-8" language="java" errorPage="" import="websquare.util.*,org.w3c.dom.*,java.util.*,java.net.*,java.io.BufferedReader,java.io.*,org.json.simple.*"
%><%
		try{
			Thread.sleep(5000);
		}catch(Exception e) {
			out.println(e);			
		}
		response.setHeader("Content-Type", "application/json;charset=utf-8");
		out.println("{\"jsondata\":"+ "" +"}");
%>