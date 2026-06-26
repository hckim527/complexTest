package sample;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import websquare.http.controller.datalist.load.AbstractDataListLoad;

public class ProviderSample3 extends AbstractDataListLoad {
	
    public String getData() throws Exception {
    	System.out.println("@@@@@@@@@@@@@@@@@@@@@ 직접구현한 DataListUploadImpl3");
    	
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
//        String data = "["
//        		+ "\"11\",\"11\",\"11\",\"22\",\"22\",\"22\","
//        		+ "\"33\",\"33\",\"33\",\"44\",\"44\",\"44\","
//        		+ "\"55\",\"55\",\"55\",\"66\",\"66\",\"66\""
//        		+ "]";
    	
//    	StringBuilder arrayBuilder = new StringBuilder();
//    	arrayBuilder.append("[");
//    	for (int i = 1; i <= 100000; i++) {
//    	    arrayBuilder.append("\"").append(i).append("\",");
//    	    arrayBuilder.append("\"").append(i).append("\",");
//    	    arrayBuilder.append("\"").append(i).append("\",");
//    	}
//    	// 마지막 쉼표 제거
//    	if (arrayBuilder.length() > 1) {
//    	    arrayBuilder.setLength(arrayBuilder.length() - 1);
//    	}
//    	arrayBuilder.append("]");
//    	String data = arrayBuilder.toString();
        
        
        // JSON 파일 읽기
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/arrayData1000.json");
        if (inputStream == null) {
            throw new Exception("JSON file not found");
        }

        InputStreamReader inputStreamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

        // 파일 내용을 String으로 변환
        String data = bufferedReader.lines().collect(Collectors.joining(System.lineSeparator()));

        bufferedReader.close();

        // BOM 제거
        if (data.startsWith("\uFEFF")) {
            data = data.substring(1);
        }

        // 공백 및 인덴트 제거
        data = data.replaceAll("\\s+", "");
    	
    	return data;
    }
}