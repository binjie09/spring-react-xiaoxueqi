package cn.edu.xju.acm.oj.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * @autor yishuida
 * @date 2018/6/24 10:42
 * @Version 1.0 com.greglturnquist.payroll.entity
 */
@Data
@Entity
public class User {

    @Id
    @GeneratedValue
    private Long userId;

    private String email;

    private Integer submit;

    private Integer solved;

    private Character defunct;

    private String ip;

    private String acsessTime;

    private Integer volume;

    private Integer language;

    private String password;

    private Date regTime;

    private String nick;

}
