let PrismaClient;

try {
  PrismaClient = require('../generated/prisma').PrismaClient;
} catch (err) {
  PrismaClient = require('@prisma/client').PrismaClient;
}

const prisma = new PrismaClient();

module.exports = prisma;
