package com.example.demo.service;

import com.example.demo.model.Role;
import org.springframework.stereotype.Component;

import java.util.List;

public interface RoleService {
    public Role getById(int id);

    void saveRole(Role role);

    public Role getRoleByName(String name);

    public List<Role> getRoles();
}
