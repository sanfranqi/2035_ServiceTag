package com.cyou.fz2035.servicetag.utils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;

public class NumbericUtil {
    // 默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;
    
  //字母随机数组，去除了i，o等歧义字母
    final static String[] letters = {"a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","w","x","y"};
    //数字随机数组，去除了0和1等歧义数字
    final static String[] numbers = {"2","3","4","5","6","7","8","9"};
    
    /**
     * 构造函数.
     */
    protected NumbericUtil() {
        
    }
    
    /**
     * 提供精确的加法运算。
     * 
     * @param v1
     *            被加数
     * @param v2
     *            加数
     * @return 两个参数的和
     */
    public static double add(final double v1, final double v2) {
        final BigDecimal b1 = new BigDecimal(Double.toString(v1));
        final BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }
    
    /**
     * 提供精确的减法运算。
     * 
     * @param v1
     *            被减数
     * @param v2
     *            减数
     * @return 两个参数的差
     */
    public static double subtract(final double v1, final double v2) {
        final BigDecimal b1 = new BigDecimal(Double.toString(v1));
        final BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }
    
    /**
     * 提供精确的乘法运算。
     * 
     * @param v1
     *            被乘数
     * @param v2
     *            乘数
     * @return 两个参数的积
     */
    public static double multiply(final double v1, final double v2) {
        final BigDecimal b1 = new BigDecimal(Double.toString(v1));
        final BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }
    
    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到 小数点以后10位，以后的数字四舍五入。
     * 
     * @param v1
     *            被除数
     * @param v2
     *            除数
     * @return double
     */
    public static double divide(final double v1, final double v2) {
        return NumbericUtil.divide(v1, v2, NumbericUtil.DEF_DIV_SCALE);
    }
    
    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指 定精度，以后的数字四舍五入。
     * 
     * @param v1
     *            被除数
     * @param v2
     *            除数
     * @param scale
     *            表示表示需要精确到小数点以后几位。
     * @return double 两个参数的商
     */
    public static double divide(final double v1, final double v2, final int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        final BigDecimal b1 = new BigDecimal(Double.toString(v1));
        final BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }
    
    /**
     * 提供精确的小数位四舍五入处理。
     * 
     * @param v
     *            需要四舍五入的数字
     * @param scale
     *            小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(final double v, final int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        final BigDecimal b = new BigDecimal(Double.toString(v));
        final BigDecimal one = new BigDecimal("1");
        return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }
    
    /**
     * 将数字金额(BigDecimal类型)转换为中文金额.
     * 
     * @param bigdMoneyNumber
     *            转换前的数字金额
     * @return String 中文金额
     */
    public static String lowerToUpperOfMoney(final BigDecimal bigdMoneyNumber) {
        final String[] straChineseUnit = new String[] {"分", "角", "圆", "拾", "佰", "仟", "万", "拾", "佰",
                "仟", "亿", "拾", "佰", "仟" };
        // 中文数字字符数组
        final String[] straChineseNumber = new String[] {"零", "壹", "贰", "叁", "肆", "伍", "陆", "柒",
                "捌", "玖" };
        String strChineseCurrency = "";
        // 零数位标记
        boolean bZero = true;
        // 中文金额单位下标
        int chineseUnitIndex = 0;
        
        try {
            if (bigdMoneyNumber.intValue() == 0) {
                return "零圆整";
            }
            // 处理小数部分，四舍五入
            double doubMoneyNumber = Math.round(bigdMoneyNumber.doubleValue() * 100);
            // 是否负数
            final boolean bNegative = doubMoneyNumber < 0;
            // 取绝对值
            doubMoneyNumber = Math.abs(doubMoneyNumber);
            // 循环处理转换操作
            while (doubMoneyNumber > 0) {
                // 整的处理(无小数位)
                if (chineseUnitIndex == 2 && strChineseCurrency.length() == 0) {
                    strChineseCurrency = strChineseCurrency + "整";
                }
                // 非零数位的处理
                if (doubMoneyNumber % 10 > 0) {
                    strChineseCurrency = straChineseNumber[(int) doubMoneyNumber % 10]
                        + straChineseUnit[chineseUnitIndex] + strChineseCurrency;
                    bZero = false;
                } else { // 零数位的处理
                    // 元的处理(个位)
                    if (chineseUnitIndex == 2) {
                        // 段中有数字
                        if (doubMoneyNumber > 0) {
                            strChineseCurrency = straChineseUnit[chineseUnitIndex]
                                + strChineseCurrency;
                            bZero = true;
                        }
                    } else if (chineseUnitIndex == 6 || chineseUnitIndex == 10) { // 万、亿数位的处理
                        // 段中有数字
                        if (doubMoneyNumber % 1000 > 0) {
                            strChineseCurrency = straChineseUnit[chineseUnitIndex]
                                + strChineseCurrency;
                        }
                    }
                    // 前一数位非零的处理
                    if (!bZero) {
                        strChineseCurrency = straChineseNumber[0] + strChineseCurrency;
                    }
                    bZero = true;
                }
                doubMoneyNumber = Math.floor(doubMoneyNumber / 10);
                chineseUnitIndex++;
            }
            // 负数的处理
            if (bNegative) {
                strChineseCurrency = "负" + strChineseCurrency;
            }
        } catch (final Exception e) {
            return "";
        }
        return strChineseCurrency;
    }
    
