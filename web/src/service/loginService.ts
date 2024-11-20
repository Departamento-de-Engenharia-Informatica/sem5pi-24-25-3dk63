import { inject } from "inversify";
import type { HttpService } from "./IService/HttpService";
import { ILoginService } from "./IService/ILoginService";
import { injectable } from "inversify";
import { TYPES } from "@/inversify/types";

@injectable()
export class LoginService implements ILoginService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async fetchClaims(): Promise<{ type: string; value: string }[]> {
    try {
      const res = await this.http.get<any>("/claims", {
        headers: { withCredentials: "true" },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching claims:", error);
      throw new Error("Error fetching claims.");
    }
  }

  async getLoginClaims(): Promise<{ userRole: string; redirectTo: string }> {
    try {
      const claims = await this.fetchClaims();

      const userRole = claims.find(
        (claim: { type: string; value: string }) =>
          claim.type === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      )?.value;

      if (userRole === "Admin") {
        return { userRole, redirectTo: "/admin" };
      } else if (userRole === "Patient") {
        return { userRole, redirectTo: "/patient" };
      } else if (
        userRole === "Doctor" ||
        userRole === "Nurse" ||
        userRole === "Technician"
      ) {
        return { userRole, redirectTo: "/staff" };
      } else {
        return { userRole: userRole ?? "Guest", redirectTo: "/" };
      }
    } catch (error) {
      console.error("Error processing claims:", error);
      throw new Error("Error processing claims.");
    }
  }

  async loginWithToken(token: string): Promise<void> {
    try {
      const response = await this.http.post<any>(
        "/weblogin",
        { token },
        {
          headers: { withCredentials: "true" },
        }
      );

      if (!response.data) {
        const errorMessage = response.data?.Message || "Login failed.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Error during login process.");
    }
  }
}
