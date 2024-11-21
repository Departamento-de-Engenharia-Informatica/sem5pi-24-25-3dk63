import { inject, injectable } from "inversify";

import { TYPES } from "@/inversify/types";
import { Role } from "@/model/Role";
import { User } from "@/model/User";

import type { HttpService } from "./IService/HttpService";
import { IUserService, UserSession } from "./IService/IUserService";
import routeconfiguration from "@/config/routeconfiguration.json";

import axios from "axios";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.api) private http: HttpService,
    @inject(TYPES.localStorage) private localStorage: Storage
  ) {}

  async register(user: User): Promise<UserSession> {
    const res = await this.http.post<UserSession>(routeconfiguration.USER_SIGNUP, {
      ...user,
    });
    return res.data as UserSession;
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.http.get<User>(routeconfiguration.USER_ME);
    return res.data;
  }

  async getRequests(): Promise<User[]> {
    const requests = await this.http.get<User[]>(routeconfiguration.USER_REQUESTS);
    return requests.data;
  }

  async deleteUser(): Promise<void> {
    await this.http.delete(routeconfiguration.USERS);
  }

  async updateUser(user: Partial<User>): Promise<User> {
    const res = await this.http.put<User>(routeconfiguration.USERS, user);
    return res.data;
  }

  async getAllRoles(): Promise<Role[]> {
    const res = await this.http.get(routeconfiguration.ROLES);
    return res.data as Role[];
  }

  async acceptRequest(id: string): Promise<void> {
    await this.http.patch(`${routeconfiguration.USERS}/${id}/accept`, {});
  }

  async rejectRequest(id: string): Promise<void> {
    await this.http.patch(`${routeconfiguration.USERS}/${id}/reject`, {});
  }

  async getUserId(): Promise<string> {
    const response =
      await this.http.get<{ type: string; value: string }[]>(routeconfiguration.CLAIMS);

    const claims: { type: string; value: string }[] = response.data;

    const userClaim = claims.find(
      (claim: { type: string; value: string }) => claim.type === "UserId"
    );

    return userClaim ? userClaim.value : "null";
  }
}
