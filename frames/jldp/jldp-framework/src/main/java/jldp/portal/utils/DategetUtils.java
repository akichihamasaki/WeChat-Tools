package jldp.portal.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DategetUtils {

	public static Date getToday(){
		Calendar c=Calendar.getInstance();
		c.setTime(new Date());
		c.set(java.util.Calendar.HOUR_OF_DAY, 0);
		c.set(java.util.Calendar.MINUTE, 0);
		c.set(java.util.Calendar.SECOND, 0);
		return c.getTime();
	}
	
	public static Date getTomorrow(){
		Date date=new Date();//取时间
		 Calendar c = new GregorianCalendar();
		 c.setTime(date);
		 c.add(Calendar.DATE,1);//把日期往后增加一天.整数往后推,负数往前移动
		 c.set(java.util.Calendar.HOUR_OF_DAY, 0);
		 c.set(java.util.Calendar.MINUTE, 0);
		 c.set(java.util.Calendar.SECOND, 0);
		 return c.getTime();
	}
	
	public static Date getYesterDay() {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.DATE, -1);
		c.set(java.util.Calendar.HOUR_OF_DAY, 0);
		c.set(java.util.Calendar.MINUTE, 0);
		c.set(java.util.Calendar.SECOND, 0);
		return c.getTime();
	}
	
	public static Date getAfterDay(String endtimeStr){
		SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd" );
		Date dateEnd;
		try {
			dateEnd = sdf.parse(endtimeStr);
			Calendar c = new GregorianCalendar();
			 c.setTime(dateEnd);
			 c.add(Calendar.DATE,1);//把日期往后增加一天.整数往后推,负数往前移动
			 c.set(java.util.Calendar.HOUR_OF_DAY, 0);
			 c.set(java.util.Calendar.MINUTE, 0);
			 c.set(java.util.Calendar.SECOND, 0);
			 return c.getTime();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		 
		 return null;
	}
	
	public static Date getFirstDay() 
	 {// Date date=new Date();//取时间
	   Calendar c = new GregorianCalendar();
	  // c.setTime(date);   
      c.add(Calendar.MONTH, 0);
	   c.set(Calendar.DAY_OF_MONTH,1);
	// c.add(c.DATE,1);//把日期往后增加一天.整数往后推,负数往前移动
	 c.set(java.util.Calendar.HOUR_OF_DAY, 0);
	 c.set(java.util.Calendar.MINUTE, 0);
	 c.set(java.util.Calendar.SECOND, 0);
	 return c.getTime();
	 }
	
	public static String time() 
	{  Date date=new Date(); 
	   DateFormat format=new SimpleDateFormat(" yyyy-MM-dd"); 
	   String time=format.format(date); 
	   return time; 
	   }
	

	 public static String getFirstDay1() {
		 Calendar calendar  =   new  GregorianCalendar();
		 calendar.set( Calendar.DATE,  1 );
		 SimpleDateFormat simpleFormate  =   new  SimpleDateFormat( " yyyy-MM-dd" );
		 return  simpleFormate.format(calendar.getTime());
		  }

	 /**
	  * 获取上个月的第一天
	  * @return
	  */
	 public static String getLastMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)-1);
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 return DateUtils.toDefDateString(cal.getTime());
	 }
	 
	 /**
	  * 获取当月月的第一天
	  * @return
	  */
	 public static String getMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 return DateUtils.toDefDateString(cal.getTime());
	 }
	 
	 /**
	  * 获取下个月的第一天
	  * @return
	  */
	 public static String getAfterMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)+1);
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 return DateUtils.toDefDateString(cal.getTime());
	 }

	 /**
	  * 获取去年上个月的第一天
	  * @return
	  */
	 public static String getLastYearLastMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.YEAR, cal.get(Calendar.YEAR)-1);
		 cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)-1);
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 System.out.println(DateUtils.toDefDateString(cal.getTime()));
		 return DateUtils.toDefDateString(cal.getTime());
	 }
	 
	 /**
	  * 获取去年当月的第一天
	  * @return
	  */
	 public static String getLastYearMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.YEAR, cal.get(Calendar.YEAR)-1);
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 return DateUtils.toDefDateString(cal.getTime());
	 }
	 
	 /**
	  * 获取去年下个月的第一天
	  * @return
	  */
	 public static String getLastYearAfterMonthFirstDay(){
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(new Date());
		 cal.set(Calendar.YEAR, cal.get(Calendar.YEAR)-1);
		 cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)+1);
		 cal.set(Calendar.DAY_OF_MONTH,1);
		 return DateUtils.toDefDateString(cal.getTime());
	 }
	 
}
