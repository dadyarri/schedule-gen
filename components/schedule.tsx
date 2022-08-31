import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";

const Schedule = () => {
  return <Box mt={10}>
    <Tabs variant={"solid-rounded"}>
      <TabList>
        <Tab>ПН</Tab>
        <Tab>ВТ</Tab>
        <Tab>СР</Tab>
        <Tab>ЧТ</Tab>
        <Tab>ПТ</Tab>
        <Tab>СБ</Tab>
        <Tab>ВС</Tab>
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
}

export default Schedule;