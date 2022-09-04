import {Button, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {
  dayNumberToShortName,
  generateRandomString,
  getDistinctDays,
  getDistinctWeeks,
  getNextId,
  getTimetableByDayAndWeek
} from "../utils";
import {RawSchedule, TimeTable} from "../libs/types";
import ScheduleCard from "./schedule-card";
import moment from "moment";
import {PlusSquareIcon} from "@chakra-ui/icons";
import {ReactNode, useState} from "react";

type Props = {
  json: RawSchedule;
};

const ScheduleDaysTab = ({ json }: Props) => {
  const days: number[] = getDistinctDays(json.dayWeekList);
  const weeks: number[] = getDistinctWeeks(json.dayWeekList);

  const [lessons, setLessons] = useState([] as JSX.Element[]);

  const getCurrentWeek = (): number => {
    return moment().week() % 2;
  };

  const ifCurrentDateIsInRange = (
    dateStart?: string,
    dateEnd?: string
  ): boolean => {
    if (!dateStart || !dateEnd) {
      return true;
    }

    const currentDate = moment();
    const startDate = moment(dateStart, "MMM DD, YYYY HH:mm:ss");
    const endDate = moment(dateEnd, "MMM DD, YYYY HH:mm:ss");

    return currentDate.isBetween(startDate, endDate);
  };

  const addLesson = (json: RawSchedule) => {
    // const newLesson: TimeTable = {
    //   id: 100,
    //   lesson: "",
    //   room: "",
    //   type: "",
    //   teacher: "",
    //   time: "",
    //   color: 0,
    //   week: 0,
    //   dateStart: "",
    //   dateEnd: ""
    // };

    // TODO: Наладить систему типов (отдельно ParsedSchedule, отдельно TimeTable для карточки)
    // TODO: - ParsedSchedule: пробежаться по схеме и загнать её в TS объект
    // TODO: - TimeTable: выяснить, что нужно карточке, поправить схему
    // TODO: - Добавить создание новой карточки
    // TODO: - Вставка карточки в DOM
    // TODO: - Вставка запихивание выбранных в ParsedSchedule (списки DayWeekList, TimeTableList)
    // TODO: - Добавить удаление несозданной пары
    // TODO: - Скрыть кнопку отмены, когда пара не создана

    setLessons([
      ...lessons,
      <ScheduleCard
        id={getNextId(json.timetableList)}
        key={generateRandomString(5)}
        lesson={""}
        time={""}
        isInEditMode={true}
      />
    ]);
    // json.timetableList.push(newLesson);
  };

  return (
    <Tabs variant={"solid-rounded"}>
      <TabList>
        {days.map((day: number) => (
          <Tab key={generateRandomString(5)}>{dayNumberToShortName(day)}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {days.map((day: number) => (
          <TabPanel key={generateRandomString(5)}>
            <Tabs
              variant={"soft-rounded"}
              m={3}
              defaultIndex={getCurrentWeek()}
            >
              <TabList key={generateRandomString(5)}>
                {weeks.map((week: number) => (
                  <Tab key={generateRandomString(5)}>Неделя {week + 1}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {weeks.map((week: number) => {
                  const timetable: TimeTable[] = getTimetableByDayAndWeek(
                    json,
                    day,
                    week
                  );
                  return (
                    <TabPanel key={generateRandomString(5)}>
                      {timetable.map(t => {
                        return (
                          ifCurrentDateIsInRange(t.dateStart, t.dateEnd) && (
                            <ScheduleCard
                              {...t}
                              key={generateRandomString(5)}
                            />
                          )
                        );
                      })}
                      {lessons.map((lesson: ReactNode) => {
                        return lesson;
                      })}
                      <Button
                        leftIcon={<PlusSquareIcon />}
                        colorScheme="blue"
                        onClick={() => addLesson(json)}
                      >
                        Создать
                      </Button>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ScheduleDaysTab;
