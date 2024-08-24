import prisma from "./prisma.js";

/**
 * Username must be between 6-12 characters and alphanumeric
 */
export function isValidUserName(userName: string): boolean {
  if (userName.length < 6 || userName.length > 12) {
    return false;
  }

  if (!userName.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

/**
 * @returns null if user not found 
 */
export async function getUser(userName: string) {
  const user = await prisma.user.findFirst({
    where: { name: userName },
  });

  return user;
}


/**
 * Assumes userName has already been validated by isValidUserName() and userName not taken
 */
export async function createNewUser(userName: string) {
  const newUser = await prisma.user.create({
    data: { name: userName },
  });

  return newUser;
}