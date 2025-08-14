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
exports.FirebaseService = void 0;
// src/firebase/firebase.service.ts
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const path_1 = require("path");
let FirebaseService = class FirebaseService {
    constructor() {
        if (!admin.apps.length) {
            // JSON file se load kar rahe ho
            const serviceAccount = require((0, path_1.join)(__dirname, '../../firebase-service-account.json'));
            // Initialize app
            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        else {
            this.app = admin.app(); // Agar pehle se initialized hai
        }
    }
    getAuth() {
        return this.app.auth();
    }
    getFirestore() {
        return this.app.firestore();
    }
    // Ye tumhare auth.service.ts ke liye shortcut method hai
    getDb() {
        return this.getFirestore();
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map