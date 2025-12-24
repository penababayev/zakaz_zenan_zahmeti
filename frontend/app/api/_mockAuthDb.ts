export type MockUser = {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  phone?: string | null;
  role: "buyer" | "seller";
  is_active: boolean;
  created_at: string;
};

let users: MockUser[] = [
  {
    id: 1,
    email: "demo@example.com",
    username: "demo",
    full_name: "Demo User",
    phone: null,
    role: "buyer",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

let nextId = 2;

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUsername(username: string) {
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function createUser(payload: Omit<MockUser, "id" | "created_at" | "is_active">) {
  const user: MockUser = {
    id: nextId++,
    created_at: new Date().toISOString(),
    is_active: true,
    ...payload,
  };
  users.push(user);
  return user;
}

export function listUsers() {
  return users;
}