    /**
     * 将小写金额(double类型)转化为人民币大写格式.
     * 
     * @param je
     *            转换前的小写数字金额
     * @return String 中文金额
     */
    public static String lowerToUpperOfMoney(final double je) {
        String money = ""; // 转换后的字符串
        final String num = "零壹贰叁肆伍陆柒捌玖";
        final String[] unit = {"元", "拾", "佰", "仟", "万", "拾万", "佰万", "仟万", "亿", "拾亿", "佰亿", "仟亿" };
        String s = String.valueOf(je); // 将金额转换为字符串
        final int a = s.indexOf("+"); // 判断s是否包含'+',如1.67E+4
        final int e = s.indexOf("E"); // 判断s是否包含'E',如1.67E+4
        if (je == 0.00) {
            return money;
        }
        // 如果包含'E'(该金额是以科学记数法表示,则转换成普通表示法)
        if (e != -1) {
            int index = 0; // 指数值
            if (a == -1) {
                index = Integer.parseInt(s.substring(e + 1)); // 取得指数值
            } else {
                index = Integer.parseInt(s.substring(a + 1)); // 取得指数值
            }
            final String sub1 = s.substring(0, e); // 取得尾数值
            final int dot = sub1.indexOf("."); // 尾数的小数点位置
            // 如果不含有小数点,则在后面补index个'0'
            if (dot == -1) {
                for (int i = 1; i <= index; i++) {
                    s = sub1 + "0";
                }
            } else { // 如果含有小数点,则向后移动小数点index位
                final String sub11 = sub1.substring(0, dot); // 小数点前面的字串
                String sub12 = sub1.substring(dot + 1); // 小数点后面的字串
                if (index >= sub12.length()) {
                    final int j = index - sub12.length();
                    for (int i = 1; i <= j; i++) {
                        sub12 = sub12 + "0";
                    }
                } else {
                    sub12 = sub12.substring(0, index) + "." + sub12.substring(index);
                }
                s = sub11 + sub12;
            }
        }
        final int sdot = s.indexOf("."); // s中小数点的位置
        String beforeDot = ""; // 小数点前面的字串
        String afterDot = ""; // 小数点后面的字串
        // 如果包含小数点
        if (sdot != -1) {
            beforeDot = s.substring(0, sdot);
            afterDot = s.substring(sdot + 1);
        } else { // 不包含小数点
            beforeDot = s;
        }
        final int bl = beforeDot.length();
        boolean zero = false; // 数字是否为零
        int z = 0; // '0'的个数
        
        // 逐位取数字
        for (int j = 0, i = bl - 1; j <= bl - 1; j++, i--) {
            final int number = Integer.parseInt(String.valueOf(beforeDot.charAt(j)));
            if (number == 0) {
                zero = true;
                z++;
            } else {
                zero = false;
                z = 0;
            }
            if (zero && z == 1) {
                money += "零";
            } else if (zero) {
            } else if (!zero) {
                money += num.substring(number, number + 1) + unit[i];
            }
        }
        
        // 删去多余的'万'和'亿'
        for (int i = 1; i <= 2; i++) {
            String ss = "";
            if (i == 1) {
                ss = "万";
            } else {
                ss = "亿";
            }
            final int last = money.lastIndexOf(ss);
            if (last != -1) {
                String moneySub1 = money.substring(0, last);
                final String moneySub2 = money.substring(last, money.length());
                int last2 = moneySub1.indexOf(ss);
                while (last2 != -1) {
                    moneySub1 = moneySub1.substring(0, last2)
                        + moneySub1.substring(last2 + 1, moneySub1.length());
                    last2 = moneySub1.indexOf(ss);
                }
                money = moneySub1 + moneySub2;
            }
        }
        
        // money中是否包含'元'
        final int yuan = money.indexOf("元");
        // 如果不包含'元'
        if (yuan == -1) {
            final int zi = money.lastIndexOf("零");
            // 如果最后一位字符为'零',则删除它
            if (zi == money.length() - 1) {
                money = money.substring(0, money.length() - 1) + "元"; // 在money最后加上'元'
            }
        }
        
        // 如果小数点后面的字串不为空,则处理'角','分'
        if (!afterDot.equals("")) {
            int al = afterDot.length();
            if (al > 2) { // 如果字串长度大于2,则截断
                afterDot = afterDot.substring(0, 2);
                al = afterDot.length();
            }
            // 如果字符串不为'0'或'00',则处理,否则不进行处理
            if (!afterDot.equals("0") && !afterDot.equals("00")) {
                // 逐位取得字符
                for (int i = 0; i < al; i++) {
                    final int number = Integer.parseInt(String.valueOf(afterDot.charAt(i)));
                    if (number != 0 && i == 0) {
                        money += num.substring(number, number + 1) + "角";
                    } else if (number != 0 && i == 1) {
                        money += num.substring(number, number + 1) + "分";
                    } else if (number == 0 && i == 0) {
                        money += "零";
                    }
                }
            }
        }
        // 如果不包含'角','分'则在最后加上'整'字
        if (money.indexOf("角") == -1 && money.indexOf("分") == -1) {
            money += "整";
        }
        return money;
    }
    
