
export const msalConfig = {
    auth: {
        clientId: '2ae327e5-8b4c-42e5-a326-b0e0f5723988', 
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

export const apiScopes = ["api://7aea0121-a8b0-4094-9406-f78fa1933880/Update-Delete"];
