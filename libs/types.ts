import {Dispatch, SetStateAction} from "react";

export type RawSchedule = {
  attendList: RawAttendance[];
  dateList: RawDate[];
  dayWeekList: RawDayWeek[];
  examGroupList: BasicListItem[];
  examList: RawExam[];
  gradeList: RawGrade[];
  gradeStatisticList: RawGradeStatistic[];
  homeWorkList: RawHomework[];
  imageList: RawImage[];
  lessonList: RawLesson[];
  noteList: RawNote[];
  roomList: BasicListItem[];
  teacherList: RawTeacher[];
  timeList: RawTime[];
  timetableList: RawTimeTable[];
  typeList: BasicListItem[];
  version: number;
  weekendList: RawWeekend[];
};

export type RawAttendance = {
  id: number;
  date: string;
  lessonId: number;
  timeId: number;
};

export type RawDate = {
  id: number;
  date: string;
  timetableId: number;
};

export type RawDayWeek = {
  id: number;
  day: number;
  timetableId: number;
  week: number;
};

export type BasicListItem = {
  id: number;
  name: string;
};

export type RawLesson = BasicListItem & {
  color: number;
};

export type RawExam = {
  id: number;
  status: boolean;
  time?: string;
  date?: string;
  groupId: number;
  lessonId: number;
  teacherId?: number;
  roomId?: number;
  gradeId?: number;
};

export type RawGrade = {
  id: number;
  value: number;
};

export type RawGradeStatistic = {
  id: number;
  date?: string;
  description?: string;
  weight: number;
  gradeId: number;
  lessonId: number;
};

export type RawTeacher = BasicListItem & {
  phone?: string;
  email?: string;
  description?: string;
};

export type RawTime = {
  id: number;
  number: number;
  start: string;
  end: string;
};

export type RawHomework = BasicListItem & {
  date?: string;
  status: boolean;
  description?: string;
  typeId?: number;
  lessonId: number;
};

export type RawImage = {
  id: number;
  homeworkId: number;
  uri: string;
};

export type RawNote = {
  id: number;
  text: string;
  date: string;
  timeId: number;
  lessonId: number;
};

export type RawTimeTable = {
  id: number;
  color?: number;
  lessonId: number;
  teacherId: number;
  roomId: number;
  typeId: number;
  timeId: number;
  dateStart?: string;
  dateEnd?: string;
};

export type RawWeekend = BasicListItem & {
  dateStart: string;
  dateEnd: string;
};

export type ScheduleCardProps = {
  id: number;
  lesson: string;
  room?: string;
  type?: string;
  teacher?: string;
  time: string;
  week: number;
  day: number;
  dateStart?: string;
  dateEnd?: string;
  color?: number;
  isInEditMode?: boolean;
  setState?: Dispatch<SetStateAction<JSX.Element[]>>;
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
  timetableList: ScheduleCardProps[];
  dayWeekList: DayWeekItem[];
};

export type ParsedTime = {
  id: number;
  time: string;
};

export type ParsedLesson = {
  id: number;
  lesson: string;
};

export type ParsedRoom = {
  id: number;
  room: string;
};

export type ParsedType = {
  id: number;
  type: string;
};

export type ParsedTeacher = {
  id: number;
  teacher: string;
};
