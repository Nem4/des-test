import bcrypt from "bcrypt";
const saltRounds = 10;

const users = [{ id: 0, name: "Test User1", username: "testuser1", password: "$2y$10$wyWEUqmT8kTRH9Lr/Ul/BOKAbNA0dUBEPiJaIJ7ZTD1tkS2Ez5dFa" }];

/**
 * Returns a user object by ID
 *
 * Returns undefined if not found
 *
 * @param {number} id User ID.
 */
export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function findAllUsers() {
  return users;
}

/**
 * Adds new user
 *
 * @param {number} user Object containing user fields (name, username and password).
 */
export function addUser(user) {
  const newId = users[users.length - 1] ? users[users.length - 1].id + 1 : 0;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) throw err;
      users.push({ id: newId, name: user.name, username: user.username, password: hash });
      // Store the 'hash' in your database
    });
  });
}

/**
 * Updates the user
 *
 * Returns True if successful and False if the user is not found
 *
 * @param {number} id User ID.
 * @param {number} user Object containing user fields to update.
 */
export function updateUser(id, user) {
  const userIndex = users.findIndex((user) => user.id === id);
  // return false if no user was found
  if (userIndex == -1) return false;

  // update fields after validating them
  users[userIndex].name = Boolean(user.name) ? user.name : users[userIndex].name;
  // not sure if we can update the username, so commenting it out for now
  //   users[userIndex].username == Boolean(req.body.username) ? req.body.username : users[userIndex].username;

  return true;
}

/**
 * Delete user by ID
 *
 *
 * @param {number} id User ID.
 */
export function deleteUserById(id) {
  users.splice(
    users.findIndex((user) => user.id === id),
    1
  );
}

// // Validate user's password
// function validateUser(userPassword, hashPassword) {
//   bcrypt
//     .compare(userPassword, hashPassword)
//     .then((res) => {
//       console.log(res); // return true
//     })
//     .catch((err) => console.error(err.message));
// }
