import { errors } from '../commons/internal-errors.mjs';
import * as userData from '../data/mock-users-data-mem.mjs';

// Users Services:

// Input: username (String) identifier
// Output: user object or error object.
export function addUser(username){
  if (! username) {
    return errors.INVALID_USER(username);    
  }
  const userId = userData.getUserIdByName(username);
  if (userId) {
    return errors.USER_ALREADY_EXISTS(username);
  }
  const user = userData.addUser(username);
  return user;
}

// Auxiliary function: get userId by token
// Input: token (String) identifier
// Output: user id (Number) or undefined.
export function getUserId(token){
  return userData.getUserId(token);
}
