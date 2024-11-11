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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [surgeryRoomToEdit, setSurgeryRoomToEdit] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<(() => void) | null>(null);
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
    { label: "Homepage", action: () => navigate("/") },
    { label: "Staff Menu", action: () => navigate("/staff") },
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
    } catch (error) {
      console.error("Error fetching surgery rooms:", error);
      setError("Error fetching surgery rooms.");
      setAlertMessage("Error fetching surgery rooms.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log(`Deleting surgery room with id: ${id}`);
    if (window.confirm("Are you sure you want to delete this surgery room?")) {
      try {
        await surgeryRoomService.delete(id);
        console.log(`Surgery room with id ${id} deleted successfully`);
        setSurgeryRooms((prev) => prev.filter((room) => room.id !== id));
        setAlertMessage("Surgery room deleted successfully.");
      } catch (error) {
        console.error("Error deleting surgery room:", error);
        setPopupMessage("Error deleting surgery room.");
      }
    }
  };

  const handleEdit = async (surgeryRoom: any) => {
    console.log("Editing surgery room:", surgeryRoom);
    setSurgeryRoomToEdit(surgeryRoom);
    setIsModalVisible(true);
  };

  const saveChanges = async () => {
    console.log("Saving changes for surgery room:", surgeryRoomToEdit);
    if (surgeryRoomToEdit) {
      try {
        await surgeryRoomService.update(surgeryRoomToEdit.id, surgeryRoomToEdit);
        setAlertMessage("Surgery room updated successfully.");
        fetchSurgeryRooms();
      } catch (error) {
        console.error("Error updating surgery room:", error);
        setAlertMessage("Error updating surgery room.");
      } finally {
        setIsModalVisible(false);
      }
    }
  };

  const searchSurgeryRooms = async () => {
    console.log("Searching for surgery room with number:", roomNumber);
    setLoading(true);
    setError(null);

    try {
      if (!roomNumber) {
        setError("Room number is required.");
        setPopupMessage("Room number is required.");
        setLoading(false);
        return;
      }

      const surgeryRoomData = await surgeryRoomService.getByNumber(roomNumber);

      if (!surgeryRoomData) {
        setPopupMessage("No surgery room found.");
      } else {
        setSurgeryRooms([surgeryRoomData]);
      }
    } catch (error) {
      console.error("Error searching surgery room:", error);
      setError("No surgery room found.");
      setPopupMessage("No surgery room found.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeactivate = () => {
    console.log("Canceling deactivate action...");
    setConfirmDeactivate(null);
    setPopupMessage(null);
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
    isModalVisible,
    setIsModalVisible,
    handleDelete,
    handleEdit,
    surgeryRoomToEdit,
    setSurgeryRoomToEdit,
    saveChanges,
    searchSurgeryRooms,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    roomNumber,
    setRoomNumber,
  };
};
