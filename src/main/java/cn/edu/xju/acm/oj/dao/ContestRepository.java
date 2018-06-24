package cn.edu.xju.acm.oj.dao;

import cn.edu.xju.acm.oj.entity.Contest;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @autor yishuida
 * @date 2018/6/24 18:56
 * @Version 1.0 cn.edu.xju.acm.oj.dao
 */
public interface ContestRepository  extends JpaRepository<Contest, Integer> {
}
