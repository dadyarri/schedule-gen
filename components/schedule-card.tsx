import {Box, Button, Divider, Flex, FormControl, FormLabel, HStack, IconButton, Select, Text} from "@chakra-ui/react";
import {RawSchedule, RawTimeTable, TimeTable} from "../libs/types";
import React, {useState} from "react";
import {CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {
  decodeData,
  encodeData,
  generateRandomString,
  getListOfLessons,
  getListOfRooms,
  getListOfTeachers,
  getListOfTime,
  getListOfTypes,
  getNextId,
  getTimeTableById
} from "../utils";
import {useRouter} from "next/router";

const ScheduleCard = ({
  id,
  lesson,
  room,
  type,
  teacher,
  time,
  color,
  isInEditMode = false
}: TimeTable) => {
  const router = useRouter();

  const [cardState, setCardState] = useState(isInEditMode);
  const [saveButtonIsLoading, setSaveButtonIsLoading] = React.useState(false);
  const [deleteButtonIsLoading, setDeleteButtonIsLoading] =
    React.useState(false);
  const schedule = router.query["schedule"] as string;

  const json: RawSchedule = JSON.parse(decodeData(schedule));

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

  const onDeleteButtonClick = async () => {
    setDeleteButtonIsLoading(true);
    const newJson = Object.assign({}, json);
    for (let i = 0; i < newJson.timetableList.length; i++) {
      if (newJson.timetableList[i].id === id) {
        newJson.timetableList.splice(i, 1);
      }
    }
    for (let i = 0; i < newJson.dayWeekList.length; i++) {
      if (newJson.dayWeekList[i].timetableId === id) {
        newJson.dayWeekList.splice(i, 1);
      }
    }
    await router.push(
      "/?schedule=" + encodeData(JSON.stringify(newJson)),
      undefined,
      { shallow: true }
    );
    setCardState(false);
    setDeleteButtonIsLoading(false);
  };

  const onSaveButtonClick = async () => {
    setSaveButtonIsLoading(true);

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

    const tt = getTimeTableById(json.timetableList, id);

    if (tt) {
      tt.timeId = parseInt(timeSelect.value);
      tt.lessonId = parseInt(subjectSelect.value);
      tt.typeId = parseInt(typeSelect.value);
      tt.teacherId = parseInt(teacherSelect.value);
      tt.roomId = parseInt(roomSelect.value);

      await router.push(
        "/?schedule=" + encodeData(JSON.stringify(json)),
        undefined,
        { shallow: true }
      );
      setCardState(false);
    } else {
      const newTimeTable: RawTimeTable = {
        id: getNextId(json.timetableList),
        timeId: parseInt(timeSelect.value),
        lessonId: parseInt(subjectSelect.value),
        typeId: parseInt(typeSelect.value),
        teacherId: parseInt(teacherSelect.value),
        roomId: parseInt(roomSelect.value)
      };

      json.timetableList.push(newTimeTable);
      json.dayWeekList.push({
        id: getNextId(json.dayWeekList),
        day: 0,
        week: 0,
        timetableId: newTimeTable.id
      });

      await router.push(
        "/?schedule=" + encodeData(JSON.stringify(json)),
        undefined,
        { shallow: true }
      );
      setCardState(false);
    }

    setSaveButtonIsLoading(false);
  };

  const onDiscardButtonClick = () => {
    setCardState(false);
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
                <option
                  value={t.id}
                  selected={t.time == time}
                  key={generateRandomString(5)}
                >
                  {t.time}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Предмет</FormLabel>
            <Select id={"subjectSelect"}>
              {getListOfLessons(json).map(t => (
                <option
                  value={t.id}
                  selected={t.lesson == lesson}
                  key={generateRandomString(5)}
                >
                  {t.lesson}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Тип занятия</FormLabel>
            <Select id={"typeSelect"}>
              {getListOfTypes(json).map(t => (
                <option
                  value={t.id}
                  selected={t.type == type}
                  key={generateRandomString(5)}
                >
                  {t.type}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Преподаватель</FormLabel>
            <Select id={"teacherSelect"}>
              {getListOfTeachers(json).map(t => (
                <option
                  value={t.id}
                  selected={t.teacher == teacher}
                  key={generateRandomString(5)}
                >
                  {t.teacher}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl my={2}>
            <FormLabel>Аудитория</FormLabel>
            <Select id={"roomSelect"}>
              {getListOfRooms(json).map(t => (
                <option
                  value={t.id}
                  selected={t.room == room}
                  key={generateRandomString(5)}
                >
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
            isLoading={saveButtonIsLoading}
            loadingText={"Сохранение..."}
          >
            Сохранить
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme={"red"}
            m={2}
            onClick={onDeleteButtonClick}
            isLoading={deleteButtonIsLoading}
            loadingText={"Удаление..."}
          >
            Удалить
          </Button>
          <IconButton
            aria-label="Reset changes"
            icon={<CloseIcon />}
            onClick={onDiscardButtonClick}
          />
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
          <Text>#{id}</Text>
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
