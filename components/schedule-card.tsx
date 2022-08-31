import { VStack, Text } from "@chakra-ui/react";
import { TimeTable } from "../libs/types";

const ScheduleCard = ({ lesson, room, type, teacher, time }: TimeTable) => {
  return (
    <VStack border={"1px"} borderRadius={"5px"} p={2} m={2} align={"left"}>
      <Text fontWeight={"bold"} fontSize={"20px"}>{time}</Text>
      <Text fontWeight={"semibold"} fontSize={"19px"}>
        {lesson} ({type})
      </Text>
      <Text>{teacher}</Text>
      <Text>{room}</Text>
    </VStack>
  );
};

export default ScheduleCard;
