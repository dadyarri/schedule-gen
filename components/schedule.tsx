import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import jsonata from "jsonata";
import ScheduleCard from "./schedule-card";

type Props = {
  schedule: string;
};

type DayWeekItem = {
  id: number;
  day: number;
  timetableId: number;
  week: number;
};

type TimetableItem = {
  timetableId: number;
  week: number;
};

const Schedule = ({ schedule }: Props) => {
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

  const getIdsOfTimetable = (dayWeekItems: DayWeekItem[], day: number) => {
    const timetables: TimetableItem[] = [];
    dayWeekItems.forEach((item: DayWeekItem) => {
      if (item.day === day) {
        timetables.push({ timetableId: item.timetableId, week: item.week });
      }
    });

    return timetables;
  };

  const getLessonName = (schedule: object, timetableId: number) => {
    return jsonata(
      `timetableList@$T.lessonList@$L[$T.lessonId = $L.id][$T.id=${timetableId}]{"lesson": $L.name}`
    ).evaluate(schedule);
  };

  const getRoomName = (schedule: object, timetableId: number) => {
    return jsonata(
      `timetableList@$T.roomList@$R[$T.roomId = $R.id][$T.id=${timetableId}]{"room": $R.name}`
    ).evaluate(schedule);
  };

  const getTypeName = (schedule: object, timetableId: number) => {
    return jsonata(
      `timetableList@$T.typeList@$TP[$T.typeId = $TP.id][$T.id=${timetableId}]{"type": $TP.name}`
    ).evaluate(schedule);
  };

  const getTeacherName = (schedule: object, timetableId: number) => {
    return jsonata(
      `timetableList@$T.teacherList@$TC[$T.teacherId = $TC.id][$T.id=${timetableId}]{"teacher": $TC.name}`
    ).evaluate(schedule);
  };

  const getTime = (schedule: object, timetableId: number) => {
    return jsonata(
      `timetableList@$T.timeList@$TM[$T.timeId = $TM.id][$T.id=${timetableId}]{"time": $TM.start & " - " & $TM.end}`
    ).evaluate(schedule);
  };

  const buildTimetable = (
    schedule: object,
    timetableId: number,
    week: number
  ) => {
    return {
      lesson: getLessonName(schedule, timetableId).lesson,
      room: getRoomName(schedule, timetableId).room,
      type: getTypeName(schedule, timetableId).type,
      teacher: getTeacherName(schedule, timetableId).teacher,
      time: getTime(schedule, timetableId).time,
      week: week
    };
  };

  if (!schedule) {
    console.error("какая-то хуйня!");
    return <></>;
  } else {
    const json = JSON.parse(schedule);

    const days: number[] = getDistinctDays(json.dayWeekList);
    const tt = buildTimetable(json, 21, 2);

    return (
      <Box mt={10}>
        <Tabs variant={"solid-rounded"}>
          <TabList>
            {days.map(
              (day: number) => (
                <Tab key={day}>{dayNumberToShortName(day)}</Tab>
              ),
              []
            )}
          </TabList>

          <TabPanels>
            {days.map((day: number) => {
              const timetableIds = getIdsOfTimetable(json.dayWeekList, day);
              return (
                <TabPanel>
                  {timetableIds.map((tt: TimetableItem) => (
                    <ScheduleCard
                      {...buildTimetable(json, tt.timetableId, tt.week)}
                    />
                  ))}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
};

export default Schedule;
