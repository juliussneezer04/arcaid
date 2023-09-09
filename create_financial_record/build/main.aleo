program create_financial_record.aleo;

record FinancialRecord:
    owner as address.private;
    factor1 as u32.private;
    factor2 as u32.private;
    factor3 as u32.private;


function main:
    input r0 as u32.private;
    input r1 as u32.private;
    input r2 as u32.private;
    cast self.caller r0 r1 r2 into r3 as FinancialRecord.record;
    output r3 as FinancialRecord.record;
