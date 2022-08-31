import {motion} from "framer-motion";
import Head from "next/head";
import React from "react";
import {Container} from "@chakra-ui/react";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 }
};

type Props = {
  children: React.ReactNode;
  title: string;
};

const Layout = ({ children, title }: Props) => {
  const t = `${title} - dadyarri`;
  return (
      <motion.article
          initial={"hidden"}
  animate={"enter"}
  exit={"exit"}
  variants={variants}
  transition={{ duration: 0.4, type: "easeInOut" }}
  style={{ position: "relative" }}
>
  <>
      {title && (
      <Head>
          <title>{t}</title>
      </Head>
  )}
  <Container mt={5}>
    {children}
  </Container>
  </>
  </motion.article>
);
};

export default Layout;
