export interface ILoginService {
    getLoginClaims(): Promise<{ userRole: string; redirectTo: string }>
    fetchClaims(): Promise<{ type: string; value: string }[]>;
    loginWithToken(token: string): Promise<void>;
}
