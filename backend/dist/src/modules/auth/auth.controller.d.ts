import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthTokens>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthTokens>;
    refresh(dto: RefreshTokenDto): Promise<import("./auth.service").AuthTokens>;
    logout(req: any, dto: RefreshTokenDto): Promise<void>;
    getMe(req: any): any;
}
