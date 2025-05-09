
export const msalConfig = {
    auth: {
        clientId: '7aea0121-a8b0-4094-9406-f78fa1933880', 
        authority: 'https://login.microsoftonline.com/83c7fbc3-e17c-4339-99f3-2d147e2fb8f9/	', 
        redirectUri: '/', 
    },
    cache: {
        cacheLocation: 'sessionStorage', 
        storeAuthStateInCookie: false, 
    }
};

export const loginRequest = {
    scopes: [],
};
