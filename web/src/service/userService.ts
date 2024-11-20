import { inject, injectable } from "inversify";

import { TYPES } from "@/inversify/types";
import { Role } from "@/model/Role";
import { User } from "@/model/User";

import type { HttpService } from "./IService/HttpService";
import { IUserService, UserSession } from "./IService/IUserService";

import axios from "axios";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.api) private http: HttpService,
    @inject(TYPES.localStorage) private localStorage: Storage
  ) {}

  async register(user: User): Promise<UserSession> {
    const res = await this.http.post<UserSession>("/users/signup", {
      ...user,
    });
    return res.data as UserSession;
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.http.get<User>("/me");
    return res.data;
  }

  async getRequests(): Promise<User[]> {
    const requests = await this.http.get<User[]>("/requests");
    return requests.data;
  }

  async deleteUser(): Promise<void> {
    await this.http.delete("/users");
  }

  async updateUser(user: Partial<User>): Promise<User> {
    const res = await this.http.put<User>("/users", user);
    return res.data;
  }

  async getAllRoles(): Promise<Role[]> {
    const res = await this.http.get("/roles");
    return res.data as Role[];
  }

  async acceptRequest(id: string): Promise<void> {
    await this.http.patch(`/users/${id}/accept`, {});
  }

  async rejectRequest(id: string): Promise<void> {
    await this.http.patch(`/users/${id}/reject`, {});
  }

  async getUserId(): Promise<string> {
    const response =
      await this.http.get<{ type: string; value: string }[]>("/claims");

    const claims: { type: string; value: string }[] = response.data;

    const userClaim = claims.find(
      (claim: { type: string; value: string }) => claim.type === "UserId"
    );

    return userClaim ? userClaim.value : "null";
  }
}
