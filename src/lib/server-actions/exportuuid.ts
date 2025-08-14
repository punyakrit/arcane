import { v4 as uuidv4 } from "uuid";

export async function generateUUID() {
  return uuidv4();
}