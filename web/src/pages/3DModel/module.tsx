import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { ISurgeryRoomService } from "@/service/IService/ISurgeryRoomService";
import { useNavigate } from "react-router-dom";

export const useSurgeryRoomListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const surgeryRoomService = useInjection<ISurgeryRoomService>(TYPES.surgeryRoomService);
  const [surgeryRooms, setSurgeryRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSurgeryRooms, setTotalSurgeryRooms] = useState<number>(0);

  const fetchSurgeryRooms = async () => {
    console.log("Fetching surgery rooms...");
    setLoading(true);
    setError(null);
    try {
      const surgeryRoomsData = await surgeryRoomService.getAll();
      console.log("Fetched surgery rooms:", surgeryRoomsData);
      setTotalSurgeryRooms(surgeryRoomsData.length);

      const filteredData = surgeryRoomsData.map((room) => ({
        "Room Number": room.roomNumber,
        "Type": room.type.toString(),
        "Capacity": room.capacity,
        "Assigned Equipment": room.assignedEquipment.map((equipment) => equipment.name).join(", "),
        "Current Status": room.currentStatus,
        "Maintenance Slots": room.maintenanceSlots.map((slot) => `${slot.startTime} - ${slot.endTime}`).join(", "),
      }));

      console.log("Mapped surgery rooms:", filteredData);

      setSurgeryRooms(filteredData);
    } catch (error) {
      console.error("Error fetching surgery rooms:", error);
      setError("Error fetching surgery rooms.");
      setAlertMessage("Error fetching surgery rooms.");
    } finally {
      setLoading(false);
    }
  };

  return {
    surgeryRooms,
    loading,
    error,
    totalSurgeryRooms,
  };
};
