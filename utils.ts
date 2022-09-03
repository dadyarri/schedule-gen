import { DayWeekItem, TimeTable, TimetableItem } from "./libs/types";
import jsonata from "jsonata";
import _ from "underscore";

const dayNumberToShortName = (day: number) => {
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

const getDistinctDays = (dayWeekItems: DayWeekItem[]) => {
  const days: number[] = [];
  dayWeekItems.forEach((item: DayWeekItem) => {
    if (!days.includes(item.day)) {
      days.push(item.day);
    }
  });

  return days.sort();
};

const getDistinctWeeks = (dayWeekItems: TimetableItem[]) => {
  const weeks: number[] = [];
  dayWeekItems.forEach((item: TimetableItem) => {
    if (!weeks.includes(item.week)) {
      weeks.push(item.week);
    }
  });

  return weeks.sort();
};

const getLessonName = (
  schedule: object,
  timetableId: number
): { lesson: string } => {
  return jsonata(
    `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}]{"lesson": $L.name}`
  ).evaluate(schedule);
};

const getRoomName = (
  schedule: object,
  timetableId: number
): { room: string } => {
  return jsonata(
    `timetableList@$T.roomList@$R[$T.roomId = $R.id][$T.id=${timetableId}]{"room": $R.name}`
  ).evaluate(schedule);
};

const getTypeName = (
  schedule: object,
  timetableId: number
): { type: string } => {
  return jsonata(
    `timetableList@$T.typeList@$TP[$T.typeId = $TP.id][$T.id=${timetableId}]{"type": $TP.name}`
  ).evaluate(schedule);
};

const getTeacherName = (
  schedule: object,
  timetableId: number
): { teacher: string } => {
  return jsonata(
    `timetableList@$T.teacherList@$TC[$T.teacherId = $TC.id][$T.id=${timetableId}]{"teacher": $TC.name}`
  ).evaluate(schedule);
};

const getTime = (schedule: object, timetableId: number): { time: string } => {
  return jsonata(
    `timetableList@$T.timeList@$TM[$T.timeId = $TM.id][$T.id=${timetableId}]{"time": $TM.start & " - " & $TM.end}`
  ).evaluate(schedule);
};

const getDateStart = (
  schedule: object,
  timetableId: number
): { dateStart: string } => {
  return jsonata(
    `timetableList[id=${timetableId}]{"dateStart": dateStart}`
  ).evaluate(schedule);
};

const getDateEnd = (
  schedule: object,
  timetableId: number
): { dateEnd: string } => {
  return jsonata(
    `timetableList[id=${timetableId}]{"dateEnd": dateEnd}`
  ).evaluate(schedule);
};

const getColor = (schedule: object, timetableId: number): {color: number} => {
  return jsonata(
    `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}]{"color": $L.color}`
  ).evaluate(schedule);
}

const getTimetableByDayAndWeek = (
  schedule: object,
  day: number,
  week: number
): TimeTable[] => {
  const lessonIds = jsonata(
    `dayWeekList[day=${day}][week=${week}].timetableId`
  ).evaluate(schedule);

  const timetable: TimeTable[] = [];

  lessonIds.map((id: number) => {
    timetable.push(buildTimetable(schedule, id, week));
  });

  return _.sortBy(timetable, "time");
};

const buildTimetable = (
  schedule: object,
  timetableId: number,
  week: number
): TimeTable => {
  return {
    lesson: getLessonName(schedule, timetableId).lesson,
    room: getRoomName(schedule, timetableId).room,
    type: getTypeName(schedule, timetableId).type,
    teacher: getTeacherName(schedule, timetableId).teacher,
    time: getTime(schedule, timetableId).time,
    dateStart: getDateStart(schedule, timetableId).dateStart,
    dateEnd: getDateEnd(schedule, timetableId).dateEnd,
    color: getColor(schedule, timetableId).color,
    week: week
  };
};

export {
  dayNumberToShortName,
  getDistinctDays,
  getDistinctWeeks,
  buildTimetable,
  getTimetableByDayAndWeek
};
