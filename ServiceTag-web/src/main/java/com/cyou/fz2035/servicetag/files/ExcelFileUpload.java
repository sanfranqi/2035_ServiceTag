package com.cyou.fz2035.servicetag.files;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz2035.servicetag.files.cfg.FileConfig;
import com.cyou.fz2035.servicetag.exception.UnCaughtException;
import org.apache.commons.fileupload.FileItem;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


/**
 * excel文件上传.
 * 
 * @author qingwu
 * @date 2014-1-22 下午3:15:54
 */
public class ExcelFileUpload extends AbstractFileUpload {

	/**
	 * excel文件.
	 */
	private FileItem excelFile;

	/**
	 * excel类型.
	 */
	private int excelType = -1;

	private static final int EXCEL_TYPE_XLS = 1;

	private static final int EXCEL_TYPE_XLSX = 2;

	public ExcelFileUpload(HttpServletRequest request) {
		super(request);
		if (super.getFileList() != null) {
			for (FileItem item : super.getFileList()) {
				if (item.getFieldName().equals("excel")) {
					excelFile = item;
					if (excelFile.getName().endsWith(".xls")) {
						excelType = EXCEL_TYPE_XLS;
					} else if (excelFile.getName().endsWith(".xlsx")) {
						excelType = EXCEL_TYPE_XLSX;
					}
					break;
				}
			}
		}
	}

	/**
	 * 初始化excel.
	 * 
	 * @param in
	 * @return
	 * @author qingwu
	 * @date 2014-3-20 上午10:19:30
	 */
	public Workbook getWorkbook(InputStream in) {
		Workbook workbook = null;
		try {
			switch (this.excelType) {
			case EXCEL_TYPE_XLS:// xls格式
				workbook = new HSSFWorkbook(in);
				break;
			case EXCEL_TYPE_XLSX:// xlsx格式
				workbook = new XSSFWorkbook(in);
				break;
			}
		} catch (IOException e) {
			throw new UnCaughtException(e);
		}
		return workbook;
	}

	/**
	 * 读取excel文件,将数据转换成List.<br>
	 * 说明：目前只支持单excel、单sheet类型，且文件类型为'.xls'或者'.xlsx'.
	 * 
	 * @return
	 * @author qingwu
	 * @date 2014-1-22 下午3:18:48
	 */
	public List<List<String>> readExcel() {
		List<List<String>> datas = new ArrayList<List<String>>();
		// 没有上传文件
		if (super.getFileList() == null) {
			return null;
		}
		if (super.getFileList().size() == 0) {
			return null;
		}
		// 读取excel
		InputStream in = null;
		try {
			in = excelFile.getInputStream();
			Workbook workbook = getWorkbook(in);
			if (workbook == null) {
				throw new UnCaughtException("初始化excel出错!");
			}
			Sheet sheet = workbook.getSheetAt(0);
			int colLength = sheet.getRow(0).getLastCellNum();
			for (int i = 0; i <= sheet.getLastRowNum(); i++) {
				List<String> _row = new ArrayList<String>();
				Row row = sheet.getRow(i);
				for (int j = 0; j < row.getLastCellNum(); j++) {
					Cell cell = row.getCell(j);
					if (cell == null) {
						_row.add(null);
						continue;
					}
					if (cell.toString() == null) {
						_row.add(null);
						continue;
					}
					if (cell.toString().equals("")) {
						_row.add(null);
						continue;
					}

					if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
						_row.add(cell.getStringCellValue());
					} else if ((cell.getCellType() == Cell.CELL_TYPE_NUMERIC)) {
						if (HSSFDateUtil.isCellDateFormatted(cell)) {// 如果是日期格式
							DateFormat formater = new SimpleDateFormat(
									"yyyy/MM/dd");
							_row.add(formater.format(cell.getDateCellValue()));
						} else {
							DecimalFormat df = new DecimalFormat("0");
							String value = df
									.format(cell.getNumericCellValue());
							_row.add(value);
						}
					} else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
						_row.add(getFormulaValue(workbook, cell));
					} else {
						_row.add(cell.toString());
					}
				}
				while (_row.size() < colLength) {// 与列头保持列数一致
					_row.add(null);
				}
				datas.add(_row);
			}
		} catch (IOException e) {
			throw new UnCaughtException(e);
		} finally {
			super.close();
		}
		return datas;
	}

	/**
	 * 根据公式获得单元格的值文本.
	 * 
	 * @param cell
	 * @return
	 * @author qingwu
	 * @date 2014-3-14 下午6:00:51
	 */
	public String getFormulaValue(Workbook wb, Cell cell) {
		FormulaEvaluator evaluator = wb.getCreationHelper()
				.createFormulaEvaluator();
		String s = null;
		CellValue cellValue = evaluator.evaluate(cell);
		switch (cellValue.getCellType()) {
		case Cell.CELL_TYPE_BOOLEAN:
			s = String.valueOf(cellValue.getBooleanValue());
			break;
		case Cell.CELL_TYPE_NUMERIC:
			DecimalFormat df = new DecimalFormat("0");
			s = df.format(cellValue.getNumberValue());
			break;
		case Cell.CELL_TYPE_STRING:
			s = cellValue.getStringValue();
			break;
		case Cell.CELL_TYPE_BLANK:
			break;
		case Cell.CELL_TYPE_ERROR:
			break;
		// CELL_TYPE_FORMULA will never happen
		case Cell.CELL_TYPE_FORMULA:
			break;
		}
		return s;
	}

	@Override
	public ResultVO fileCheck() {
		ResultVO result = new ResultVO(true);
		// 没有上传文件
		if (super.getFileList() == null) {
			result.setSuccess(false);
			result.addMsg("上传文件不能为空！");
			return result;
		}
		if (super.getFileList().size() == 0) {
			result.setSuccess(false);
			result.addMsg("上传文件不能为空！");
			return result;
		}
		// 读取excel
		if (excelType == -1) {
			result.setSuccess(false);
			result.addMsg("上传文件格式不符合(必须是.xls或者.xlsx格式)！");
			return result;
		}

		if (excelFile.getSize() / 1024 > FileConfig.FILE_SIZE) {
			result.setSuccess(false);
			result.addMsg("上传文件不能大于" + FileConfig.FILE_SIZE + "M！");
			return result;
		}
		return result;
	}
}
