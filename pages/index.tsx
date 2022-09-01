import type { NextPage } from "next";
import Layout from "../components/layout";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  Heading,
  Input,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlineUpload, AiOutlineClear } from "react-icons/ai";
import React, { FormEvent } from "react";
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";
import Ajv from "ajv";
import Schedule from "../components/schedule";

const Home: NextPage = () => {
  const router = useRouter();
  const schedule = router.query["schedule"] as string;
  const {
    isOpen: isMissingFileVisible,
    onClose: onMissingFileClose,
    onOpen: onMissingFileOpen
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isMoreThanOneFileVisible,
    onClose: onMoreThanOneFileClose,
    onOpen: onMoreThanOneFileOpen
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isInvalidJsonVisible,
    onClose: onInvalidJsonClose,
    onOpen: onInvalidJsonOpen
  } = useDisclosure({ defaultIsOpen: false });

  const [ buttonIsLoading, setButtonIsLoading ] = React.useState(false);

  function encodeData(str: string) {
    return encodeURIComponent(str);
  }

  function _decodeData(str: string) {
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
      return onMissingFileOpen();
    } else {
      const file = fileInput.files[0] as File;
      // @ts-ignore
      const entries = await new ZipReader(new BlobReader(file)).getEntries({});

      if (entries.length !== 1) {
        setButtonIsLoading(false);
        return onMoreThanOneFileOpen();
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
        return onInvalidJsonOpen();
      } else {
        setButtonIsLoading(false);
        await router.push(`/?schedule=${jsonBase64}`, undefined, {
          shallow: true
        });
      }
    }
  };

  const clearSchedule = async () => {
    await router.push(`/`, undefined, {
      shallow: true
    });
  };

  return (
    <Layout title={"Расписание"}>
      <Heading as={"h2"} alignSelf={"center"}>
        Генератор расписания
      </Heading>
      {schedule ? (
        <>
          <Schedule schedule={schedule} />
          <Button
            leftIcon={<AiOutlineClear />}
            colorScheme={"blue"}
            onClick={clearSchedule}
          >
            Очистить
          </Button>
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
                loadingText='Обработка...'
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
      {isMissingFileVisible && (
        <Alert
          status="error"
          mt={4}
          id={"file-missing-error-alert"}
          variant={"left-accent"}
        >
          <AlertIcon />
          <AlertTitle>Добавьте файл!</AlertTitle>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onMissingFileClose}
          />
        </Alert>
      )}

      {isMoreThanOneFileVisible && (
        <Alert
          status="error"
          mt={4}
          id={"more-than-one-file-error-alert"}
          variant={"left-accent"}
        >
          <AlertIcon />
          <AlertTitle>В архиве более одного файла!</AlertTitle>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onMoreThanOneFileClose}
          />
        </Alert>
      )}

      {isInvalidJsonVisible && (
        <Alert
          status="error"
          mt={4}
          id={"invalid-json-error-alert"}
          variant={"left-accent"}
        >
          <AlertIcon />
          <AlertTitle>Некорректный JSON!</AlertTitle>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onInvalidJsonClose}
          />
        </Alert>
      )}
    </Layout>
  );
};

export default Home;
