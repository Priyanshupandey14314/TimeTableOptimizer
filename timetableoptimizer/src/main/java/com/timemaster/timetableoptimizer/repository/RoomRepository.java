package com.timemaster.timetableoptimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
}

