import api from '../utils/api';

export interface ScheduleResponseDto {
  id: number;
  title: string;
  startDateTime: string;
  endDateTime: string;
  relatedLink?: string;
}

export const fetchSchedules = async (): Promise<ScheduleResponseDto[]> => {
  const response = await api.get<ScheduleResponseDto[]>('/schedules');
  return response.data;
};
