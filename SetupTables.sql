DROP TABLE IF EXISTS Members CASCADE;
CREATE TABLE Members (MemberID SERIAL PRIMARY KEY,
                      FirstName VARCHAR(255) NOT NULL,
		              LastName VARCHAR(255) NOT NULL,
                      Username VARCHAR(255) NOT NULL UNIQUE,
                      Email VARCHAR(255) NOT NULL UNIQUE,
                      Password VARCHAR(255) NOT NULL,
                      SALT VARCHAR(255),
                      Verification INT DEFAULT 0
);


DROP TABLE IF EXISTS Demo;
CREATE TABLE Demo (DemoID SERIAL PRIMARY KEY,
                        Name VARCHAR(255) NOT NULL UNIQUE,
                        Message VARCHAR(255)
);
