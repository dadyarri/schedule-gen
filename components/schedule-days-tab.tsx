import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import {
  dayNumberToShortName, generateRandomString,
  getDistinctDays,
  getDistinctWeeks,
  getTimetableByDayAndWeek
} from "../utils";
import { ParsedSchedule, TimeTable } from "../libs/types";
import ScheduleCard from "./schedule-card";
import moment from "moment";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { ReactNode, useState } from "react";

type Props = {
  json: ParsedSchedule;
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

  const addLesson = () => {
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

    setLessons([
      ...lessons,
      <ScheduleCard
        id={getNextId()}
        key={generateRandomString(5)}
        lesson={""}
        time={""}
        isInEditMode={true}
      />
    ]);
    // json.timetableList.push(newLesson);
  };

  const getNextId = (): number => {
    let max = 0;
    json.timetableList.forEach(item => {
      if (item.id > max) {
        max = item.id;
      }
    });

    return max + 1;
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
                      {lessons.map((_lesson: ReactNode) => {
                        return _lesson;
                      })}
                      <Button
                        leftIcon={<PlusSquareIcon />}
                        colorScheme="blue"
                        onClick={addLesson}
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
