import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../libs/theme";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "../dev";

function Website({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DevSupport
        ComponentPreviews={ComponentPreviews}
        useInitialHook={useInitial}
      >
        <Component {...pageProps} />
      </DevSupport>
    </ChakraProvider>
  );
}

export default Website;
