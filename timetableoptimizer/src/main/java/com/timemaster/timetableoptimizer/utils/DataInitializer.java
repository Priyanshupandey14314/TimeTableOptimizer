package com.timemaster.timetableoptimizer.utils;

import com.timemaster.timetableoptimizer.model.AppUser;
import com.timemaster.timetableoptimizer.model.Department;
import com.timemaster.timetableoptimizer.model.Role;
import com.timemaster.timetableoptimizer.repository.AppUserRepository;
import com.timemaster.timetableoptimizer.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(AppUserRepository userRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Init Department
            if (departmentRepository.count() == 0) {
                Department cse = new Department();
                cse.setName("CSE");
                departmentRepository.save(cse);

                Department mech = new Department();
                mech.setName("Mechanical");
                departmentRepository.save(mech);
            }

            // Init or Update Admin User
            try {
                System.out.println(">>> CHECKING ADMIN USER... <<<");
                AppUser admin = userRepository.findByUsername("admin").orElse(new AppUser());
                admin.setUsername("admin");
                String encodedPass = passwordEncoder.encode("pass-admin");
                admin.setPassword(encodedPass);
                admin.setRoles(Set.of(Role.ADMIN));
                userRepository.save(admin);
                System.out.println(
                        ">>> ADMIN PASSWORD RESET TO 'pass-admin' (Hash: " + encodedPass.substring(0, 10) + "...) <<<");

                // Fallback Superadmin
                AppUser superadmin = userRepository.findByUsername("superadmin").orElse(new AppUser());
                superadmin.setUsername("superadmin");
                superadmin.setPassword(passwordEncoder.encode("pass-admin"));
                superadmin.setRoles(Set.of(Role.ADMIN));
                userRepository.save(superadmin);
                System.out.println(">>> SUPERADMIN CREATED/UPDATED (superadmin / pass-admin) <<<");

            } catch (Exception e) {
                System.err.println(">>> DATA INITIALIZER FAILED <<<");
                e.printStackTrace();
            }
        };
    }
}
