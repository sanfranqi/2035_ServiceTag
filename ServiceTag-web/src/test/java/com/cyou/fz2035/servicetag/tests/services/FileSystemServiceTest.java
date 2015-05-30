package com.cyou.fz2035.servicetag.tests.services;

import java.io.FileInputStream;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

//import com.cyou.fz2035.filesystem.api.service.FileSystemApi;

public class FileSystemServiceTest extends BaseTestService {

	@Autowired
	//FileSystemApi fileSystemApi;

	@Test
	public void testUpload() {

		try {
			//fileSystemApi.uploadFile("\\mytest\\test.jpg", new FileInputStream("D:\\tmp\\aa.jpg"));
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
