import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Instância a URL via dotenv
const connectionString = process.env.DATABASE_URL;
// Cria o pool de conexões com pg
const pool = new Pool({ connectionString });
// Passa o pool para o adaptador do Prisma
const adapter = new PrismaPg(pool);
// Inicializa o PrismaClient com o adaptador
const prisma = new PrismaClient({ adapter });

export default prisma;

