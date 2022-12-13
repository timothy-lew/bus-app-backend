-- up migration

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "name" varchar(255),
  "email" varchar(320) UNIQUE NOT NULL,
  "pass_salt" varchar(64),
  "pass_hash" varchar(128),
  "created_at" date,
  "updated_at" date
);