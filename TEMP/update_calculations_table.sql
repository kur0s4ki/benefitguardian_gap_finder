-- Add current_age and retirement_age columns to calculations table
ALTER TABLE calculations 
ADD COLUMN current_age INTEGER,
ADD COLUMN retirement_age INTEGER; 