import {Button, Divider, Flex, Text} from "@chakra-ui/react";
import {TimeTable} from "../libs/types";
import {useState} from "react";
import {EditIcon} from "@chakra-ui/icons";

const ScheduleCard = ({
  lesson,
  room,
  type,
  teacher,
  time,
  color
}: TimeTable) => {
  const [cardState, setCardState] = useState(false);

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

  const onEditButtonClick = () => {
    setCardState(true);
  }

  if (cardState) {
    return <></>;
  } else {
    return (
      <Flex border={"1px"} borderRadius={"5px"} p={2} m={2} align={"left"} direction={"column"}>
        <Button
            leftIcon={<EditIcon/>}
            variant={"ghost"}
            alignSelf='flex-end'
            position='relative'
            right={-1}
            top={-1}
            onClick={onEditButtonClick}
        />
        {color ? (
          <Divider
            orientation="vertical"
            m={1}
            mb={3}
            borderWidth={"3px"}
            borderRadius={"10px"}
            borderColor={getColorName(color)}
          />
        ) : null}
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
        {teacher ? <Text>{teacher}</Text> : null}
        {room ? <Text>{room}</Text> : null}
      </Flex>
    );
  }
};

export default ScheduleCard;
