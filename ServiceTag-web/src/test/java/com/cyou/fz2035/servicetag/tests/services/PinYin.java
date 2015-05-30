package com.cyou.fz2035.servicetag.tests.services;

import java.util.ArrayList;
import java.util.List;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月26日
 */
public class PinYin {

	/**
	 * 获取字符串内的所有汉字的汉语拼音并大写每个字的首字母
	 * 
	 * @param chinese
	 * @return
	 */
	public static String spell(String chinese) {
		if (chinese == null) {
			return null;
		}
		HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
		format.setCaseType(HanyuPinyinCaseType.LOWERCASE);// 小写
		format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);// 不标声调
		format.setVCharType(HanyuPinyinVCharType.WITH_V);// u:的声母替换为v
		try {
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < chinese.length(); i++) {
				String[] array = PinyinHelper.toHanyuPinyinStringArray(chinese.charAt(i), format);
				if (array == null || array.length == 0) {
					continue;
				}
				String s = array[0];// 不管多音字,只取第一个
				char c = s.charAt(0);// 大写第一个字母
				String pinyin = String.valueOf(c).toUpperCase().concat(s.substring(1));
				sb.append(pinyin);
			}
			return sb.toString();
		} catch (BadHanyuPinyinOutputFormatCombination e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// System.out.println(PinYin.spell("刘宝瑞"));
		// char ch = '留';
		// System.out.println(PinyinTools.getPinyinHeads(ch));
		// ch = 'a';
		// System.out.println(PinyinTools.getPinyinHeads(ch));
		// ch = '8';
		// System.out.println(PinyinTools.getPinyinHeads(ch));
		//
		// System.out.println("没有z.".matches("((\\d)|([a-z])|([A-Z])|([\u4e00-\u9fa5]))+"));

		ServiceTagVo vo1 = new ServiceTagVo();
		vo1.setFirstChar("a");
		ServiceTagVo vo2 = new ServiceTagVo();
		vo2.setFirstChar("b");
		ServiceTagVo vo3 = new ServiceTagVo();
		vo3.setFirstChar("c");
		List<ServiceTagVo> list = new ArrayList<ServiceTagVo>();
		list.add(vo1);
		list.add(vo2);
		list.add(vo3);
		for (ServiceTagVo serviceTagVo : list) {
			System.out.println(serviceTagVo);
		}
		System.out.println("================");
		list.add(list.get(1));
		for (ServiceTagVo serviceTagVo : list) {
			System.out.println(serviceTagVo);
		}
		System.out.println("================");
		list.remove(1);
		for (ServiceTagVo serviceTagVo : list) {
			System.out.println(serviceTagVo);
		}

		List<ServiceTagListVo> serviceTagVos = ObjectUtil.convertList(list, ServiceTagListVo.class);
		System.out.println("=====ssss==========");
		for (ServiceTagListVo serviceTagVo : serviceTagVos) {
			System.out.println(serviceTagVo);
		}
	}
}