    /**
     * 将double数转化为指定位数的字符串.
     * 
     * @param num
     *            待转换的float数
     * @param digits
     *            小数点后的位数
     * @return String 指定小数位数的字符串
     */
    public static String getNumberFormat(final float num, final int digits) {
        String thenum;
        final NumberFormat nf = NumberFormat.getInstance();
        nf.setMaximumFractionDigits(digits);
        nf.setMinimumFractionDigits(digits);
        thenum = nf.format(num).toString();
        return thenum;
    }
    
    /**
     * 将double数转化为指定位数的字符串.<br>
     * 例如： NumericUtil.getNumberFormat(123456.12345,3)
     * 的结果为123,456.123，注意小数点最后一位四舍五入
     * 
     * @param num
     *            待转换的double数
     * @param digits
     *            小数点后的位数
     * @return String 指定小数位数的字符串
     */
    public static String getNumberFormat(final double num, final int digits) {
        String thenum;
        final NumberFormat nf = NumberFormat.getInstance();
        nf.setMaximumFractionDigits(digits);
        nf.setMinimumFractionDigits(digits);
        thenum = nf.format(num).toString();
        return thenum;
    }
    
    /**
     * 将BigDecimal数转化为指定位数的字符串.<br>
     * 例如： NumericUtil.getNumberFormat(new BigDecimal(123456.12345),3)
     * 的结果为123,456.123，注意小数点最后一位四舍五入
     * 
     * @param num
     *            待转换的BigDecimal数
     * @param digits
     *            小数点后的位数
     * @return String 指定小数位数的字符串
     */
    public static String getNumberFormat(BigDecimal num, final int digits) {
        String thenum = "";
        if (num == null) {
            num = new BigDecimal(0);
        }
        try {
            final NumberFormat nf = NumberFormat.getInstance();
            nf.setMaximumFractionDigits(digits);
            nf.setMinimumFractionDigits(digits);
            thenum = nf.format(num).toString();
        } catch (final NumberFormatException nfex) {
            throw new NumberFormatException(nfex.toString());
        }
        return thenum;
    }
    
