export const ARCAID_VERIFY_FINANCIAL_RECORD_CODE = `
program arcaid_verify_financial_record.aleo;

record FinancialRecord:
    owner as address.private;
    microcredits as u64.private;
    factor1 as u32.private;
    factor2 as u32.private;
    factor3 as u32.private;


function main:
    input r0 as FinancialRecord.record;
    input r1 as u32.private;
    input r2 as u32.private;
    input r3 as u32.private;
    lt r0.factor1 r1 into r4;
    lt r0.factor2 r2 into r5;
    lt r0.factor3 r3 into r6;
    and r4 r5 into r7;
    and r7 r6 into r8;
    output r8 as boolean.private;
`;
