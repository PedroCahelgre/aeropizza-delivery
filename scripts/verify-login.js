const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const db = new PrismaClient()
  try {
    const admin1 = await db.admin.findUnique({ where: { email: 'comerciochalegre@gmail.com' } })
    const admin2 = await db.admin.findUnique({ where: { email: 'aeropizza@admin.com' } })

    const ok1 = admin1 ? await bcrypt.compare('87168087', admin1.password) : false
    const ok2 = admin2 ? await bcrypt.compare('12345678', admin2.password) : false

    console.log('admin1 bcrypt ok:', ok1)
    console.log('admin2 bcrypt ok:', ok2)
  } catch (e) {
    console.error('verify-login error:', e && e.message ? e.message : e)
    process.exitCode = 1
  } finally {
    await db.$disconnect()
  }
}

main()
