package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.Room;
import com.timemaster.timetableoptimizer.services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<Room> create(@RequestBody Room room) {
        return org.springframework.http.ResponseEntity.ok(roomService.addRoom(room));
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<List<Room>> getAll() {
        return org.springframework.http.ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Room> get(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        if (room == null) {
            throw new com.timemaster.timetableoptimizer.exception.ResourceNotFoundException(
                    "Room not found with id: " + id);
        }
        return org.springframework.http.ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room room) {
        return org.springframework.http.ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
