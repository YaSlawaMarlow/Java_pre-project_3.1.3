package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class InitUsers {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public InitUsers(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Bean
    @PostConstruct
    public void addSomeUsers() {
        User admin = new User();
        User user = new User();

        roleService.saveRole(new Role("ROLE_ADMIN"));
        roleService.saveRole(new Role("ROLE_USER"));

        Set<Role> rolesForAdmin = new HashSet<>();
        rolesForAdmin.add(roleService.getRoleByName("ROLE_ADMIN"));
        rolesForAdmin.add(roleService.getRoleByName("ROLE_USER"));

        Set<Role> rolesForUser = new HashSet<>();
        rolesForUser.add(roleService.getRoleByName("ROLE_USER"));

        admin.setName("admin");
        admin.setPassword("admin");
        admin.setAge(20);
        admin.setRoles(rolesForAdmin);
        userService.saveUser(admin);

        user.setName("user");
        user.setPassword("user");
        user.setAge(20);
        user.setRoles(rolesForUser);
        userService.saveUser(user);
    }
}
