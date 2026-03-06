import { Account, Client, ID } from "appwrite";
import env from "../config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setProject(env.appwriteProjectId).setEndpoint(env.appwriteUrl);
    this.account = new Account(this.client);
  }

  async createUser({ email, password, name }) {
    try {
      const user = await this.account.create({
        userId: ID.unique(),
        email: email,
        password: password,
        name: name,
      });

      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: createUser :: error", error);
    }
  }

  async login({ email, password }) {
    try {
      const result = await this.account.createEmailPasswordSession({
        email: email,
        password: password,
      });

      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: login :: error", error);
      if (error) {
        console.log(error.message);
      }
    }
  }

  async getCurrentUser() {
    try {
      const userData = await this.account.get();
      if (userData) {
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: getCurrentUser :: error", error);
    }

    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite serive :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
