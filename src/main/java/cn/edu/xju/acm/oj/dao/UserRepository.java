package cn.edu.xju.acm.oj.dao;

import cn.edu.xju.acm.oj.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @autor yishuida
 * @date 2018/6/24 19:01
 * @Version 1.0 cn.edu.xju.acm.oj.entity
 */
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

}
