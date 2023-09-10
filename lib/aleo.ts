import { ARCAID_VERIFY_FINANCIAL_RECORD_CODE } from "@/config";
import { initializeWasm, Account, ProgramManager } from "@aleohq/sdk";
import dotenv from "dotenv";

dotenv.config();

export async function handleVerificationOfRecord(
  applicationHash: string,
  factor1Threshold: number,
  factor2Threshold: number,
  factor3Threshold: number,
  privateKey: string,
) {
  await initializeWasm();

  console.log("Network", process.env.DATABASE_URL);

  console.log("pkey", privateKey);
  const account = new Account({
    privateKey: privateKey,
  });

  const programManager = new ProgramManager(undefined, undefined, undefined);

  programManager.setAccount(account);

  // Get the response and ensure that the program executed correctly
  // WARNING - This function takes a long time on first run
  const executionResponse = await programManager.executeOffline(
    ARCAID_VERIFY_FINANCIAL_RECORD_CODE,
    "main",
    [
      applicationHash,
      `${factor1Threshold}u32`,
      `${factor2Threshold}u32`,
      `${factor3Threshold}u32`,
    ],
    false,
  );

  const results = executionResponse.getOutputs();
  const resultResponse = results?.[0] || false;
  alert(
    `The result of the verification is: ${
      resultResponse ? "Success!" : "Failure :("
    }`,
  );
  return resultResponse;
}
