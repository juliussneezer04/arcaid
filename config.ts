export const ARCAID_CREATE_FINANCIAL_RECORD_CODE = `
program arcaid_create_financial_record.aleo;
record FinancialRecord:
    owner as address.private;
    microcredits as u64.private;
    factor1 as u32.private;
    factor2 as u32.private;
    factor3 as u32.private;
function main:
    input r0 as u32.private;
    input r1 as u32.private;
    input r2 as u32.private;
    cast self.caller 0u64 r0 r1 r2 into r3 as FinancialRecord.record;
    output r3 as FinancialRecord.record;
`;
