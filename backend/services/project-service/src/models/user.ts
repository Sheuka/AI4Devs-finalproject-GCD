export interface User {
    id: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    phoneNumber?: string
    profilePicture?: string
    speciality?: string
    province?: string
    locality?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}