    /**
     * 格式字符串为double输出.
     * 
     * @param lpNumberFormat
     *            待格式化的字符串
     * @return double double数值
     */
    public static double getNumberFormatStrToDouble(final String lpNumberFormat) {
        double lpReturnNumber = 0;
        final NumberFormat nf = NumberFormat.getInstance();
        try {
            final Number lpResultNumber = nf.parse(lpNumberFormat);
            lpReturnNumber = lpResultNumber.doubleValue();
        } catch (final ParseException pe) {
        }
        return lpReturnNumber;
    }
    
    /**
     * 格式字符串为float输出.
     * 
     * @param lpNumberFormat
     *            待格式化的字符串
     * @return float float数值
     */
    public static float getNumberFormatStrToFloat(final String lpNumberFormat) {
        float lpReturnNumber = 0;
        final NumberFormat nf = NumberFormat.getInstance();
        try {
            final Number lpResultNumber = nf.parse(lpNumberFormat);
            lpReturnNumber = lpResultNumber.floatValue();
        } catch (final ParseException pe) {
        }
        return lpReturnNumber;
    }
    
    /**
     * 将字符串转化为BigDecimal类型.
     * 
     * @param str
     *            待转换的字符串
     * @return BigDecimal 转换后的BigDecimal，如果字符串为null， 那么BigDecimal为new
     *         BigDecimal("0");
     */
    public static BigDecimal toBigDecimal(String str) {
        BigDecimal lpReturnValue;
        try {
            if (str == null) {
                str = "0";
            }
            lpReturnValue = new BigDecimal(str);
        } catch (final NumberFormatException nfe) {
            lpReturnValue = new BigDecimal(0);
        }
        return lpReturnValue;
    }
    
