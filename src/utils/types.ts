export type Designation = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date

  // AccessList AccessList[]
  // User       User[]
}

export type Privileges = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type AccessList = {
  id: number
  email: string
  createdAt: Date
  updatedAt: Date
  designationId: number

  // designation   Designation @relation(fields: [designationId], references: [id])
  // User          User?
}

export type User = {
  id: number
  name: string
  password?: string
  active: boolean
  avatar: string | null
  lastLogin: string | null
  createdAt: Date
  updatedAt: Date
  emailId: string
  designationId: number
  privileges: number[]

  // email   AccessList @relation(fields: [emailId], references: [email])

  // designation   Designation @relation(fields: [designationId], references: [id])

  // privileges Int[]
}
