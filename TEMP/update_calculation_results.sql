--Add retirement income columns
ALTER TABLE calculation_results ADD COLUMN income_a_45 INTEGER, ADD COLUMN income_a_51 INTEGER, ADD COLUMN income_b_45 INTEGER, ADD COLUMN income_b_51 INTEGER;
