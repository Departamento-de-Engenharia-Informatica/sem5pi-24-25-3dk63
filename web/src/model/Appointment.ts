export interface Appointment {
    idRequest: string;
    date: string;
    time: number;
    room: number;
    active: boolean;
    [key: string]: any;
}

