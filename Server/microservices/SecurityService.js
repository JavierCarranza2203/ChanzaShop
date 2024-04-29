export class SecurityService {
    static IsValidString(string) {
        return typeof string === 'string' && /^[a-zA-Z\s]+$/.test(string);
    }
    
    static IsValidNumber(number) {
        const num = parseInt(number);
        return typeof num === 'number' && !isNaN(num) && Number.isInteger(num) && num >= 0;
    }

    static IsValidPassword(password) {
        return typeof password === 'string' && /^[a-zA-Z0-9*_]+$/.test(password);
    }
    
}