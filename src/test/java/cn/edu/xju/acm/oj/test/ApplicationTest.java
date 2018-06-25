package cn.edu.xju.acm.oj.test;

import cn.edu.xju.acm.oj.dao.CompileInfoRepository;
import cn.edu.xju.acm.oj.dao.UserRepository;
import cn.edu.xju.acm.oj.entity.CompileInfo;
import cn.edu.xju.acm.oj.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @autor yishuida
 * @date 2018/6/24 16:15
 * @Version 1.0 cn.xju.edu.acm.oj.test
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class ApplicationTest {
    @Autowired
    UserRepository repository;


    @Test
    public void addUser() {


    }
}
