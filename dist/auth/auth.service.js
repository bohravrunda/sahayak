"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let AuthService = class AuthService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async sendOtp(dto) {
        const db = this.firebaseService.getDb();
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        await db.collection('otp_verifications').doc(dto.email).set({
            name: dto.name,
            otp,
            createdAt: new Date(),
            verified: false,
        });
        // TODO: Send OTP to email using nodemailer or any email service
        console.log(`OTP for ${dto.email}: ${otp}`);
        return { message: 'OTP sent to email' };
    }
    async verifyOtp(dto) {
        const db = this.firebaseService.getDb();
        const record = await db.collection('otp_verifications').doc(dto.email).get();
        if (!record.exists)
            throw new common_1.BadRequestException('No OTP found for this email');
        const data = record.data();
        if ((data === null || data === void 0 ? void 0 : data.otp) !== dto.verificationCode) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await db.collection('otp_verifications').doc(dto.email).update({
            verified: true,
        });
        return { message: 'OTP verified successfully' };
    }
    async completeRegistration(dto) {
        var _a, _b;
        const db = this.firebaseService.getDb();
        const otpRecord = await db.collection('otp_verifications').doc(dto.email).get();
        if (!otpRecord.exists || !((_a = otpRecord.data()) === null || _a === void 0 ? void 0 : _a.verified)) {
            throw new common_1.BadRequestException('OTP not verified');
        }
        // Save user in users collection
        await db.collection('users').doc(dto.email).set({
            name: (_b = otpRecord.data()) === null || _b === void 0 ? void 0 : _b.name,
            email: dto.email,
            password: dto.password, // 🔒 Ideally hash this with bcrypt before storing
            createdAt: new Date(),
        });
        // Delete OTP record after registration
        await db.collection('otp_verifications').doc(dto.email).delete();
        return { message: 'Registration completed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map