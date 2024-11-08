import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IStaffService } from "@/service/IService/IStaffService";
import { useNavigate } from "react-router-dom";

export const useStaffListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const staffService = useInjection<IStaffService>(TYPES.staffService);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null);
  const [licenseStaffToEdit, setLicenseToEdit] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<(() => void) | null>(null); 


  const itemsPerPage = 10;

  const headers = [
    "License Number",
    "Username",
    "Role",
    "Email",
    "Phone",
    "Full Name",
    "Specialization",
    "Availability Slots",
    "Active",
    " ",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const fetchStaffs = async () => {
    setLoading(true);
    setError(null);
    try {
      const staffsData = await staffService.getStaffs();
      console.log("Data returned from getStaffs:", staffsData);
      setTotalStaffs(staffsData.length);
      const filteredData = staffsData.map((staffUser) => ({
        "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        Phone: staffUser.phoneNumber,
        "Full Name": staffUser.name,
        Specialization: staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Active: staffUser.active ? "Yes" : "No",
        id: staffUser.licenseNumber,
      }));

      console.log("Filtered data:", filteredData);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedStaffs = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setStaffs(paginatedStaffs);
    } catch (error) {
      setError("Error fetching staff.");
      setAlertMessage("Error fetching staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await staffService.deleteStaff(id);
        setStaffs((prev) => prev.filter((staff) => staff.id !== id));
        setAlertMessage("Staff deleted successfully.");
      } catch (error) {
        console.error("Error deleting staff:", error);
        setPopupMessage("Error deleting staff.");
      }
    }
  };

  const handleEdit = async (staff: any) => {
    console.log("Editing staff:", staff);

    const newStaff = {
      email: {
        value: staff.Email
      },
      phoneNumber: {
        number: staff.Phone
      },
      specialization: staff.Specialization
    };
    console.log("New staff to edit:", newStaff);

    setStaffToEdit(newStaff);
    setLicenseToEdit(staff.id);
    setIsModalVisible(true);
  };

  const handleDeactivate = async (id: string) => {
    setConfirmDeactivate(() => async () => {
      try {
        await staffService.deactivateStaff(id);
        fetchStaffs(); // Refresh the list after deactivation
        setPopupMessage("Staff deactivated successfully.");
      } catch (error) {
        console.error("Error deactivating staff:", error);
        setPopupMessage("Error deactivating staff.");
      }
    });
  };

  const handleCancelDeactivate = () => {
    setConfirmDeactivate(null); // Cancela a desativação
  };


  const saveChanges = async () => {
    if (staffToEdit) {
      try {
        await staffService.editStaff(licenseStaffToEdit, staffToEdit);
        setAlertMessage("Staff information updated successfully.");
        fetchStaffs(); // Refresh the staff list
      } catch (error) {
        console.error("Error updating staff information:", error);
        setAlertMessage("Error updating staff information.");
      } finally {
        setIsModalVisible(false); // Close the modal after saving
      }
    }
  };

  // Search staff
  const searchStaffs = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Query:", query);
      const staffsData = await staffService.searchStaffs(query);
      console.log("Data returned from searchStaffs:", staffsData);

      const filteredData = staffsData.map((staffUser) => ({
        "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        Phone: staffUser.phoneNumber,
        "Full Name": staffUser.name,
        Specialization: staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Active: staffUser.active ? "Yes" : "No",
      }));
      setStaffs(filteredData);
    } catch (error) {
      setError("Error fetching staff.");
      console.error("Error fetching staff:", error);
      setAlertMessage("Error fetching staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [currentPage]);

  return {
    staffs,
    loading,
    error,
    headers,
    menuOptions,
    totalStaffs,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    handleDelete,
    handleEdit,
    handleDeactivate,
    staffToEdit,
    setStaffToEdit,
    saveChanges,
    searchStaffs,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    
  };
};
