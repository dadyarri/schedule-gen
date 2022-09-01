import {Box} from "@chakra-ui/react";
import ScheduleDaysTab from "./schedule-days-tab";

type Props = {
  schedule: string;
};

const Schedule = ({ schedule }: Props) => {
  if (!schedule) {
    console.error("какая-то хуйня!");
    return <></>;
  } else {
    const json = JSON.parse(schedule);

    return (
      <Box mt={10}>
        <ScheduleDaysTab json={json}/>
      </Box>
    );
  }
};

export default Schedule;
