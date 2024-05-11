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

    static IsValidAdministratorUser(User, isLogged) {
        if(SecurityService.IsValidString(User.name) && SecurityService.IsValidString(User.role)) {
            return(User.name === "Chanza Administrator" && User.role === "admin" && isLogged);
        }
    }

    static IsValidEmail(email) {
        return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    }

    static IsValidPhone(phone) {
        return typeof phone === 'string' && /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phone);
    }

    static IsValidUser(user) {
        return (SecurityService.IsValidString(user.name) && 
                SecurityService.IsValidString(user.lastname) && 
                SecurityService.IsValidString(user.surname) &&
                SecurityService.IsValidEmail(user.email) &&
                SecurityService.IsValidPhone(user.phone) &&
                SecurityService.IsValidString(user.user) &&
                SecurityService.IsValidPassword(user.password)); 
    }
}