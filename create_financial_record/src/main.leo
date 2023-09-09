// The 'create_financial_record' program.
program create_financial_record.aleo {

  record FinancialRecord {
    owner: address,
    factor1: u32,
    factor2: u32,
    factor3: u32,
  }

  transition main(factor1: u32, factor2: u32, factor3: u32) -> FinancialRecord {
    return FinancialRecord {
      owner: self.caller,
      factor1: factor1,
      factor2: factor2,
      factor3: factor3,
    };
  }
}
