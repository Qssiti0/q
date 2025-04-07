import { redis, generateId } from "../redis"

export interface Offer {
  id: string
  title: string
  description: string
  coins: number
  provider: string
  imageUrl?: string
  requirements?: string
  category?: string
  isActive: boolean
  createdAt: string
}

export async function createOffer(offerData: Omit<Offer, "id" | "createdAt">): Promise<Offer> {
  const id = generateId()
  const now = new Date().toISOString()

  const offer: Offer = {
    id,
    ...offerData,
    createdAt: now,
  }

  // تخزين العرض في Redis
  await redis.hset(`offer:${id}`, offer)

  // إضافة العرض إلى قائمة العروض
  await redis.sadd("offers", id)

  return offer
}

export async function getOfferById(id: string): Promise<Offer | null> {
  const offer = await redis.hgetall(`offer:${id}`)
  return Object.keys(offer).length > 0 ? (offer as unknown as Offer) : null
}

export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  const offer = await getOfferById(id)
  if (!offer) return null

  const updatedOffer = { ...offer, ...data }
  await redis.hset(`offer:${id}`, updatedOffer)

  return updatedOffer
}

export async function getAllOffers(activeOnly = false): Promise<Offer[]> {
  const offerIds = await redis.smembers("offers")

  const offers: Offer[] = []
  for (const id of offerIds) {
    const offer = await getOfferById(id)
    if (offer && (!activeOnly || offer.isActive)) {
      offers.push(offer)
    }
  }

  return offers
}

export async function deleteOffer(id: string): Promise<boolean> {
  const exists = await getOfferById(id)
  if (!exists) return false

  await redis.del(`offer:${id}`)
  await redis.srem("offers", id)

  return true
}

