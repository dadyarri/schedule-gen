import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import {
  dayNumberToShortName,
  generateRandomString,
  getDistinctDays,
  getDistinctWeeks,
  getNextId,
  getTimetableByDayAndWeek
} from "../utils";
import { RawSchedule, ScheduleCardProps } from "../libs/types";
import ScheduleCard from "./schedule-card";
import moment from "moment";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { ReactNode, useState } from "react";

type Props = {
  json: RawSchedule;
};

const ScheduleDaysTab = ({ json }: Props) => {
  const days: number[] = getDistinctDays(json.dayWeekList);
  const weeks: number[] = getDistinctWeeks(json.dayWeekList);

  const [lessons, setLessons] = useState([] as JSX.Element[]);

  const getCurrentWeek = (): number => {
    return moment().add(13, "days").week() % 2;
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

  const addLesson = (json: RawSchedule, day: number, week: number) => {

    // TODO: - Добавить создание новой карточки
    // TODO: - Вставка карточки в DOM
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
        day={day}
        week={week}
        setState={setLessons}
      />
    ]);
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
                  const timetable: ScheduleCardProps[] =
                    getTimetableByDayAndWeek(json, day, week);
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
                        onClick={() => addLesson(json, day, week)}
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
