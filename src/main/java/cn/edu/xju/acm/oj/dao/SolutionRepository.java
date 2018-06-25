package cn.edu.xju.acm.oj.dao;

import cn.edu.xju.acm.oj.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @autor yishuida
 * @date 2018/6/24 19:00
 * @Version 1.0 cn.edu.xju.acm.oj.dao
 */
public interface SolutionRepository extends JpaRepository<Solution, Integer> {
}
