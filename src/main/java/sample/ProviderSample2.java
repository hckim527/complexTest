package sample;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import websquare.http.controller.datalist.load.AbstractDataListLoad;

public class ProviderSample2 extends AbstractDataListLoad {
	
    public String getData() throws Exception {
    	System.out.println("@@@@@@@@@@@@@@@@@@@@@ 직접구현한 DataListUploadImpl2");
    	
        // DataListInfo 객체에서 필요한 정보를 꺼냄
        String dataListId = dataListInfo.getDataListId();
        String columnInfoStr = dataListInfo.getColumnInfo();
        Object optionParam = dataListInfo.getOptionParam();

        // JSON 파싱
        JSONParser parser = new JSONParser();
        JSONArray columnInfo = (JSONArray) parser.parse(columnInfoStr);
        
        System.out.println("@@@@@@@@@@@@@@ dataListId : " + dataListId);
        System.out.println("@@@@@@@@@@@@@@ columnInfo : " + columnInfo.toJSONString());
        if (optionParam instanceof String) {
            System.out.println("@@@@@@@@@@@@@@ optionParam : " + (String) optionParam);
        } else if (optionParam instanceof JSONObject) {
            System.out.println("@@@@@@@@@@@@@@ optionParam : " + ((JSONObject) optionParam).toJSONString());
        } else {
            System.out.println("@@@@@@@@@@@@@@ optionParam is of an unknown type.");
        }

        // 트랜잭션 ID 생성
        String transactionId = UUID.randomUUID().toString();
        setTransactionId(transactionId);
        
        System.out.println("@@@@@@@@@@@@@@ transactionId : " + getTransactionId());

        // DB에서 데이터를 조회하는 비즈니스 로직 구현
//        String data = 
//                "<list>" +
//                    "<map><col1>11</col1><col2>11</col2><col3>11</col3></map>" +
//                    "<map><col1>22</col1><col2>22</col2><col3>22</col3></map>" +
//                    "<map><col1>33</col1><col2>33</col2><col3>33</col3></map>" +
//                    "<map><col1>44</col1><col2>44</col2><col3>44</col3></map>" +
//                    "<map><col1>55</col1><col2>55</col2><col3>55</col3></map>" +
//                    "<map><col1>66</col1><col2>66</col2><col3>66</col3></map>" +
//                "</list>";   
//        String data = 
//                "<list>"
//	                + "<map>"
//		                + "<sETC6>8935</sETC6>"
//		                + "<sETC5>7257</sETC5>"
//		                + "<sETC8>6599</sETC8>"
//		                + "<sETC7>1233</sETC7>"
//		                + "<sETC2>100-055-564</sETC2>"
//		                + "<sETC1>2000</sETC1>"
//		                + "<sETC4>6391</sETC4>"
//		                + "<sETC3>테스트1</sETC3>"
//		                + "<nDateType>1</nDateType>"
//		                + "<sETC9>6026</sETC9>"
//		                + "<sETC10>2348</sETC10>"
//		                + "<sDesc>신정</sDesc>"
//		                + "<sETC11>2348</sETC11>"
//		                + "<sETC12>3584</sETC12>"
//		                + "<sETC13>2036</sETC13>"
//		                + "<sETC14>2863</sETC14>"
//		                + "<sDate>20010101</sDate>"
//		                + "<sETC15>6178</sETC15>"
//		                + "<sETC16>130</sETC16>"
//		                + "<sETC17>6597</sETC17>"
//	                + "</map>"
//                + "</list>";   
    	
//    	StringBuilder xmlBuilder = new StringBuilder();
//    	xmlBuilder.append("<list>");
//
//    	for (int i = 1; i <= 100000; i++) {
//    	    xmlBuilder.append("<map>");
//    	    xmlBuilder.append("<col1>").append(i).append("</col1>");
//    	    xmlBuilder.append("<col2>").append(i).append("</col2>");
//    	    xmlBuilder.append("<col3>").append(i).append("</col3>");
//    	    xmlBuilder.append("</map>");
//    	}
//
//    	xmlBuilder.append("</list>");
//
//    	String data = xmlBuilder.toString();
        
        
        
        StringBuilder xmlBuilder = new StringBuilder();
        
        try {
	        // InputStream을 사용하여 JSON 파일 읽기
	        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/jsonData1000.json");
	        InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
	        BufferedReader bufferedReader = new BufferedReader(reader);
	
	        // 첫 번째 줄을 읽고, BOM이 있는 경우 제거
	        String firstLine = bufferedReader.readLine();
	        if (firstLine != null && firstLine.startsWith("\uFEFF")) {
	            firstLine = firstLine.substring(1);  // BOM 제거
	        }
	        StringBuilder jsonContent = new StringBuilder(firstLine);
	        String line;
	        while ((line = bufferedReader.readLine()) != null) {
	            jsonContent.append(line);
	        }
	        bufferedReader.close();
	        // JSON 파싱
	        JSONArray jsonArray = (JSONArray) parser.parse(jsonContent.toString());
	
	        xmlBuilder.append("<list>");
	        // 각 JSON 객체를 순회하면서 XML 구조로 변환
            for (Object obj : jsonArray) {
                JSONObject jsonObject = (JSONObject) obj;

                xmlBuilder.append("<map>");
                // columnInfo에 정의된 순서대로 처리
                for (Object columnObj : columnInfo) {
                    JSONObject column = (JSONObject) columnObj;
                    String columnName = (String) column.get("id");

                    // 각 Key와 Value를 XML 태그로 변환
                    xmlBuilder.append("<").append(columnName).append(">")
                              .append(jsonObject.getOrDefault(columnName, "")) // Key에 맞는 Value 가져오기, 없으면 빈 문자열
                              .append("</").append(columnName).append(">");
                }
                xmlBuilder.append("</map>");
            }

            xmlBuilder.append("</list>");
        } catch (Exception e) {
            e.printStackTrace();
        }
    
        String data = xmlBuilder.toString();
        
        
    	return data;
    }
}