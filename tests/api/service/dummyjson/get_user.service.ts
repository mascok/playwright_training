import { authContext } from "../../context/api.context";

export class userService {
    async getUser() {
        try {
            const context = await authContext();
            const response = await context.get('auth/products');

            const data = await response.json();
            const status = response.status();

            return {
                data: data,
                status: status
            };
        } catch (e) {
            throw e;
        }
    }
}