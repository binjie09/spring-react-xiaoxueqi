package cn.edu.xju.acm.oj.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * @autor yishuida
 * @date 2018/6/24 11:12
 * @Version 1.0 com.greglturnquist.payroll.entity
 */

@Data
@Entity
public class SourceCode {

    @Id
    @GeneratedValue
    private Integer solutionId;

    private String source;

}
