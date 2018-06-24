package cn.edu.xju.acm.oj.entity;

import com.sun.javafx.beans.IDProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * @autor yishuida
 * @date 2018/6/24 10:55
 * @Version 1.0 com.greglturnquist.payroll.entity
 */

@Data
@Entity
public class Solution {

    @Id
    @GeneratedValue
    private Integer solutionId;

    private Integer problemId;

    private Long userId;

    private Integer time;

    private Integer memory;

    private Date inDate;

    private String className;

    private String result;

    private Integer language;

    private String ip;

    private Integer contestId;

    private Integer num;

}