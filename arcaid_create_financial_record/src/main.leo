// The 'arcaid_create_financial_record' program.
program arcaid_create_financial_record.aleo {

  record FinancialRecord {
    owner: address,
    microcredits: u64,
    factor1: u32,
    factor2: u32,
    factor3: u32,
  }

  transition main(factor1: u32, factor2: u32, factor3: u32) -> FinancialRecord {
    let user_record: FinancialRecord = FinancialRecord {
      owner: self.caller,
      microcredits: 0u64,
      factor1,
      factor2,
      factor3,
    };

    return user_record;
  }
}
