package com.timemaster.timetableoptimizer.services;

import com.timemaster.timetableoptimizer.model.Room;
import com.timemaster.timetableoptimizer.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // CREATE
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    // READ ALL
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // READ BY ID
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id " + id));
    }

    // UPDATE
    public Room updateRoom(Long id, Room updatedRoom) {
        Room existing = getRoomById(id);
        existing.setRoomNumber(updatedRoom.getRoomNumber());
        existing.setCapacity(updatedRoom.getCapacity());
        existing.setRoomType(updatedRoom.getRoomType());

        return roomRepository.save(existing);
    }

    // DELETE
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
