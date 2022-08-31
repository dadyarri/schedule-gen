import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

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
}

const Schedule = ({ schedule }: Props) => {

  const dayNumberToName = (day: number) => {
    switch (day) {
      case 1:
        return "Воскресенье";
      case 2:
        return "Понедельник";
      case 3:
        return "Вторник";
      case 4:
        return "Среда";
      case 5:
        return "Четверг";
      case 6:
        return "Пятница";
      case 7:
        return "Суббота";
      default:
        return "";
    }
  };

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
  }

  const getIdsOfTimetable = (dayWeekItems: DayWeekItem[], day: number) => {
    const timetables: TimetableItem[] = [];
    dayWeekItems.forEach((item: DayWeekItem) => {
      if (item.day === day) {
        timetables.push({timetableId: item.timetableId, week: item.week});
      }
    })

    return timetables;
  }

  if (!schedule) {
    console.error("какая-то хуйня!");
    return <></>;
  } else {
    const json = JSON.parse(schedule);

    const days: number[] = getDistinctDays(json.dayWeekList);
    console.log(getIdsOfTimetable(json.dayWeekList, 2));

    return (
      <Box mt={10}>
        <Tabs variant={"solid-rounded"}>
          <TabList>
            {days.map((day: number) => (
            <Tab key={day}>{dayNumberToShortName(day)}</Tab>
            ), [])}
          </TabList>

          <TabPanels>
            <TabPanel>понедельник</TabPanel>
            <TabPanel>вторник</TabPanel>
            <TabPanel>среда</TabPanel>
            <TabPanel>четверг</TabPanel>
            <TabPanel>пятница</TabPanel>
            <TabPanel>суббота</TabPanel>
            <TabPanel>воскресенье</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
};

export default Schedule;
