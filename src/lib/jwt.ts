import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'

console.log('JWT_SECRET', JWT_SECRET)

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}

export function decodeToken(token: string): jwt.JwtPayload | null {
  try {
    console.log('token', token)
    return jwt.decode(token) as jwt.JwtPayload
  } catch (error) {
    return null
  }
}