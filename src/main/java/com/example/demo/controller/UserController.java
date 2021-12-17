package com.example.demo.controller;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/")
    public String loginPage() {
        return "redirect:/login";
    }

    /////////////////////////////////////////////////////////////////////

    @GetMapping("/user")
    public String userPage(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("user", user);
        model.addAttribute("roles", user.getRoles());
        return "/show";
    }

    @GetMapping(value = "/user/{id}")
    public String userById(@PathVariable("id") int id, Model model) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        model.addAttribute("role", user.getRoles());
        return "show";
    }

    @DeleteMapping("/user/delete/{id}")
    public String deleteU(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/logout";
    }

    ////////////////////

    @GetMapping(value = "/admin")
    public String allUsers(Model model) {
        model.addAttribute("getUsers", userService.getAllUsers());
        return "all";
    }

    @GetMapping("/admin/new")
    public String saveUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getRoles());///
        return "new";
    }

    @PostMapping("/admin/add")
    public String create(@ModelAttribute("user") User user, @RequestParam(value = "checkBoxRoles") String[] checkBoxRoles) {
        Set<Role> roleSet = new HashSet<>();
        for (String role : checkBoxRoles) {
            roleSet.add(roleService.getRoleByName(role));
        }
        user.setRoles(roleSet);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit/{id}")
    public String edit(@PathVariable("id") int id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        model.addAttribute("roles", roleService.getRoles());///
        return "edit";
    }

    @PatchMapping("/admin/edit")
    public String update(@ModelAttribute("user") User user, @RequestParam(value = "checkBoxRoles") String[] checkBoxRoles) {
        Set<Role> roleSet = new HashSet<>();
        for (String role : checkBoxRoles) {
            roleSet.add(roleService.getRoleByName(role));
        }
        user.setRoles(roleSet);
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/admin/delete/{id}")
    public String delete(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
