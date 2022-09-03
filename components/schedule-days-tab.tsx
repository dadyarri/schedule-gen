import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import {
  dayNumberToShortName,
  getDistinctDays,
  getDistinctWeeks,
  getTimetableByDayAndWeek
} from "../utils";
import { ParsedSchedule, TimeTable } from "../libs/types";
import ScheduleCard from "./schedule-card";
import moment from "moment";

type Props = {
  json: ParsedSchedule;
};

const ScheduleDaysTab = ({ json }: Props) => {
  const days: number[] = getDistinctDays(json.dayWeekList);
  const weeks: number[] = getDistinctWeeks(json.dayWeekList);

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

  const generateRandomString = (length: number): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
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
