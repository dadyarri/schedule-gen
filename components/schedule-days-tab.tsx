import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {
  buildTimetable,
  dayNumberToShortName,
  getDistinctDays,
  getDistinctWeeks,
  getTimetableByDayAndWeek
} from "../utils";
import {ParsedSchedule, TimeTable} from "../libs/types";
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
  }

  const ifCurrentDateIsInRange = (dateStart: string, dateEnd: string): boolean => {
    const currentDate = moment();
    const startDate = moment(dateStart);
    const endDate = moment(dateEnd);

    return currentDate.isBetween(startDate, endDate);
  }

  return (
    <Tabs variant={"solid-rounded"}>
      <TabList>
        {days.map((day: number) => (
          <Tab key={day}>{dayNumberToShortName(day)}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {days.map((day: number) => (
          <TabPanel>
            <Tabs variant={"soft-rounded"} m={3} defaultIndex={getCurrentWeek()}>
              <TabList>
                {weeks.map((week: number) => (
                  <Tab key={week}>Неделя {week + 1}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {weeks.map((week: number) => {
                  const timetable: TimeTable[] = getTimetableByDayAndWeek(json, day, week);
                  return (
                    <TabPanel key={week}>
                      {timetable.map(t => {
                        return (
                            ifCurrentDateIsInRange(t.dateStart, t.dateEnd) && (<ScheduleCard {...t} />)
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
