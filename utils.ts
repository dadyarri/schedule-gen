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
  let roomName;

  try {
    roomName = jsonata(
      `timetableList@$T.roomList@$R[$T.roomId = $R.id][$T.id=${timetableId}]{"room": $R.name}`
    ).evaluate(schedule);
  } catch (TypeError) {
    roomName = { room: "" };
  }
  return roomName;
};

const getTypeName = (
  schedule: object,
  timetableId: number
): { type: string } => {
  let typeName;

  try {
    typeName = jsonata(
      `timetableList@$T.typeList@$TP[$T.typeId = $TP.id][$T.id=${timetableId}]{"type": $TP.name}`
    ).evaluate(schedule);
  } catch (TypeError) {
    typeName = { type: "" };
  }
  return typeName;
};

const getTeacherName = (
  schedule: object,
  timetableId: number
): { teacher: string } => {
  let teacherName;

  try {
    teacherName = jsonata(
      `timetableList@$T.teacherList@$TC[$T.teacherId = $TC.id][$T.id=${timetableId}]{"teacher": $TC.name}`
    ).evaluate(schedule);
  } catch (TypeError) {
    teacherName = { teacher: "" };
  }
  return teacherName;
};

const getTime = (schedule: object, timetableId: number): { time: string } => {
  let time;

  try {
    time = jsonata(
      `timetableList@$T.timeList@$TM[$T.timeId = $TM.id][$T.id=${timetableId}]{"time": $TM.start & " - " & $TM.end}`
    ).evaluate(schedule);
  } catch (TypeError) {
    time = { time: "" };
  }
  return time;
};

const getListOfTime = (schedule: object): { time: string; id: number }[] => {
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

const getListOfSubjects = (
  schedule: object
): { subject: string; id: number }[] => {
  let subjects;

  try {
    subjects = jsonata(`lessonList.{"subject": name, "id": id}`).evaluate(
      schedule
    );
  } catch (TypeError) {
    subjects = [];
  }

  return subjects;
};

const getListOfTypes = (schedule: object): { type: string; id: number }[] => {
  let types;

  try {
    types = jsonata(`typeList.{"type": name, "id": id}`).evaluate(schedule);
  } catch (TypeError) {
    types = [];
  }

  return types;
};

const getListOfTeachers = (
  schedule: object
): { teacher: string; id: number }[] => {
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

const getListOfRooms = (schedule: object): { room: string; id: number }[] => {
  let rooms;

  try {
    rooms = jsonata(`roomList.{"room": name, "id": id}`).evaluate(schedule);
  } catch (TypeError) {
    rooms = [];
  }

  return rooms;
};

const getDateStart = (
  schedule: object,
  timetableId: number
): { dateStart: string } => {
  let dateStart;

  try {
    dateStart = jsonata(
      `timetableList[id=${timetableId}]{"dateStart": dateStart}`
    ).evaluate(schedule);
  } catch (TypeError) {
    dateStart = { dateStart: "" };
  }
  return dateStart;
};

const getDateEnd = (
  schedule: object,
  timetableId: number
): { dateEnd: string } => {
  let dateEnd;

  try {
    dateEnd = jsonata(
      `timetableList[id=${timetableId}]{"dateEnd": dateEnd}`
    ).evaluate(schedule);
  } catch (TypeError) {
    dateEnd = { dateEnd: "" };
  }
  return dateEnd;
};

const getColor = (schedule: object, timetableId: number): { color: number } => {
  let color;

  try {
    color = jsonata(
      `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}]{"color": $L.color}`
    ).evaluate(schedule);
  } catch (TypeError) {
    color = { color: "" };
  }
  return color;
};

const getTimetableByDayAndWeek = (
  schedule: object,
  day: number,
  week: number
): TimeTable[] => {
  const lessonIds = jsonata(
    `dayWeekList[day=${day}][week=${week}].[timetableId]`
  ).evaluate(schedule); // could be undefined

  const timetable: TimeTable[] = [];

  if (lessonIds != undefined) {
    lessonIds.map((id: number[]) => {
      timetable.push(buildTimetable(schedule, id[0], week));
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

function encodeData(str: string) {
  return encodeURIComponent(str);
}

function decodeData(str: string) {
  return decodeURIComponent(str);
}

const getTimeTableById = (
  schedule: {
    timetableList: [
      {
        roomId: number;
        teacherId: number;
        typeId: number;
        lessonId: number;
        timeId: number;
        id: number;
      }
    ];
  },
  timetableId: number
) => {
  for (let i = 0; i < schedule.timetableList.length; i++) {
    if (schedule.timetableList[i].id === timetableId) {
      return schedule.timetableList[i];
    }
  }
  return null;
};

export {
  dayNumberToShortName,
  getDistinctDays,
  getDistinctWeeks,
  buildTimetable,
  getTimetableByDayAndWeek,
  getListOfTime,
  getListOfSubjects,
  getListOfTypes,
  getListOfTeachers,
  getListOfRooms,
  encodeData,
  decodeData,
  getTimeTableById
};
