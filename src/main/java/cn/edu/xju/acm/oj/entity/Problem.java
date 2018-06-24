package cn.edu.xju.acm.oj.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * @autor yishuida
 * @date 2018/6/24 10:51
 * @Version 1.0 com.greglturnquist.payroll.entity
 */
@Data
@Entity
public class Problem {

    @Id
    @GeneratedValue
    private Integer problemId;

    private String title;

    private String description;

    private String input;

    private String output;

    private String sampleInput;

    private String sampleOutput;

    private Character spj;

    private String hint;

    private String source;

    private String sampleProgram;
}
