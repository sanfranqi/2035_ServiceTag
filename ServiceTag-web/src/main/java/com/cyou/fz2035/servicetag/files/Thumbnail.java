package com.cyou.fz2035.servicetag.files;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageDecoder;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

/**
 * 图片缩略图处理工具类
 * 
 * @author linhao
 * @date 2014年1月24日 下午1:36:33
 */
@SuppressWarnings("restriction")
public class Thumbnail {
	/**
	 * 生成缩略图 fromFileStr:原图片路径 saveToFileStr:缩略图路径 width:缩略图的宽 height:缩略图的高
	 */
	public static void saveImageAsJpg(String fromFileStr, String saveToFileStr, int width, int height,
			boolean equalProportion) throws Exception {
		BufferedImage srcImage;
		String imgType = "JPEG";
		if (fromFileStr.toLowerCase().endsWith(".png")) {
			imgType = "PNG";
		}
		File fromFile = new File(fromFileStr);
		File saveFile = new File(saveToFileStr);
		srcImage = ImageIO.read(fromFile);
		if (width > 0 || height > 0) {
			srcImage = resize(srcImage, width, height, equalProportion);
		}
		ImageIO.write(srcImage, imgType, saveFile);
	}

	public static BufferedImage saveImageAsJpg2(String fromFileStr, String saveToFileStr) throws Exception {
		BufferedImage srcImage;
		@SuppressWarnings("unused")
		String imgType = "JPEG";
		if (fromFileStr.toLowerCase().endsWith(".png")) {
			imgType = "PNG";
		}
		File fromFile = new File(fromFileStr);
		File saveFile = new File(saveToFileStr);
		JPEGImageDecoder decoder = JPEGCodec.createJPEGDecoder(new FileInputStream(fromFile));  
		srcImage = decoder.decodeAsBufferedImage();  
		ImageIO.write(srcImage, "JPEG", saveFile);  
		return srcImage;
	}

	/**
	 * 将原图片的BufferedImage对象生成缩略图 source：原图片的BufferedImage对象 targetW:缩略图的宽
	 * targetH:缩略图的高
	 */
	public static BufferedImage resize(BufferedImage source, int targetW, int targetH, boolean equalProportion) {
		
		int type = source.getType();
		BufferedImage target = null;
		double sx = (double) targetW / source.getWidth();
		double sy = (double) targetH / source.getHeight();
		// 这里想实现在targetW，targetH范围内实现等比例的缩放
		// 如果不需要等比例的缩放则下面的if else语句注释调即可
		if (equalProportion) {
			if (sx > sy) {
				sx = sy;
				targetW = (int) (sx * source.getWidth());
			} else {
				sy = sx;
				targetH = (int) (sx * source.getHeight());
			}
		}
		if (type == BufferedImage.TYPE_CUSTOM) {
			ColorModel cm = source.getColorModel();
			WritableRaster raster = cm.createCompatibleWritableRaster(targetW, targetH);
			boolean alphaPremultiplied = cm.isAlphaPremultiplied();
			target = new BufferedImage(cm, raster, alphaPremultiplied, null);
		} else {
			target = new BufferedImage(targetW, targetH, type);
			Graphics2D g = target.createGraphics();
			g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
			g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));
			g.dispose();
		}
		return target;
	}

	/** 对图片裁剪，并把裁剪完的新图片保存 */
	public static void cut(String srcpath, String subpath, int x, int y, int width, int height) throws IOException {
		FileInputStream is = null;
		ImageInputStream iis = null;
		String imgType = "JPEG";
		if (srcpath.toLowerCase().endsWith(".png")) {
			imgType = "PNG";
		}
		if (srcpath.toLowerCase().endsWith(".gif")) {
			imgType = "GIF";
		}
		try {
			// 读取图片文件
			is = new FileInputStream(srcpath);
			/*
			 * 返回包含所有当前已注册 ImageReader 的 Iterator，这些 ImageReader 声称能够解码指定格式。
			 * 参数：formatName - 包含非正式格式名称 . （例如 "jpeg" 或 "tiff"）等 。
			 */
			Iterator<ImageReader> it = ImageIO.getImageReadersByFormatName(imgType);
			ImageReader reader = it.next();
			// 获取图片流
			iis = ImageIO.createImageInputStream(is);
			/*
			 * <p>iis:读取源.true:只向前搜索 </p>.将它标记为 ‘只向前搜索’。
			 * 此设置意味着包含在输入源中的图像将只按顺序读取，可能允许 reader 避免缓存包含与以前已经读取的图像关联的数据的那些输入部分。
			 */
			reader.setInput(iis, true);
			/*
			 * <p>描述如何对流进行解码的类<p>.用于指定如何在输入时从 Java Image I/O
			 * 框架的上下文中的流转换一幅图像或一组图像。用于特定图像格式的插件 将从其 ImageReader 实现的
			 * getDefaultReadParam 方法中返回 ImageReadParam 的实例。
			 */
			ImageReadParam param = reader.getDefaultReadParam();
			/*
			 * 图片裁剪区域。Rectangle 指定了坐标空间中的一个区域，通过 Rectangle 对象
			 * 的左上顶点的坐标（x，y）、宽度和高度可以定义这个区域。
			 */
			Rectangle rect = new Rectangle(x, y, width, height);
			// 提供一个 BufferedImage，将其用作解码像素数据的目标。
			param.setSourceRegion(rect);
			/*
			 * 使用所提供的 ImageReadParam 读取通过索引 imageIndex 指定的对象，并将 它作为一个完整的
			 * BufferedImage 返回。
			 */
			BufferedImage bi = reader.read(0, param);
			// 保存新图片
			ImageIO.write(bi, imgType, new File(subpath));
		} finally {
			if (is != null)
				is.close();
			if (iis != null)
				iis.close();
		}

	}
	public static void cut(int x1, int y1, int width, int height,  
            String sourcePath, String descpath) {  
  
        FileInputStream is = null;  
        ImageInputStream iis = null;  
        try {  
            is = new FileInputStream(sourcePath);  
            String fileSuffix = sourcePath.substring(sourcePath  
                    .lastIndexOf(".") + 1);  
            Iterator<ImageReader> it = ImageIO  
                    .getImageReadersByFormatName(fileSuffix);  
            ImageReader reader = it.next();  
            iis = ImageIO.createImageInputStream(is);  
            reader.setInput(iis, true);  
            ImageReadParam param = reader.getDefaultReadParam();  
            Rectangle rect = new Rectangle(x1, y1, width, height);  
            param.setSourceRegion(rect);  
            BufferedImage bi = reader.read(0, param);  
            ImageIO.write(bi, fileSuffix, new File(descpath));  
        } catch (Exception ex) {  
            ex.printStackTrace();  
        } finally {  
            if (is != null) {  
                try {  
                    is.close();  
                } catch (IOException e) {  
                    e.printStackTrace();  
                }  
                is = null;  
            }  
            if (iis != null) {  
                try {  
                    iis.close();  
                } catch (IOException e) {  
                    e.printStackTrace();  
                }  
                iis = null;  
            }  
        }  
  
    }  
	public static void main(String[] args) throws IOException {
		// try {
		// Thumbnail.saveImageAsJpg("c://test.png", "c://test2.png", 100, 100,
		// true);
		// } catch (Exception e) {
		// e.printStackTrace();
		// }
		 Thumbnail.cut(50, 50, 150, 150,"c:\\test.png", "c:\\c.jpg" );
	}
}
