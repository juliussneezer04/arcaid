import { useEffect, useState } from "react";
import * as sdk from "@aleohq/sdk";

export const useAleoWASM = () => {
  const [aleoInstance, setAleoInstance] = useState<any>(null);

  useEffect(() => {
    async function initWasm() {
      await sdk.initializeWasm();
      if (aleoInstance === null) {
        setAleoInstance(sdk);
      }
    }
    initWasm();

    return () => {
      setAleoInstance(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return aleoInstance;
};
