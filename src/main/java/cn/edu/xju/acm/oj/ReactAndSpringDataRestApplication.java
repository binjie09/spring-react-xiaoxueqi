/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package cn.edu.xju.acm.oj;

import cn.edu.xju.acm.oj.dao.AuthorityRepository;
import cn.edu.xju.acm.oj.dao.UserRepository;
import cn.edu.xju.acm.oj.entity.Authority;
import cn.edu.xju.acm.oj.entity.User;
import cn.edu.xju.acm.oj.utils.PassUtil;
import org.hibernate.SessionFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import javax.persistence.EntityManagerFactory;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@SpringBootApplication
@EnableAutoConfiguration
@EnableWebSecurity
@ComponentScan("cn.edu.xju.acm.oj")
public class ReactAndSpringDataRestApplication {

	public static void main(String[] args) {

		ConfigurableApplicationContext context =
				SpringApplication.run(ReactAndSpringDataRestApplication.class, args);
		UserRepository userRepository = context.getBean(UserRepository.class);
		AuthorityRepository authorityRepository = context.getBean(AuthorityRepository.class);

		Authority adminAuthority = getOrGreateAuthority("ROLE_ADMIN", authorityRepository);
		Authority basicAuthority = getOrGreateAuthority("ROLE_BASIC", authorityRepository);

		User admin = new User("admin" , "123456");
		encodePassword(admin);
		admin.getAuthorities().add(adminAuthority);
		admin.getAuthorities().add(basicAuthority);

		User test = new User("test", "test");
		encodePassword(test);
		test.getAuthorities().add(basicAuthority);

		userRepository.save(admin);
		userRepository.save(test);

		//SpringApplication.run(ReactAndSpringDataRestApplication.class, args);
	}



	private static void encodePassword(User user) {
		user.setPassword(PassUtil.encode(user.getUsername(), user.getPassword()));
	}

	private static Authority getOrGreateAuthority(String authorityText, AuthorityRepository repository) {
		Authority authority = repository.findByAuthority(authorityText);
		if (authority == null) {
			authority = new Authority(authorityText);
			repository.save(authority);
		}
		return authority;
	}

	@Bean
	@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
	public SessionFactory sessionFactory(EntityManagerFactory emf) {
		return emf.unwrap(SessionFactory.class);
	}

	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasename("classpath:org/springframework/security/messages");

		ReloadableResourceBundleMessageSource messageSourceLocal = new ReloadableResourceBundleMessageSource();
		messageSourceLocal.setBasename("classpath:messages");
		messageSourceLocal.setParentMessageSource(messageSource);

		return messageSourceLocal;
	}
}
// end::code[]