    /**
     * 将字符串转化为double类型 Converts a string to double. If fails is not throwing a
     * NumberFormatException, instead return 0.
     * 
     * @param str
     *            待转换的字符串
     * @return double数据
     */
    public static double toDouble(String str) {
        double lpResult = 0;
        
        if (str == null) {
            str = "";
        } else {
            str = str.trim();
        }
        try {
            lpResult = Double.parseDouble(str);
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 将字符串转化为short类型 Converts a string to short. If fails is not throwing a
     * NumberFormatException, instead return 0.
     * 
     * @param str
     *            待转换的字符串
     * @return int数据
     */
    public static short toShort(String str) {
        short lpResult = 0;
        if (str == null) {
            str = "";
        } else {
            str = str.trim();
        }
        try {
            lpResult = Short.parseShort(str);
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 将字符串转化为int类型 Converts a string to integer. If fails is not throwing a
     * NumberFormatException, instead return 0.
     * 
     * @param str
     *            待转换的字符串
     * @return int 数据
     */
    public static int toInt(String str) {
        int lpResult = 0;
        if (str == null) {
            str = "";
        } else {
            str = str.trim();
        }
        try {
            lpResult = Integer.parseInt(str);
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 将字符串转化为float类型 Converts a string to float. If fails is not throwing a
     * NumberFormatException, instead return 0.
     * 
     * @param str
     *            待转换的字符串
     * @return float 数据
     */
    public static float toFloat(String str) {
        float lpResult = 0;
        if (str == null) {
            str = "";
        } else {
            str = str.trim();
        }
        try {
            lpResult = Float.parseFloat(str);
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 将字符串转化为long类型 Converts a string to long. If fails is not throwing a
     * NumberFormatException, instead return 0.
     * 
     * @param str
     *            待转换的字符串
     * @return long 数据
     */
    public static long toLong(String str) {
        long lpResult = 0;
        if (str == null) {
            str = "";
        } else {
            str = str.trim();
        }
        try {
            lpResult = Long.parseLong(str);
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 当变量为空时返回零.
     * 
     * @param obj
     *            Object
     * @return int
     */
    public static int nullToZero(final Object obj) {
        int result = 0;
        if (obj == null || obj.toString().equals("")) {
            result = 0;
        } else {
            result = new Integer(obj.toString()).intValue();
        }
        
        return result;
        
    }
    
    /**
     * 当变量为空时返回零.
     * 
     * @param obj
     *            Object
     * @return BigDecimal
     */
    public static BigDecimal nullToBigDecimalZero(final Object obj) {
        BigDecimal result = new BigDecimal("0");
        if (obj == null || obj.toString().equals("")) {
            result = new BigDecimal("0");
        } else {
            result = new BigDecimal(obj.toString());
        }
        
        return result;
        
    }
    
    /**
     * @param obj
     *            Object
     * @return String
     */
    public static String nullToStringZero(final Object obj) {
        BigDecimal result = new BigDecimal("0");
        if (obj == null || obj.toString().equals("")) {
            result = new BigDecimal("0");
        } else {
            result = new BigDecimal(obj.toString());
        }
        
        return result.toString();
        
    }
    
    /**
     * @param obj
     *            Object
     * @return Long
     */
    public static Long nullToLongZero(final Object obj) {
        
        Long result = new Long(0);
        
        try {
            if (obj == null || obj.toString().equals("")) {
                result = new Long(0);
            } else {
                result = new Long(obj.toString());
            }
        } catch (final Exception ex) {
            result = new Long(0);
        }
        
        return result;
    }
    
    public static Long nullToLongZero(final Object obj, final Long rpt) {
        
        Long result = nullToLongZero(obj);
        if(result == 0L){
            result = rpt;
        }
        return result;
    }
    
    public static Integer nullToIntegerZero(final Object obj) {
        Integer result = new Integer(0);
        
        try {
            if (obj == null || obj.toString().equals("")) {
                result = new Integer(0);
            } else {
                result = new Integer(obj.toString());
            }
        } catch (final Exception ex) {
            result = new Integer(0);
        }
        
        return result;
    }
    
    /**
     * @param obj
     *            Double
     * @return Double
     */
    public static Double nullToDoubleZero(final Double obj) {
        Double result = new Double(0);
        if (obj == null) {
            result = new Double(0);
        } else {
            final DecimalFormat format = new DecimalFormat("#.000");
            result = new Double(format.format(obj));
        }
        return result;
        
    }
    
    /**
     * @param obj
     *            Object
     * @return Double
     */
    public static Double nullToDoubleZero(final Object obj) {
        Double result = new Double(0);
        try {
            if (obj == null) {
                result = new Double(0);
            } else {
                result = new Double(obj.toString());
            }
        } catch (final Exception e) {
        }
        return result;
        
    }
    
    /**
     * 将对像转换成Float类型，当对像为空时返回0
     * .
     * 
     * @param obj
     * @return
     */
    public static Float nullToFloatZero(final Object obj) {
        Float result = new Float(0);
        try {
            if(obj != null){
                result = Float.valueOf(obj.toString());
            }
        } catch (final Exception e) {
        }
        return result;
        
    }
    
    /**
     * 方法功能:
     * 转换大Long为int .
     * @param lon 输入大Long
     * @return int 返回int
     */
    public static int toInt(Long lon) {
        int lpResult = 0;
        try {
            if (lon == null) {
                lpResult = 0;
            } else {
                lpResult = lon.intValue();
            }
        } catch (final NumberFormatException nfe) {
        }
        return lpResult;
    }
    
    /**
     * 根据密码长度和是否包含字母参数来生成随机码.
     * 
     * @param length 长度
     * @param hasLetter 是否包含字母
     */
    public static String getRandomCode(int length, boolean hasLetter) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            double random = Math.random();
            if (hasLetter && random < 0.5 ) {
                Double d = new Double(random * letters.length);
                sb.append(letters[d.intValue()]);
            } else {
                Double d = new Double(random * numbers.length);
                sb.append(numbers[d.intValue()]);
            }
        }
        return sb.toString();
    }
    /**
     * @param args
     *            String
     */
    /*
     * public static void main(String args[]) { NumericUtil a = new
     * NumericUtil(); BigDecimal big = new BigDecimal(123456.12345); }
     */

}
