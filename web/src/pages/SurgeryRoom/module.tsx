import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { ISurgeryRoomService } from "@/service/IService/ISurgeryRoomService";
import { useNavigate } from "react-router-dom";

export const useSurgeryRoomListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const surgeryRoomService = useInjection<ISurgeryRoomService>(TYPES.surgeryRoomService);
  const [surgeryRooms, setSurgeryRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalSurgeryRooms, setTotalSurgeryRooms] = useState<number>(0);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");

  const itemsPerPage = 10;

  const headers = [
    "Room Number",
    "Type",
    "Capacity",
    "Assigned Equipment",
    "Current Status",
    "Maintenance Slots",
  ];

 const menuOptions = [
  {
    label: "Manage requests",
    action: () => navigate("/staff/operation-requests")
  },
  {
    label: "Open 3D",
    action: () => navigate("/staff/floor")
  },

  {
    label: "Surgery Rooms",
    action: () => navigate("/staff/surgery-rooms")
  }
];

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

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedSurgeryRooms = filteredData.slice(startIndex, startIndex + itemsPerPage);
      console.log("Paginated surgery rooms:", paginatedSurgeryRooms);

      setSurgeryRooms(paginatedSurgeryRooms);
    } catch (error: any) {
      console.error( "Error searching surgery rooms:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current page:", currentPage);
    fetchSurgeryRooms();
  }, [currentPage]);

  return {
    surgeryRooms,
    loading,
    error,
    headers,
    menuOptions,
    totalSurgeryRooms,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    popupMessage,
    roomNumber,
    setRoomNumber,
  };
};
