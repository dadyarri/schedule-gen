import {
  DayWeekItem,
  ParsedLesson,
  ParsedRoom,
  ParsedTeacher,
  ParsedTime,
  ParsedType, RawDayWeek, RawTimeTable,
  TimeTable,
  TimetableItem
} from "./libs/types";
import jsonata from "jsonata";
import _ from "underscore";
import JSONCrush from "jsoncrush";

const dayNumberToShortName = (day: number): string => {
  switch (day) {
    case 1:
      return "ВС";
    case 2:
      return "ПН";
    case 3:
      return "ВТ";
    case 4:
      return "СР";
    case 5:
      return "ЧТ";
    case 6:
      return "ПТ";
    case 7:
      return "СБ";
    default:
      return "";
  }
};

const getDistinctDays = (dayWeekItems: DayWeekItem[]): number[] => {
  const days: number[] = [];
  dayWeekItems.forEach((item: DayWeekItem) => {
    if (!days.includes(item.day)) {
      days.push(item.day);
    }
  });

  return days.sort();
};

const getDistinctWeeks = (dayWeekItems: TimetableItem[]): number[] => {
  const weeks: number[] = [];
  dayWeekItems.forEach((item: TimetableItem) => {
    if (!weeks.includes(item.week)) {
      weeks.push(item.week);
    }
  });

  return weeks.sort();
};

const getLessonName = (schedule: object, timetableId: number): string => {
  let lessonName;

  try {
    lessonName = jsonata(
      `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}].$L.name`
    ).evaluate(schedule);
  } catch (TypeError) {
    lessonName = "";
  }
  return lessonName;
};

const getRoomName = (schedule: object, timetableId: number): string => {
  let roomName;

  try {
    roomName = jsonata(
      `timetableList@$T.roomList@$R[$T.roomId = $R.id][$T.id=${timetableId}].$R.name`
    ).evaluate(schedule);
  } catch (TypeError) {
    roomName = "";
  }
  return roomName;
};

const getTypeName = (schedule: object, timetableId: number): string => {
  let typeName;

  try {
    typeName = jsonata(
      `timetableList@$T.typeList@$TP[$T.typeId = $TP.id][$T.id=${timetableId}].$TP.name`
    ).evaluate(schedule);
  } catch (TypeError) {
    typeName = "";
  }
  return typeName;
};

const getTeacherName = (schedule: object, timetableId: number): string => {
  let teacherName;

  try {
    teacherName = jsonata(
      `timetableList@$T.teacherList@$TC[$T.teacherId = $TC.id][$T.id=${timetableId}].$TC.name`
    ).evaluate(schedule);
  } catch (TypeError) {
    teacherName = "";
  }
  return teacherName;
};

const getTime = (schedule: object, timetableId: number): string => {
  let time;

  try {
    time = jsonata(
      `timetableList@$T.timeList@$TM[$T.timeId = $TM.id][$T.id=${timetableId}].($TM.start & " - " & $TM.end)`
    ).evaluate(schedule);
  } catch (TypeError) {
    time = "";
  }
  return time;
};

const getListOfTime = (schedule: object): ParsedTime[] => {
  let times;

  try {
    times = jsonata(
      `timeList.{"time": start & " - " & end, "id": id}`
    ).evaluate(schedule);
  } catch (TypeError) {
    times = [];
  }

  return times;
};

const getListOfLessons = (schedule: object): ParsedLesson[] => {
  let subjects;

  try {
    subjects = jsonata(`lessonList.{"lesson": name, "id": id}`).evaluate(
      schedule
    );
  } catch (TypeError) {
    subjects = [];
  }

  return subjects;
};

const getListOfTypes = (schedule: object): ParsedType[] => {
  let types;

  try {
    types = jsonata(`typeList.{"type": name, "id": id}`).evaluate(schedule);
  } catch (TypeError) {
    types = [];
  }

  return types;
};

const getListOfTeachers = (schedule: object): ParsedTeacher[] => {
  let teachers;

  try {
    teachers = jsonata(`teacherList.{"teacher": name, "id": id}`).evaluate(
      schedule
    );
  } catch (TypeError) {
    teachers = [];
  }

  return teachers;
};

const getListOfRooms = (schedule: object): ParsedRoom[] => {
  let rooms;

  try {
    rooms = jsonata(`roomList.{"room": name, "id": id}`).evaluate(schedule);
  } catch (TypeError) {
    rooms = [];
  }

  return rooms;
};

const getDateStart = (schedule: object, timetableId: number): string => {
  let dateStart;

  try {
    dateStart = jsonata(`timetableList[id=${timetableId}].dateStart`).evaluate(
      schedule
    );
  } catch (TypeError) {
    dateStart = "";
  }
  return dateStart;
};

const getDateEnd = (schedule: object, timetableId: number): string => {
  let dateEnd;

  try {
    dateEnd = jsonata(`timetableList[id=${timetableId}].dateEnd`).evaluate(
      schedule
    );
  } catch (TypeError) {
    dateEnd = "";
  }
  return dateEnd;
};

const getColor = (
  schedule: object,
  timetableId: number
): number | undefined => {
  let color;

  try {
    color = jsonata(
      `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}].$L.color`
    ).evaluate(schedule);
  } catch (TypeError) {
    color = undefined;
  }
  return color;
};

const getTimetableByDayAndWeek = (
  schedule: object,
  day: number,
  week: number
): TimeTable[] => {
  const lessonIds = jsonata(
    `dayWeekList[day=${day}][week=${week}].timetableId`
  ).evaluate(schedule); // could be undefined

  const timetable: TimeTable[] = [];

  if (lessonIds != undefined) {
    lessonIds.map((id: number) => {
      timetable.push(buildTimetable(schedule, id, week));
    });
  }

  return _.sortBy(timetable, "time");
};

const buildTimetable = (
  schedule: object,
  timetableId: number,
  week: number
): TimeTable => {
  return {
    id: timetableId,
    lesson: getLessonName(schedule, timetableId),
    room: getRoomName(schedule, timetableId),
    type: getTypeName(schedule, timetableId),
    teacher: getTeacherName(schedule, timetableId),
    time: getTime(schedule, timetableId),
    dateStart: getDateStart(schedule, timetableId),
    dateEnd: getDateEnd(schedule, timetableId),
    color: getColor(schedule, timetableId),
    week: week
  };
};

const encodeData = (str: string): string => {
  const crushed = JSONCrush.crush(str);
  return encodeURIComponent(crushed);
};

const decodeData = (str: string): string => {
  return JSONCrush.uncrush(str);
};

const getTimeTableById = (schedule: RawTimeTable[], timetableId: number): RawTimeTable | undefined => {
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].id === timetableId) {
      return schedule[i];
    }
  }
  return undefined;
};

const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const getNextId = (json: RawTimeTable[] | RawDayWeek[]): number => {
  let max = 0;
  json.forEach(item => {
    if (item.id > max) {
      max = item.id;
    }
  });

  return max + 1;
};

export {
  dayNumberToShortName,
  getDistinctDays,
  getDistinctWeeks,
  buildTimetable,
  getTimetableByDayAndWeek,
  getListOfTime,
  getListOfLessons,
  getListOfTypes,
  getListOfTeachers,
  getListOfRooms,
  encodeData,
  decodeData,
  getTimeTableById,
  generateRandomString,
  getNextId
};
