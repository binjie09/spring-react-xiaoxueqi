package cn.edu.xju.acm.oj.dao;

import cn.edu.xju.acm.oj.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.criteria.CriteriaBuilder;

/**
 * @autor yishuida
 * @date 2018/6/24 18:59
 * @Version 1.0 cn.edu.xju.acm.oj.dao
 */
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
}
