type FullNames = {
  firstName: string,
  lastName: string,
}

type Permissions = 'Admin' | 'Utente' | 'Venditore' | 'Solo lettura'

export type User = {
  name: FullNames,
  email: string,
  password: string,
  workspaces: string,
}

export type Member = {
  name: FullNames,
  permissions: Permissions,
}

export type Process = {
  name: FullNames,
  phoneNumber: string,
  processId: string,
  Assignee: string,
  date: string,
}