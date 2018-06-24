package cn.edu.xju.acm.oj.entity;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * @autor yishuida
 * @date 2018/6/24 11:02
 * @Version 1.0 com.greglturnquist.payroll.entity
 */

@Data
@Entity
public class ContestProblem {

    @Id
    @GeneratedValue
    private Integer id;

    private Integer problemId;

    private Integer contestId;

    private String title;

    private Integer num;


}
