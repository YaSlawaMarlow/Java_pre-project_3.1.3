package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

public interface UserDao {
    public List<User> getAllUsers();

    public void saveUser(User user);

    public void updateUser(User user);

    public void deleteUser(int id);

    public User getUser(int id);

    public User getUserByName(String name);
}