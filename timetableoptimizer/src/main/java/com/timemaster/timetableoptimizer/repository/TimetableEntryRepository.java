package com.timemaster.timetableoptimizer.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.TimetableEntry;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
}

