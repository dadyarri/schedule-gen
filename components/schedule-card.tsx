import { Divider, Text, VStack } from "@chakra-ui/react";
import { TimeTable } from "../libs/types";

const ScheduleCard = ({
  lesson,
  room,
  type,
  teacher,
  time,
  color
}: TimeTable) => {
  const getColorName = (color: number): string => {
    switch (color) {
      case 0:
        return "red.500";
      case 1:
        return "red.200";
      case 2:
        return "purple.500";
      case 3:
        return "purple.700";
      case 4:
        return "blue.900";
      case 5:
        return "blue.400";
      case 6:
        return "blue.900";
      case 7:
        return "cyan.500";
      case 8:
        return "teal.400";
      case 9:
        return "green.400";
      case 10:
        return "green.200";
      case 11:
        return "green.100";
      case 12:
        return "orange.400";
      case 13:
        return "orange.600";
      case 14:
        return "orange.900";
      case 15:
        return "gray.500";
      case 16:
        return "gray.600";
      case 17:
        return "yellow.300";
      case 18:
        return "orange.500";
      default:
        return "gray";
    }
  };

  return (
    <VStack border={"1px"} borderRadius={"5px"} p={2} m={2} align={"left"}>
      { color ? <Divider
        orientation="vertical"
        m={1}
        mb={3}
        borderWidth={"3px"}
        borderRadius={"10px"}
        borderColor={getColorName(color)}
      /> : null }
      <Text fontWeight={"bold"} fontSize={"20px"}>
        {time}
      </Text>
      {type ? (
        <Text fontWeight={"semibold"} fontSize={"19px"}>
          {lesson} ({type})
        </Text>
      ) : (
        <Text fontWeight={"semibold"} fontSize={"19px"}>
          {lesson}
        </Text>
      )}
      { teacher ? <Text>{teacher}</Text> : null }
      { room ? <Text>{room}</Text> : null }
    </VStack>
  );
};

export default ScheduleCard;
