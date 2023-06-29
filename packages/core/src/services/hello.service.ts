export default class HelloService {
    helloMsg(client: string) {
        return `Hello ${client}, from RPC API!`;
    }
}
