package cn.edu.xju.acm.oj.entity;

import com.sun.javafx.beans.IDProperty;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * @autor yishuida
 * @date 2018/6/24 11:03
 * @Version 1.0 com.greglturnquist.payroll.entity
 */

@Data
@Entity
public class Contest {

    @Id
    @GeneratedValue
    private Integer contestId;

    private String title;

    private Date startTime;

    private Date endTime;

    private Character defunct;

    private String description;

    // private Integer private;

    private Integer langmask;


}
