<%@page language="java" contentType="application/json; charset=UTF-8"%><%@page import="java.util.Calendar" %><%@page import="java.text.DecimalFormat" %><%@page import="java.text.SimpleDateFormat" %><%
        /**
         *      This page is meant to output the Stock Price of Google in real-time data format. 
         *      The data will be picked by FusionWidgets XT real-time line chart and plotted on chart.
         *      You need to make sure that the output data doesn't contain any HTML tags or carriage returns.
         *      For the sake of demo, we'll just be generating a random value between 30 and 35 and returning the same.
         *      In real life applications, you can get the data from web-service or your own data systems, convert it into real-time data format and then return to the chart.
         */
        /**
         *      Note: In order to get the output without addition of any 
         *      carriage-returns or tab spaces, there should not be spaces or empty lines
         *      between scriptlet tags or at the end of the page.
         **/
        String pattern = "###.##";
        DecimalFormat df = new DecimalFormat(pattern);

        int lowerLimit = 30;
        int upperLimit = 75;
        //Generate a random value - between lower and upper limits
       // double randomValue = Math.random()*100*(upperLimit-lowerLimit)/100+lowerLimit;
        // Next few steps, to round this double to 2 decimal places
        long factor = (long)Math.pow(10,2);
        // Shift the decimal the correct number of places
        // to the right.
        
        // Round to the nearest integer.
       
        // Shift the decimal the correct number of places
        // back to the left.
       
      
        //Get label for the data - time in format HH:mm:ss
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        String timeLabel = sdf.format(cal.getTime());
        
        StringBuffer strbuf = new StringBuffer();
             //                     {\"label\":\""+timeLabel+"\",\"series\":\"A\",\"value\":\""+randomValues1+"\",\"rowStatus\":\"R\"},{\"label\":\""+timeLabel+"\",\"series\":\"B\",\"value\":\""+randomValues2+"\",\"rowStatus\":\"R\"},{\"label\":\""+timeLabel+"\",\"series\":\"C\",\"value\":\""+randomValues3+"\",\"rowStatus\":\"R\"}]";

        for( int i = 0 ; i < 10 ; i++ ){
        	double randomValue = Math.random()*100*(upperLimit-lowerLimit)/100+lowerLimit;
        	randomValue = randomValue * factor;
        	long tmp = Math.round(randomValue);
        	double roundedRandomValue=(double)tmp / factor;

            String randomValues1 = df.format(roundedRandomValue);
        	if ( i >= 1 ){
        		strbuf.append(",");
        	}
        	
        	strbuf.append(timeLabel);
        	strbuf.append(",");
        	strbuf.append("A"+ i);
        	strbuf.append(",");
        	strbuf.append(randomValues1);

        }
        //String dataParameters = "[{\"label\":\""+timeLabel+"\",\"series\":\"A\",\"value\":\""+randomValues1+"\",\"rowStatus\":\"R\"},{\"label\":\""+timeLabel+"\",\"series\":\"B\",\"value\":\""+randomValues2+"\",\"rowStatus\":\"R\"},{\"label\":\""+timeLabel+"\",\"series\":\"C\",\"value\":\""+randomValues3+"\",\"rowStatus\":\"R\"}]";
        //Now write it to output stream
        // String dataParameters = "[{\"label\":\"1\",\"series\":\"A\",\"value\":\"1\",\"rowStatus\":\"R\"},{\"label\":\"1\",\"series\":\"B\",\"value\":\"2\",\"rowStatus\":\"R\"},{\"label\":\"1\",\"series\":\"C\",\"value\":\"3\",\"rowStatus\":\"R\"}]";
        out.print(strbuf.toString());
%>