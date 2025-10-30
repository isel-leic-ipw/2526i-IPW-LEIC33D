import crypto from 'node:crypto';
import { INTERNAL_ERROR_CODES } from '../commons/internal-errors.mjs';

// MOCK of users (service + data)
// This is a simple implementation: to be refactored.

const USERS = [
  {
    id: 1,
    token: 'b0506867-77c3-4142-9437-1f627deebd67',
    name: 'asilva'
  },
  {
    id: 2,
    token: 'f1d1cdbc-97f0-41c4-b206-051250684b19',
    name: 'pnunes'
  },
];
let currentId = USERS.length + 1;

function nextId(){
  return(currentId++);
}

export function addUser(username){
  if (! username) {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_BODY,
      description: `Invalid body: missing username.`
    }    
  }
  const userFound = USERS.find(user => username == user.name);
  if (userFound) {
    return {
      internalError: INTERNAL_ERROR_CODES.INVALID_BODY,
      description: `Invalid body: user ${username} already exists. Try another username.`
    }
  }
  let user = {
    id: nextId(),
    token: crypto.randomUUID(),
    name: username
  };
  USERS.push(user);
  return {token: user.token};
}

export function getUserId(token){
  let user = USERS.find(user => user.token == token);
  if (user)
    return user.id;
}
