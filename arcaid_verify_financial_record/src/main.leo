// The 'arcaid_verify_financial_record' program.
program arcaid_verify_financial_record.aleo {
  record FinancialRecord {
    owner: address,
    microcredits: u64,
    factor1: u32,
    factor2: u32,
    factor3: u32,
  }
  transition main(userRecord: FinancialRecord, factor1Threshold: u32, factor2Threshold: u32, factor3Threshold: u32) -> bool {
    let factor1Pass: bool = userRecord.factor1 < factor1Threshold;
    let factor2Pass: bool = userRecord.factor2 < factor2Threshold;
    let factor3Pass: bool = userRecord.factor3 < factor3Threshold;

    return factor1Pass && factor2Pass && factor3Pass;
  }
}
