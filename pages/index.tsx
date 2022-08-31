import type { NextPage } from "next";
import Layout from "../components/layout";
import {Heading} from "@chakra-ui/react";

const Home: NextPage = () => {
  return <Layout title={"Расписание"}>
    <Heading as={"h2"} alignSelf={"center"}>Генератор расписания</Heading>
  </Layout>;
};

export default Home;
