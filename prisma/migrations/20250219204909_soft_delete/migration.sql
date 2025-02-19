-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "link" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fileId" INTEGER,
    CONSTRAINT "Contact_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("address", "age", "email", "fileId", "gender", "id", "isAdmin", "link", "name", "phone") SELECT "address", "age", "email", "fileId", "gender", "id", "isAdmin", "link", "name", "phone" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
CREATE UNIQUE INDEX "Contact_fileId_key" ON "Contact"("fileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
