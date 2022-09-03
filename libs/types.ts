export type TimeTable = {
  id: number;
  lesson: string;
  room: string;
  type: string;
  teacher: string;
  time: string;
  week: number;
  dateStart: string;
  dateEnd: string;
  color?: number;
};

export type DayWeekItem = {
  id: number;
  day: number;
  timetableId: number;
  week: number;
};

export type TimetableItem = {
  timetableId: number;
  week: number;
};

export type ParsedSchedule = {
  dayWeekList: DayWeekItem[];
};
