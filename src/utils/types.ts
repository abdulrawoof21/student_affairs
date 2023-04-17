export type Designation = {
  id: number
  name: string
  createdAt: Date
  users?: User[]
}

export type Privileges = {
  id: number
  name: string
  createdAt: Date
  user_privileges?: UserPrivileges[]
}

export type UserPrivileges = {
  user_id: number
  privilege_id: number
  privileges?: Privileges
  users?: User
}

export type AccessList = {
  id: number
  user_id: number
  email: string
  active: boolean
  createdAt: Date
  users?: User
}

export type User = {
  id: number
  email: string
  password?: string
  fullname: string
  avatar: string | null
  dob?: Date
  phone?: number
  designationId: number
  created_at: Date
  updated_at: Date
  last_login: Date
  accesslist?: AccessList[]
  user_privileges?: UserPrivileges[]
  designation?: Designation
}
