<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	Thread.sleep(3000);
	String num = "'1111";
	String result = "asdf";

	String json = "{\"num\" :" + num + ",\"msg\" :" + result + "}";
	out.print(json);

%>
