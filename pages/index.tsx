import type { NextPage } from "next";
import Layout from "../components/layout";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  AiOutlineClear,
  AiOutlineDownload,
  AiOutlineUpload
} from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import React, { FormEvent } from "react";
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter
} from "@zip.js/zip.js";
import Ajv from "ajv";
import Schedule from "../components/schedule";

const Home: NextPage = () => {
  const router = useRouter();
  const schedule = router.query["schedule"] as string;
  const toast = useToast();

  const [buttonIsLoading, setButtonIsLoading] = React.useState(false);

  function encodeData(str: string) {
    return encodeURIComponent(str);
  }

  function decodeData(str: string) {
    return decodeURIComponent(str);
  }

  const uploadSchedule = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // read uploaded file +
    // check if it's the zip archive with a json inside
    // validate schema
    // if yes, base64 the json and push it to url
    // if no, show error

    setButtonIsLoading(true);

    const fileInput = document.getElementById("file-input") as HTMLInputElement;

    if (fileInput.files?.length === 0 || !fileInput.files) {
      setButtonIsLoading(false);
      return toast({
        title: "Ошибка",
        description: "Вы не выбрали файл",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    } else {
      const file = fileInput.files[0] as File;

      // @ts-ignore
      const entries = await new ZipReader(new BlobReader(file)).getEntries({});

      if (entries.length !== 1) {
        setButtonIsLoading(false);
        return toast({
          title: "Ошибка",
          description: "В архиве более одного файла",
          status: "error",
          duration: 9000,
          isClosable: true
        });
      }

      if (!entries[0].filename.endsWith(".json")) {
        setButtonIsLoading(false);
        return toast({
          title: "Ошибка",
          description: "Архив не содержит JSON-файла",
          status: "error",
          duration: 9000,
          isClosable: true
        });
      }

      // @ts-ignore
      const json = await entries[0].getData(new TextWriter()).then(result => {
        return JSON.parse(result);
      });

      const jsonString = JSON.stringify(json);
      const jsonBase64 = encodeData(jsonString);

      const ajv = new Ajv();
      const schema = JSON.parse(
        await (await fetch("/scheduleSchema.json")).text()
      );
      const valid = ajv.validate(schema, json);

      if (!valid) {
        setButtonIsLoading(false);
        return toast({
          title: "Ошибка",
          description:
            "JSON в архиве не корректный. Ошибки: " + ajv.errorsText(),
          status: "error",
          duration: 9000,
          isClosable: true
        });
      } else {
        setButtonIsLoading(false);
        await router.push(`/?schedule=${jsonBase64}`, undefined, {
          shallow: true
        });
        return true;
      }
    }
  };

  const clearSchedule = async () => {
    await router.push(`/`, undefined, {
      shallow: true
    });
  };

  const downloadSchedule = async () => {
    const schedule = decodeData(router.query["schedule"] as string);
    const writer = new ZipWriter(new BlobWriter("application/zip"));
    await writer.add("timetable_data.json", new TextReader(schedule));
    if (writer) {
      const blob = await writer.close(null);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "timetable_data.zip";
      a.click();
    }
  };

  return (
    <Layout title={"Расписание"}>
      <Heading as={"h2"} alignSelf={"center"}>
        Генератор расписания
      </Heading>
      <Text>
        Позволяет создать и отредактировать расписание в формате приложения
        &quot;Расписание для студентов&quot;
      </Text>
      <Link
        href={
          "https://play.google.com/store/apps/details?id=com.bezgrebelnygregory.timetableforstudents"
        }
        target={"_blank"}
      >
        <HStack>
          <IoLogoGooglePlaystore /> <Text>Google Play</Text>
        </HStack>
      </Link>
      {schedule ? (
        <>
          <Schedule schedule={schedule} />
          <ButtonGroup>
            <Button
              leftIcon={<AiOutlineClear />}
              colorScheme={"blue"}
              onClick={clearSchedule}
            >
              Очистить
            </Button>
            <Button
              leftIcon={<AiOutlineDownload />}
              colorScheme={"blue"}
              onClick={downloadSchedule}
            >
              Скачать
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <Box mt={10}>
          <form method={"post"} onSubmit={uploadSchedule}>
            <FormControl>
              <Input
                type={"file"}
                accept={".zip"}
                size={"sm"}
                name={"file"}
                id={"file-input"}
              />
              <Button
                leftIcon={<AiOutlineUpload />}
                colorScheme="blue"
                type={"submit"}
                isLoading={buttonIsLoading}
                loadingText="Обработка..."
              >
                Открыть
              </Button>
            </FormControl>
          </form>
          <Text fontSize={"xs"} color={"gray.500"}>
            Данные никуда не загружаются и обрабатываются в вашем браузере
          </Text>
        </Box>
      )}
    </Layout>
  );
};

export default Home;
