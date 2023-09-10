import { ARCAID_VERIFY_FINANCIAL_RECORD_CODE } from "@/config";
import { Application } from "@/interfaces";
import { initializeWasm, Account, ProgramManager } from "@aleohq/sdk";

export async function handleVerificationOfRecord(
  application: Application,
  factor1Threshold: number,
  factor2Threshold: number,
  factor3Threshold: number,
) {
  await initializeWasm();

  const privateKey = process.env.PRIVATE_KEY;
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
      application.applicationHash,
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
