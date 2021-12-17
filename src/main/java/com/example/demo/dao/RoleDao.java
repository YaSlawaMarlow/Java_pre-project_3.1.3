package com.example.demo.dao;

import com.example.demo.model.Role;
import org.springframework.stereotype.Component;

import java.util.List;

public interface RoleDao {
    public Role getById(int id);

    public void saveRole(Role role);

    public Role getRoleByName(String name);

    public List<Role> getRoles();
}