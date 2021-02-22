
--Remove the user testabc@fake.email
DELETE FROM Members 
WHERE Email='testabc@fake.email';

--Remove the user testabc-nu@fake.email
DELETE FROM Members 
WHERE Email='testabc-nu@fake.email';