<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%

try {

    Thread.sleep( 2000);

    out.print("{\"dataList1\":[{\"col1\":\"w1_1\",\"col2\":\"w1_2\",\"col3\":\"w1_3\"},{\"col1\":\"w1_4\",\"col2\":\"w1_5\",\"col3\":\"w1_6\"},{\"col1\":\"w1_7\",\"col2\":\"w1_8\",\"col3\":\"w1_9\"}],\"dataList11\":[{\"col1\":\"d1_1\",\"col2\":\"d1_2\",\"col3\":\"d1_3\"},{\"col1\":\"d1_4\",\"col2\":\"d1_5\",\"col3\":\"d1_6\"},{\"col1\":\"d1_7\",\"col2\":\"d1_8\",\"col3\":\"d1_9\"}],\"dataMap1\":{\"key1\":\"w1_kk1\",\"key2\":\"w1_kk2\",\"key3\":\"w1_kk3\"},\"dataMap11\":{\"key1\":\"d1_kk1\",\"key2\":\"d1_kk2\",\"key3\":\"d1_kk3\"},\"wholiday\":[{\"col1\":\"20160215\"},{\"col1\":\"20160216\"},{\"col1\":\"20160217\"},{\"col1\":\"20160218\"},{\"col1\":\"20160219\"}],\"mholiday\":[{\"col1\":\"20160205\"},{\"col1\":\"20160206\"},{\"col1\":\"20160207\"},{\"col1\":\"20160208\"},{\"col1\":\"20160209\"}]}");

} catch (Throwable e) {
    System.out.println( "데이터 처리중 에러 발생.." + e );
}%>