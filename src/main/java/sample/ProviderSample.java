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

public class ProviderSample extends AbstractDataListLoad {

    @Override
    public String getData() throws Exception {

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
//                + "{\"col1\":\"11\",\"col2\":\"11\",\"col3\":\"11\"},{\"col1\":\"22\",\"col2\":\"22\",\"col3\":\"22\"},"
//                + "{\"col1\":\"33\",\"col2\":\"33\",\"col3\":\"33\"},{\"col1\":\"44\",\"col2\":\"44\",\"col3\":\"44\"},"
//                + "{\"col1\":\"55\",\"col2\":\"55\",\"col3\":\"55\"},{\"col1\":\"66\",\"col2\":\"66\",\"col3\":\"66\"}"
//                + "]";
        
        
//        JSONArray jsonArray = new JSONArray();
//        for (int i = 1; i <= 1000; i++) {
//            JSONObject jsonObj = new JSONObject();
//            jsonObj.put("col1", i + "");
//            jsonObj.put("col2", i + "");
//            jsonObj.put("col3", i + "");
//            jsonArray.add(jsonObj);
//        }
//        String data = jsonArray.toString();
        
        JSONArray jsonArray = null;
        
        try {
	        // JSON 파일 읽기 (BOM 제거)
	        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data/jsonData1000.json");
	        InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
	        BufferedReader bufferedReader = new BufferedReader(reader);
	
	        // BOM 제거
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
	
	        jsonArray = (JSONArray) parser.parse(jsonContent.toString());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }

        String data = jsonArray.toString();


        
        
//        System.out.println("########### " + data);

        // 필요 시 상태를 변경 (데이터 로드 중단)
//      setStatus(false);

        // 조회된 데이터를 문자열로 return
        return data;
    }
}
