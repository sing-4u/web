const storeToken = (accessToken: string, refreshToken: string) => {
    Object.entries({ accessToken, refreshToken }).forEach(([key, value]) =>
        localStorage.setItem(key, value)
    );
};

export default storeToken;
