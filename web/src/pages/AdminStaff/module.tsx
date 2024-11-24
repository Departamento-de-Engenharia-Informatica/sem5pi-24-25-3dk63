import { useState, useEffect, act } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IStaffService } from "@/service/IService/IStaffService";
import { useNavigate } from "react-router-dom";
import { AvailabilitySlot } from "@/model/AvailabilitySlots";
import { CreatingStaffDTO } from "@/dto/CreatingStaffDTO";

const countryOptions = [
  { code: "+351" },
  { code: "+1" },
  { code: "+44" },
];

export const useStaffListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const staffService = useInjection<IStaffService>(TYPES.staffService);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingStaff, setCreatingStaff] = useState<any | null>(null);
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [phoneNumberPart, setPhoneNumberPart] = useState("");
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null);
  const [licenseStaffToEdit, setLicenseToEdit] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<(() => void) | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);

  const itemsPerPage = 4;

  const headers = [
    "Full Name",
    "Role",
    "Email",
    "Phone",
    "Specialization",
    "Availability Slots",
    "Active",
  ];

const menuOptions = [
  {
    label: "Patients",
    action: () => navigate("/admin/patient")
  },
  {
    label: "Staff",
    action: () => navigate("/admin/staff")
  },

  {
    label: "Operation Types",
    action: () => navigate("/admin/operation-type")
  }
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
    } catch (error: any) {
      console.error( "Error searching staffs:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specializationsData = await staffService.getSpecializations();
        setSpecializations(specializationsData);
      } catch (error: any) {
      console.error( "Error searching staffs:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }
    };

    fetchSpecializations();
  }, [staffService, setAlertMessage]);

  const handleAddStaff = () => {
    setIsEditing(false);
    setStaffToEdit(null);
    setIsModalVisible(true);
};

const saveStaff = async () => {
  if (!creatingStaff) {
    setPopupMessage("Please fill in all required fields.");
    return;
  }

  try {
    const newStaff = {
      ...creatingStaff,
      phoneNumber: `${countryCode}${phoneNumberPart}`,
      specializationDescription: creatingStaff.specialization,
      availabilitySlots: availabilitySlots
    };

    const dto = buildCreateStaffDto(newStaff);

    if (!dto.licenseNumber || !dto.specializationDescription || !dto.email || !dto.role || !dto.phoneNumber || !dto.firstName || !dto.lastName) {
      setPopupMessage("Please fill in all required fields.");
      return;
    }

    await staffService.addStaff(dto);

    setPopupMessage("New staff created successfully.");
    setIsModalVisible(false);
    setAvailabilitySlots([]);
    fetchStaffs();
  } catch (error: any) {
      console.error( "Error saving staffs:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }
};

const buildCreateStaffDto = (newStaff: any): CreatingStaffDTO => {
  return {
    licenseNumber: newStaff.licenseNumber,
    specializationDescription: newStaff.specializationDescription,
    email: newStaff.email,
    role: newStaff.role,
    phoneNumber: newStaff.phoneNumber,
    firstName: newStaff.firstName,
    lastName: newStaff.lastName,
    availabilitySlots: newStaff.availabilitySlots
  };
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await staffService.deleteStaff(id);
        setStaffs((prev) => prev.filter((staff) => staff.id !== id));
        setAlertMessage("Staff deleted successfully.");
      } catch (error: any) {
      console.error( "Error deleting staff:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }
    }
  };

  const handleEdit = async (staff: any) => {

    const newStaff = {
      Email: {
        value: staff.Email
      },
      phoneNumber: {
        Number: staff.Phone
      },
      Specialization: staff.Specialization,

      'Availability Slots': staff['Availability Slots']

    };

    let formattedSlots: AvailabilitySlot[] = [];

    const existingSlots = staff['Availability Slots'];
    console.log("Existing slots before formatting:", existingSlots);

    if (typeof existingSlots === 'string') {
      formattedSlots = [];
    } else if (Array.isArray(existingSlots)) {
      formattedSlots = existingSlots.map((slot: any) => {
        if (slot.Start && slot.End) {
          return {
            start: new Date(slot.Start).toISOString().slice(0, 16),
            end: new Date(slot.End).toISOString().slice(0, 16)
          };
        } else if (slot.start && slot.end) {
          return {
            start: new Date(slot.start).toISOString().slice(0, 16),
            end: new Date(slot.end).toISOString().slice(0, 16)
          };
        }
        return { start: '', end: '' };
      }).filter(slot => slot.start || slot.end);
    }

    setAvailabilitySlots(formattedSlots);

    setStaffToEdit(newStaff);
    setIsEditing(true);
    setLicenseToEdit(staff['License Number']);
    setIsModalVisible(true);
  };

  const handleDeactivate = async (id: string) => {
    setConfirmDeactivate(() => async () => {
      try {
        await staffService.deactivateStaff(id);
        fetchStaffs();
        setPopupMessage("Staff deactivated successfully.");
      } catch (error:any) {
        const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
        setPopupMessage(errorMessage);
      }
    });
  };

  const handleCancelDeactivate = () => {
    setConfirmDeactivate(null);
  };


  const saveChanges = async () => {
    if (staffToEdit) {
      try {
        const staffUpdateData = {
          Email: {
            value: staffToEdit.Email?.value || staffToEdit.Email
          },
          phoneNumber: {
            Number: staffToEdit.phoneNumber?.Number || staffToEdit.phoneNumber
          },
          Specialization: staffToEdit.Specialization,
          AvailabilitySlots: {
            Slots: availabilitySlots.map(slot => ({
              Start: new Date(slot.start).toISOString(),
              End: new Date(slot.end).toISOString()
            }))
          }
        };

        setPopupMessage(await staffService.editStaff(licenseStaffToEdit, staffUpdateData));
        fetchStaffs();
      } catch (error:any) {
        const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
        setPopupMessage(errorMessage);
      } finally {
        setIsModalVisible(false);
      }
    }
  };

  // Search staff
  const searchStaffs = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setNoDataMessage(null);
    setStaffs([]);
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

      if (filteredData.length == 0) {
        setNoDataMessage("No data found for the requirements.");
        setAlertMessage("No data found for the requirements.");
      }
      setStaffs(filteredData);
    } catch (error: any) {
      console.error( "Error searching staffs:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage("Error searching staffs: " + errorMessage);
  }finally {
      setLoading(false);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailabilitySlots([
      ...availabilitySlots,
      { start: '', end: '' }
    ]);
  };

  const removeAvailabilitySlot = (index: number) => {
    const newSlots = availabilitySlots.filter((_, i) => i !== index);
    setAvailabilitySlots(newSlots);
  };

  const updateAvailabilitySlot = (index: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...availabilitySlots];
    newSlots[index][field] = value;
    setAvailabilitySlots(newSlots);
  };

  const formatAvailabilitySlots = (slots: AvailabilitySlot[]) => {
    if (!slots || slots.length === 0) return "No availability slots";

    return (
      <div className="text-sm">
        {slots.map((slot, index) => (
          <div key={index} className="mb-1">
            {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()}
          </div>
        ))}
      </div>
    );
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
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    setPhoneNumberPart,
    handleAddStaff,
    setCreatingStaff,
    creatingStaff,
    saveStaff,
    handleDelete,
    handleEdit,
    handleDeactivate,
    staffToEdit,
    setStaffToEdit,
    saveChanges,
    searchStaffs,
    isEditing,
    setIsEditing,
    specializations,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    noDataMessage,
    availabilitySlots,
    setAvailabilitySlots,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
    formatAvailabilitySlots
  };
};