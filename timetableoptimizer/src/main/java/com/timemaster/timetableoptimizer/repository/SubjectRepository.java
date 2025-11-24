package com.timemaster.timetableoptimizer.repository;
import com.timemaster.timetableoptimizer.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}

