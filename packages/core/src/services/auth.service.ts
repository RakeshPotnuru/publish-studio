export default class AuthService {
    register(first_name: string, last_name: string) {
        return `Hello ${first_name} ${last_name}, from RPC API!`;
    }
    login(email: string) {
        return `Hello ${email}, from RPC API!`;
    }
}
