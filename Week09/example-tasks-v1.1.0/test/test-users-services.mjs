import * as usersServices from "../services/users-services.mjs";
import {errors} from "../commons/internal-errors.mjs";
import assert from 'assert';

// Here, we are considering a mock test with data in memory created hard-coded.
// TODO: use dependency injection to specify the data input (next lessons).

describe("Testing Tasks Management API services with mock users data", () => {
    // User 2 token
    const userToken = "f1d1cdbc-97f0-41c4-b206-051250684b19";
    const regExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    describe("Adding a new user", () => {
        // Arrange

        it("Adding username xyz", () => {
            // Arrange
            // Act
            const resp1 = usersServices.addUser("xyz");
            const resp2 = usersServices.getUserId(resp1.token);
            // Assert
            assert.match(resp1.token, regExp);
            assert.deepEqual(resp2, 3);
        });
    });
    describe("Cases of internal error", () => {
        // Arrange

        it("Adding undefined username", () => {
            // Arrange
            const error = errors.INVALID_USER();
            // Act
            const resp = usersServices.addUser();
            // Assert
            assert.deepEqual(resp, error);
        });
        it("Adding username abc 2 times; second time should return an internal error", () => {
            // Arrange
            const error = errors.USER_ALREADY_EXISTS("abc");
            // Act
            const resp1 = usersServices.addUser("abc");
            const resp2 = usersServices.addUser("abc");
            // Assert
            assert.match(resp1.token, regExp);
            assert.deepEqual(resp2, error);
        });
    });
    describe("Getting information from a user", () => {
        it("Getting userId by a token", () => {
            // Arrange
            // Act
            const id = usersServices.getUserId(userToken);
            // Assert
            assert.deepStrictEqual(id, 2, `Token ${userToken} should return 2`);
        });
    });
});