package cn.edu.xju.acm.oj.entity;

import lombok.Data;
import org.springframework.security.core.userdetails.*;

import javax.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * @autor yishuida
 * @date 2018/6/24 10:42
 * @Version 1.0 com.greglturnquist.payroll.entity
 */
@Data
@Entity
public class User implements UserDetails{

    @Id
    @GeneratedValue
    private Long userId;

    private String username;

    private String password;


    @ManyToMany
    @JoinTable(name = "user_authorities",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "authority_id")})
    private Set<Authority> authorities = new HashSet <>();

    private String email;

    private Integer submit;

    private Integer solved;

    private Character defunct;

    private String ip;

    private String acsessTime;

    private Integer volume;

    private Integer language;

    private Date regTime;

    private String nick;

    public User(String username, String password) {
        this.username = username;
        this.password = password;

    }

    public User() {

    }


    @Override
    public Set<Authority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
