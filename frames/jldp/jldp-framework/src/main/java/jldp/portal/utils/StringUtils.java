package jldp.portal.utils;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {

	@SuppressWarnings("rawtypes")
	public static String getRequestParams(Map map) {
		Set keSet = map.entrySet();
		String params = "";
		for (Iterator itr = keSet.iterator(); itr.hasNext();) {
			Map.Entry me = (Map.Entry) itr.next();
			Object ok = me.getKey();
			Object ov = me.getValue();
			String[] value = new String[1];
			if (ov instanceof String[]) {
				value = (String[]) ov;
			} else {
				value[0] = ov.toString();
			}

			for (int k = 0; k < value.length; k++) {
				if (params.length() > 0) {
					params += "&";
				}
				params += ok + "=" + value[k];
			}
		}
		return params;
	}

	public static String htmlspecialchars(String str) {
		str = str.replaceAll("&", "&amp;");
		str = str.replaceAll("<", "&lt;");
		str = str.replaceAll(">", "&gt;");
		str = str.replaceAll("\"", "&quot;");
		return str;
	}

	public static String toString(String[] array) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < array.length; i++) {
			if (sb.length() > 0) {
				sb.append(",");
			}
			sb.append(array[i]);
		}
		return sb.toString();
	}

	public static String get(String str) {
		return str == null ? "" : str;
	}

	public static boolean isNotEmpty(String str) {
		if (str != null && (!str.equals(""))) {
			return true;
		}
		return false;
	}

	public static List<String> getSubstrings(String string, String regexpression) {
		List<String> strlist = new LinkedList<String>();
		Pattern pattern = Pattern.compile(regexpression);
		Matcher matcher = pattern.matcher(string);
		while (matcher.find()) {
			String val = matcher.group();
			strlist.add(val);
		}
		return strlist;

	}
	
	public static Integer convertToInteger(String string) {
		if (isNotEmpty(string) && string.matches("\\d+")) {
			return Integer.parseInt(string);
		} else {
			return 0;
		}
	}
}
