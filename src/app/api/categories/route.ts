import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: {
        active: true
      },
      orderBy: {
        name: 'asc'
      }
    })
=======
import { getStaticCategories } from '@/lib/static-utils'

export async function GET() {
  try {
    const categories = getStaticCategories()
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}