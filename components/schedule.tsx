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

const Schedule = ({ schedule }: Props) => {
  console.log(schedule);
  console.log(typeof schedule);

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

  if (!schedule) {
    console.error("какая-то хуйня!");
    return <></>;
  } else {
    const json = JSON.parse(schedule);

    const days: number[] = [];

    console.log(
      json.dayWeekList.forEach((item: DayWeekItem) => {
        if (!days.includes(item.day)) {
          days.push(item.day);
        }
      })
    );

    days.sort()

    return (
      <Box mt={10}>
        <Tabs variant={"solid-rounded"}>
          <TabList>
            {days.map((day: number) => (
            <Tab key={day}>{dayNumberToName(day)}</Tab>
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
