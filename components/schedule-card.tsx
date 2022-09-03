import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Text
} from "@chakra-ui/react";
import { TimeTable } from "../libs/types";
import React, { useState } from "react";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  decodeData, encodeData,
  getListOfRooms,
  getListOfSubjects,
  getListOfTeachers,
  getListOfTime,
  getListOfTypes,
  getTimeTableById
} from "../utils";
import { useRouter } from "next/router";

const ScheduleCard = ({
  id,
  lesson,
  room,
  type,
  teacher,
  time,
  color
}: TimeTable) => {
  const router = useRouter();

  const [cardState, setCardState] = useState(false);
  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);
  const schedule = router.query["schedule"] as string;

  const json = JSON.parse(decodeData(schedule));

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
  };

  const onSaveButtonClick = async () => {
    setButtonIsLoading(true);

    const newJson = Object.assign({}, json);

    const timeSelect = document.getElementById(
      "timeSelect"
    ) as HTMLSelectElement;
    const subjectSelect = document.getElementById(
      "subjectSelect"
    ) as HTMLSelectElement;
    const typeSelect = document.getElementById(
      "typeSelect"
    ) as HTMLSelectElement;
    const teacherSelect = document.getElementById(
      "teacherSelect"
    ) as HTMLSelectElement;
    const roomSelect = document.getElementById(
      "roomSelect"
    ) as HTMLSelectElement;

    const tt = getTimeTableById(newJson, id);

    if (tt) {
      tt.timeId = parseInt(timeSelect.value);
      tt.lessonId = parseInt(subjectSelect.value);
      tt.typeId = parseInt(typeSelect.value);
      tt.teacherId = parseInt(teacherSelect.value);
      tt.roomId = parseInt(roomSelect.value);

      await router.push("/?schedule=" + encodeData(JSON.stringify(newJson)), undefined, { shallow: true });
      setCardState(false);
    }

    setButtonIsLoading(false);
  };

  if (cardState) {
    return (
      <Flex
        border={"1px"}
        borderRadius={"5px"}
        p={2}
        m={2}
        align={"left"}
        direction={"column"}
      >
        <HStack>
          <Text width={"xl"} fontSize={"20px"} fontWeight={"bold"}>
            Редактирование
          </Text>
        </HStack>
        <form onSubmit={onSaveButtonClick}>
          <FormControl my={2}>
            <FormLabel>Время</FormLabel>
            <Select id={"timeSelect"}>
              {getListOfTime(json).map(t => (
                <option value={t.id} selected={t.time == time}>
                  {t.time}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Предмет</FormLabel>
            <Select id={"subjectSelect"}>
              {getListOfSubjects(json).map(t => (
                <option value={t.id} selected={t.subject == lesson}>
                  {t.subject}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Тип занятия</FormLabel>
            <Select id={"typeSelect"}>
              {getListOfTypes(json).map(t => (
                <option value={t.id} selected={t.type == type}>
                  {t.type}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Преподаватель</FormLabel>
            <Select id={"teacherSelect"}>
              {getListOfTeachers(json).map(t => (
                <option value={t.id} selected={t.teacher == teacher}>
                  {t.teacher}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Аудитория</FormLabel>
            <Select id={"roomSelect"}>
              {getListOfRooms(json).map(t => (
                <option value={t.id} selected={t.room == room}>
                  {t.room}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            leftIcon={<CheckIcon />}
            colorScheme={"blue"}
            m={2}
            onClick={onSaveButtonClick}
            isLoading={buttonIsLoading}
            loadingText={"Сохранение..."}
          >
            Сохранить
          </Button>
        </form>
      </Flex>
    );
  } else {
    return (
      <Flex
        border={"1px"}
        borderRadius={"5px"}
        p={2}
        m={2}
        align={"left"}
        direction={"column"}
      >
        <HStack>
          {color ? (
            <Divider
              orientation="horizontal"
              m={1}
              mb={3}
              borderWidth={"3px"}
              borderRadius={"10px"}
              borderColor={getColorName(color)}
            />
          ) : (
            <Box alignSelf={"flex-start"} width={"xl"}></Box>
          )}
          <Button
            leftIcon={<EditIcon />}
            variant={"ghost"}
            alignSelf="flex-end"
            position="relative"
            right={-1}
            top={-1}
            onClick={onEditButtonClick}
          />
        </HStack>
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
